/* Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

/** Like ncs-matter with comments between project entries (must not truncate the projects list). */
export const NCS_MATTER_WEST_WITH_COMMENTS = `# Copyright (c) 2026 Nordic Semiconductor ASA
manifest:
  remotes:
    - name: ncs
      url-base: https://github.com/nrfconnect

  projects:
    - name: nrf
      remote: ncs
      repo-path: sdk-nrf
      revision: v3.4.0  # NCS release tag
      import: true

# Connected Home IP stack
    - name: matter
      remote: ncs
      path: modules/lib/matter
      repo-path: sdk-connectedhomeip
      revision: d92ebd4a7766806ad891957dc23ab7850f93e4d4

  self:
    path: ncs-matter
`;

/** Trimmed from nrfconnect/ncs-matter (single-stage: nrf revision in top manifest). */
export const NCS_MATTER_WEST = `# Copyright (c) 2026 Nordic Semiconductor ASA
manifest:
  remotes:
    - name: ncs
      url-base: https://github.com/nrfconnect

  projects:
    - name: nrf
      remote: ncs
      repo-path: sdk-nrf
      revision: v3.4.0
      import: true
    - name: matter
      remote: ncs
      path: modules/lib/matter
      repo-path: sdk-connectedhomeip
      revision: d92ebd4a7766806ad891957dc23ab7850f93e4d4

  self:
    path: ncs-matter
`;

/** Trimmed from nrfconnect/ncs-matter-edge-ai (imports sdk-edge-ai). */
export const NCS_MATTER_EDGE_AI_WEST = `manifest:
  version: "0.13"

  projects:
    - name: sdk-edge-ai
      url: https://github.com/nrfconnect/sdk-edge-ai
      path: sdk-edge-ai
      revision: v2.2.0
      import: true

  self:
    path: matter-edge-ai
`;

/** Two-stage add-on with an inline comment on import (common in west.yml). */
export const NCS_MATTER_EDGE_AI_WEST_COMMENTED_IMPORT = `manifest:
  version: "0.13"

  projects:
    - name: sdk-edge-ai
      url: https://github.com/nrfconnect/sdk-edge-ai
      path: sdk-edge-ai
      revision: v2.2.0
      import: true # import SDK projects

  self:
    path: matter-edge-ai
`;

/** Trailing defaults.revision must not overwrite the last project revision. */
export const NCS_MATTER_WEST_WITH_DEFAULTS = `manifest:
  remotes:
    - name: ncs
      url-base: https://github.com/nrfconnect

  projects:
    - name: nrf
      remote: ncs
      repo-path: sdk-nrf
      revision: v3.4.0
      import: true

  defaults:
    revision: main

  self:
    path: ncs-matter
`;

/** Column-zero comment immediately after projects: (must not truncate the list). */
export const NCS_MATTER_WEST_COMMENT_AFTER_PROJECTS = `manifest:
  remotes:
    - name: ncs
      url-base: https://github.com/nrfconnect

  projects:
# SDK dependency
    - name: nrf
      remote: ncs
      repo-path: sdk-nrf
      revision: v3.4.0
      import: true

  self:
    path: ncs-matter
`;

/** Trimmed from nrfconnect/sdk-edge-ai@v2.2.0 (nested nrf project). */
export const SDK_EDGE_AI_WEST = `manifest:
  remotes:
    - name: ncs
      url-base: https://github.com/nrfconnect

  projects:
    - name: nrf
      remote: ncs
      repo-path: sdk-nrf
      revision: v3.4.0
      import: true

  self:
    path: edge-ai
`;
