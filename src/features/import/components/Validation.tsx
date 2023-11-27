import { FC } from 'react';
import { Box, Stack } from '@mui/system';
import { Typography, useTheme } from '@mui/material';

import AddedOrgs from './AddedOrgs';
import AddedTags from './AddedTags';
import ChangedFields from './ChangedFields';
import ImportAlert from './ImportAlert';
import ImportFooter from './ImportFooter';
import messageIds from 'features/import/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useValidationStep from '../hooks/useValidationStep';
import { Msg, useMessages } from 'core/i18n';

export interface FakeDataType {
  summary: {
    membershipsCreated: {
      byOrganization: {
        [key: number]: number;
      };
      total: number;
    };
    peopleCreated: {
      total: number;
    };
    peopleUpdated: {
      byField: {
        [key: string]: number;
      };
      total: number;
    };
    tagsCreated: {
      byTag: {
        [key: number]: number;
      };
      total: number;
    };
  };
}

interface ValidationProps {
  onClickBack: () => void;
  onImport: () => void;
}

const Validation: FC<ValidationProps> = ({ onClickBack, onImport }) => {
  const fake = {
    summary: {
      membershipsCreated: {
        byOrganization: {
          1: 10,
          2: 10,
          4: 10,
          7: 10,
        },
        total: 60,
      },
      peopleCreated: {
        total: 60,
      },
      peopleUpdated: {
        byField: {
          alt_phone: 20,
          city: 2,
          date_of_birth: 25,
          email: 10,
          first_name: 25,
          gender: 3,
          join_date: 20,
          last_name: 20,
          zip_code: 2,
        },
        total: 100,
      },
      tagsCreated: {
        byTag: {
          11: 20,
          12: 20,
          9: 20,
        },
        total: 60,
      },
    },
  };
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const {
    orgsWithNewPeople,
    addedTags,
    alerts,
    importDisabled,
    onCheckAlert,
    statusMessage,
  } = useValidationStep(orgId, fake.summary);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box display="flex" mt={3} overflow="hidden">
        <Box
          display="flex"
          flexDirection="column"
          sx={{ overflowY: 'scroll' }}
          width="50%"
        >
          <Typography sx={{ mb: 2 }} variant="h5">
            <Msg id={messageIds.validation.pendingChanges} />
          </Typography>
          <Box display="flex" flexDirection="column" height="100%">
            <Stack direction="row" spacing={2}>
              <Box
                border={1}
                borderColor={theme.palette.grey[300]}
                borderRadius={1}
                padding={2}
                width="100%"
              >
                <Msg
                  id={messageIds.validation.updateOverview.created}
                  values={{
                    numPeople: fake.summary.peopleCreated.total,
                    number: (
                      <Typography
                        sx={{
                          color: theme.palette.success.main,
                        }}
                        variant="h2"
                      >
                        {fake.summary.peopleCreated.total}
                      </Typography>
                    ),
                  }}
                />
              </Box>
              <Box
                border={1}
                borderColor={theme.palette.grey[300]}
                borderRadius={1}
                padding={2}
                width="100%"
              >
                <Msg
                  id={messageIds.validation.updateOverview.updated}
                  values={{
                    numPeople: fake.summary.peopleUpdated.total,
                    number: (
                      <Typography
                        sx={{
                          color: theme.palette.info.light,
                        }}
                        variant="h2"
                      >
                        {fake.summary.peopleUpdated.total}
                      </Typography>
                    ),
                  }}
                />
              </Box>
            </Stack>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <ChangedFields
                changedFields={fake.summary.peopleUpdated.byField}
                orgId={orgId}
              />
              {addedTags.length > 0 && (
                <AddedTags
                  addedTags={addedTags}
                  numPeopleWithTagsAdded={fake.summary.tagsCreated.total}
                />
              )}
              {orgsWithNewPeople.length > 0 && (
                <AddedOrgs
                  numPeopleWithOrgsAdded={fake.summary.membershipsCreated.total}
                  orgsWithNewPeople={orgsWithNewPeople}
                />
              )}
            </Stack>
          </Box>
        </Box>
        <Box ml={2} sx={{ overflowY: 'scroll' }} width="50%">
          <Typography sx={{ mb: 2 }} variant="h5">
            <Msg id={messageIds.validation.messages} />
          </Typography>
          <Box display="flex" flexDirection="column">
            <Stack spacing={2}>
              {alerts.map((alert, index) => (
                <ImportAlert
                  key={`alert-${index}`}
                  alert={alert}
                  onCheck={() => onCheckAlert(index)}
                  onClickBack={onClickBack}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
      <ImportFooter
        onClickPrimary={onImport}
        onClickSecondary={onClickBack}
        primaryButtonDisabled={importDisabled}
        primaryButtonMsg={messages.actionButtons.import()}
        secondaryButtonMsg={messages.actionButtons.back()}
        statusMessage={statusMessage}
      />
    </Box>
  );
};

export default Validation;
