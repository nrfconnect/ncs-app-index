/* Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

/** GitHub repo coordinates for fetching a nested west manifest. */
export type WestRepoRef = {
    owner: string;
    repo: string;
    revision: string;
};

export type FetchWestManifest = (repo: WestRepoRef) => Promise<string | undefined>;

const MAX_IMPORT_DEPTH = 6;

/** Strips YAML quotes and `tags/` prefix from a west revision string. */
export function normalizeWestRevision(revision: string): string {
    const trimmed = revision.trim().replace(/^['"]|['"]$/g, '');
    if (trimmed.startsWith('tags/')) {
        return trimmed.replace('tags/', '');
    }
    return trimmed;
}

type WestProject = {
    name?: string;
    repoPath?: string;
    url?: string;
    remote?: string;
    revision?: string;
    importManifest: boolean;
};

function lineIndent(line: string): number {
    const leading = line.match(/^(\s*)/)?.[1];
    return leading?.length ?? 0;
}

/** True for a manifest key at the same indent as `projects:` / `remotes:` (e.g. `defaults:`). */
function isSiblingManifestSection(line: string, sectionIndent: number): boolean {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith('#')) {
        return false;
    }
    if (lineIndent(line) !== sectionIndent) {
        return false;
    }
    if (/^-\s+/.test(trimmed)) {
        return false;
    }
    return /^[A-Za-z0-9_-]+:\s*($|\S)/.test(trimmed);
}

function endsManifestSection(line: string, sectionIndent: number): boolean {
    if (line.trim().length === 0 || line.trim().startsWith('#')) {
        return false;
    }
    const indent = lineIndent(line);
    if (indent < sectionIndent) {
        return true;
    }
    return isSiblingManifestSection(line, sectionIndent);
}

function stripInlineYamlComment(value: string): string {
    return value.replace(/\s+#.*$/, '').trim();
}

function parseRemotes(westYml: string): Map<string, string> {
    const remotes = new Map<string, string>();
    const lines = westYml.split('\n');
    let inRemotes = false;
    let remotesIndent: number | null = null;

    for (const line of lines) {
        const remotesMatch = line.match(/^(\s*)remotes:\s*$/);
        if (remotesMatch) {
            inRemotes = true;
            remotesIndent = remotesMatch[1]?.length ?? 0;
            continue;
        }
        if (inRemotes && remotesIndent !== null && endsManifestSection(line, remotesIndent)) {
            break;
        }
        if (!inRemotes) {
            continue;
        }

        if (/^\s*#/.test(line)) {
            continue;
        }

        const remoteMatch = line.match(/^\s*-\s*name:\s*(\S+)\s*$/);
        if (remoteMatch?.[1]) {
            remotes.set(remoteMatch[1], '');
            continue;
        }

        const urlMatch = line.match(/^\s*url-base:\s*(.+)\s*$/);
        if (urlMatch?.[1] && remotes.size > 0) {
            const lastRemote = [...remotes.keys()].at(-1);
            if (lastRemote) {
                remotes.set(lastRemote, urlMatch[1].trim().replace(/^['"]|['"]$/g, ''));
            }
        }
    }

    return remotes;
}

function parseProjects(westYml: string): WestProject[] {
    const lines = westYml.split('\n');
    const projects: WestProject[] = [];
    let inProjects = false;
    let projectsIndent: number | null = null;
    let current: WestProject | null = null;

    const flush = () => {
        if (current) {
            projects.push(current);
            current = null;
        }
    };

    for (const line of lines) {
        const projectsMatch = line.match(/^(\s*)projects:\s*(?:#.*)?$/);
        if (projectsMatch) {
            inProjects = true;
            projectsIndent = projectsMatch[1]?.length ?? 0;
            continue;
        }
        if (inProjects && projectsIndent !== null && endsManifestSection(line, projectsIndent)) {
            flush();
            break;
        }
        if (!inProjects) {
            continue;
        }

        if (/^\s*#/.test(line)) {
            continue;
        }

        const nameMatch = stripInlineYamlComment(line).match(/^\s*-\s*name:\s*(\S+)\s*$/);
        if (nameMatch?.[1]) {
            flush();
            current = { name: nameMatch[1], importManifest: false };
            continue;
        }

        if (!current) {
            continue;
        }

        const repoPathMatch = line.match(/^\s*repo-path:\s*(\S+)\s*$/);
        if (repoPathMatch?.[1]) {
            current.repoPath = repoPathMatch[1];
        }

        const urlMatch = line.match(/^\s*url:\s*(.+)\s*$/);
        if (urlMatch?.[1]) {
            current.url = urlMatch[1].trim().replace(/^['"]|['"]$/g, '');
        }

        const remoteMatch = line.match(/^\s*remote:\s*(\S+)\s*$/);
        if (remoteMatch?.[1]) {
            current.remote = remoteMatch[1];
        }

        const revisionMatch = line.match(/^\s*revision:\s*(.+)\s*$/);
        if (revisionMatch?.[1]) {
            current.revision = stripInlineYamlComment(revisionMatch[1]);
        }

        const importMatch = line.match(/^\s*import:\s*(.+)\s*$/);
        if (importMatch?.[1] && stripInlineYamlComment(importMatch[1]) === 'true') {
            current.importManifest = true;
        }
    }

    flush();
    return projects;
}

function githubRepoFromUrl(url: string): { owner: string; repo: string } | undefined {
    const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/i);
    if (!match?.[1] || !match[2]) {
        return undefined;
    }
    return { owner: match[1], repo: match[2] };
}

function projectToRepoRef(project: WestProject, remotes: Map<string, string>): WestRepoRef | undefined {
    if (!project.revision) {
        return undefined;
    }

    if (project.url) {
        const coords = githubRepoFromUrl(project.url);
        if (!coords) {
            return undefined;
        }
        return { ...coords, revision: normalizeWestRevision(project.revision) };
    }

    if (project.remote && project.repoPath) {
        const base = remotes.get(project.remote);
        if (!base) {
            return undefined;
        }
        const ownerMatch = base.match(/github\.com[/:]([^/]+)/i);
        const owner = ownerMatch?.[1] ?? 'nrfconnect';
        return {
            owner,
            repo: project.repoPath,
            revision: normalizeWestRevision(project.revision),
        };
    }

    return undefined;
}

function isNcsSdkProject(project: WestProject): boolean {
    return project.name === 'nrf' || project.repoPath === 'sdk-nrf';
}

/**
 * Reads the NCS SDK revision from a west manifest body (no GitHub fetch).
 * Returns undefined when the manifest only imports another project.
 */
export function extractNcsSdkRevisionFromWestManifest(westYml: string): string | undefined {
    for (const project of parseProjects(westYml)) {
        if (isNcsSdkProject(project) && project.revision) {
            return normalizeWestRevision(project.revision);
        }
    }
    return undefined;
}

/** Lists imported projects that may carry the NCS `nrf` revision in a nested manifest. */
export function listImportedWestManifestRefs(westYml: string): WestRepoRef[] {
    const remotes = parseRemotes(westYml);
    const refs: WestRepoRef[] = [];

    for (const project of parseProjects(westYml)) {
        if (!project.importManifest) {
            continue;
        }
        const repoRef = projectToRepoRef(project, remotes);
        if (repoRef) {
            refs.push(repoRef);
        }
    }

    return refs;
}

/**
 * Resolves the NCS SDK version for an add-on release.
 * Single-stage manifests (direct `nrf` project) and nested `import: true` chains are supported.
 */
export async function resolveNcsSdkRevisionFromWestManifest(
    westYml: string,
    fetchWest: FetchWestManifest,
    depth = 0,
): Promise<string | undefined> {
    const direct = extractNcsSdkRevisionFromWestManifest(westYml);
    if (direct) {
        return direct;
    }

    if (depth >= MAX_IMPORT_DEPTH) {
        return undefined;
    }

    for (const repoRef of listImportedWestManifestRefs(westYml)) {
        const nested = await fetchWest(repoRef);
        if (!nested) {
            continue;
        }
        const nestedSdk = await resolveNcsSdkRevisionFromWestManifest(nested, fetchWest, depth + 1);
        if (nestedSdk) {
            return nestedSdk;
        }
    }

    return undefined;
}
