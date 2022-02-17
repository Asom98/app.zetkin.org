import Autocomplete from '@material-ui/lab/Autocomplete';
import { Box, Button, TextField } from '@material-ui/core';
import React, { ChangeEvent } from 'react';

import { PersonOrganisation } from 'utils/organize/people';
import { ZetkinOrganization } from 'types/zetkin';

interface OrganisationSelectProps {
  memberships: PersonOrganisation[];
  onSelect: (selected: ZetkinOrganization) => void;
  onSubmit: (selected: ZetkinOrganization) => void;
  options: ZetkinOrganization[];
  selected?: ZetkinOrganization;
}

const OrganisationSelect: React.FunctionComponent<OrganisationSelectProps> = ({
  memberships,
  onSelect,
  onSubmit,
  options,
  selected,
}) => {
  const onChange = (
    evt: ChangeEvent<Record<string, string>>,
    selectedOrg: ZetkinOrganization | null
  ) => {
    if (selectedOrg) onSelect(selectedOrg || undefined);
  };

  return (
    <Box display="flex" flexDirection="row" width="100%">
      <Box flex={1} maxWidth="100%">
        <Autocomplete
          clearOnEscape
          fullWidth
          getOptionDisabled={(option) =>
            memberships.map((m) => m.id).includes(option.id) ||
            !option.is_active
          }
          getOptionLabel={(option) =>
            `${option.title}${option.is_active ? '' : ' (inactive)'}`
          }
          inputValue={selected?.title || ''}
          onChange={onChange}
          options={options}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Sub-organisation"
              variant="outlined"
            />
          )}
        />
      </Box>
      <Box
        style={{
          marginRight: selected ? 0 : -100,
          opacity: selected ? 1 : 0,
          transition: 'all 200ms ease',
        }}
      >
        <Button
          color="primary"
          disabled={!selected}
          onClick={() => {
            if (selected) onSubmit(selected);
          }}
          style={{ height: '100%', marginLeft: 10 }}
          variant="contained"
        >
          submit
        </Button>
      </Box>
    </Box>
  );
};

export default OrganisationSelect;
