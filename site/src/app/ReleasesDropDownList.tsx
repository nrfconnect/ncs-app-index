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
  const releases = [{ label: app.defaultBranch, value: app.defaultBranch }, ...app.releases.map((release) => ({ label: release.name, value: release.tag ?? '' })),];

  return (
    <Select
      instanceId={`${app.id}-release-select`}
      defaultValue={releases[0]}
      options={releases}
      className="dropdown"
      menuPlacement="auto"
      onChange={(option) => { onReleaseChosen(option ? option.value : ""); }}
      hideSelectedOptions={true}
    />
  )
}

export default ReleasesDropDownList;
