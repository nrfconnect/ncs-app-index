/* Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { NormalisedApp } from '../schema';
import Select, {components, ControlProps, CSSObjectWithLabel, DropdownIndicatorProps, MenuProps } from 'react-select';
import { GitBranchIcon } from '@primer/octicons-react';
import { useState } from 'react';

interface Props {
  app: NormalisedApp;
  onReleaseChosen: (tag: string | null | undefined) => void;
};

type ReleaseOption = {
  readonly label: string,
  readonly value: string
};

const Control = ({children, ...props}: ControlProps<ReleaseOption, false>) => {
  return (
    <>
      <components.Control {...props}>
        <GitBranchIcon size={18}/> {children}
      </components.Control>
    </>
  )
};

const HiddenComponent = () => null;

function ReleasesDropDownList({ app, onReleaseChosen }: Props): JSX.Element {

  const releases: ReleaseOption[] = [{ label: app.defaultBranch, value: app.defaultBranch },
          ...app.releases.map((release) => ({ label: release.tag, value: release.tag ?? '' }))];
  const selectStyles = {
    control: (base: CSSObjectWithLabel, state: ControlProps<ReleaseOption>) => ({
      ...base,
      cursor: 'pointer',
      borderRadius: 0,
      minHeight: '30px',
      height: '33px',
      paddingLeft: 8,
      alignContent: 'center',
    }),
    dropdownIndicator: (base: CSSObjectWithLabel, state: DropdownIndicatorProps<ReleaseOption, false>) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 4,
      display: !state.isFocused ? 'block' : 'none',
      scale: '0.7'
    }),
    menu: (base: CSSObjectWithLabel, state: MenuProps<ReleaseOption, false>) => ({
      ...base,
      marginTop: 2,
      marginBottom: 2,
      borderRadius: 0
    })
  };

  const [selectedRelease, setSelectedRelease] = useState(releases[0]?.label);

  return (
    <div className="font-thin max-w-[15%] min-w-[15%]" title={`Release '${selectedRelease}' selected`}>
      <Select
        styles={selectStyles}
        instanceId={`${app.id}-release-select`}
        noOptionsMessage={() => 'No more releases'}
        isMulti={false}
        menuPlacement="auto"
        defaultValue={releases[0]}
        options={releases}
        onChange={(newValue) => { onReleaseChosen(newValue?.label); setSelectedRelease(newValue?.label); }}
        hideSelectedOptions
        components={{ Control: Control, IndicatorSeparator: HiddenComponent }}
        isSearchable={false}
      />
    </div>
  )
}

export default ReleasesDropDownList;
