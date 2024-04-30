/* Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { NormalisedApp } from '../schema';
import Select from 'react-select';

interface Props {
  app: NormalisedApp;
  onReleaseChosen: (tag: string) => void;
};

function ReleasesDropDownList({ app, onReleaseChosen }: Props): JSX.Element {
  console.log(app.releases ?? `${app.name} doesn't have releases`)
  const releases = [{ label: app.defaultBranch, value: app.defaultBranch }, ...app.releases.map((release) => ({ label: release.tag, value: release.tag ?? '' })),];

  return (
    <div className="font-thin max-w-[20%] min-w-[15%]">
      <Select
        instanceId={`${app.id}-release-select`}
        defaultValue={releases[0]}
        options={releases}
        menuPlacement="auto"
        onChange={(option) => { onReleaseChosen(option ? option.value : ""); }}
        hideSelectedOptions
        />
    </div>
  )
}

export default ReleasesDropDownList;
