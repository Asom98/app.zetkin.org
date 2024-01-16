import { FC } from 'react';
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

import AddedOrgs from './elements/AddedOrgs';
import AddedTags from './elements/AddedTags';
import ChangedFields from './elements/ChangedFields';
import CreatedAndUpdated from './elements/CreatedAndUpdated';
import ImportFooter from './elements/ImportFooter';
import ImportHeader from './elements/ImportHeader';
import ImportMessageList from './elements/ImportMessageList';
import { ImportStep } from '.';
import messageIds from 'features/import/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import usePreflight from '../../hooks/usePreflight';
import { Msg, useMessages } from 'core/i18n';

interface PreflightProps {
  onClose: () => void;
  onClickBack: () => void;
  onImportDone: () => void;
  onImportStart: () => void;
}

const Preflight: FC<PreflightProps> = ({
  onClickBack,
  onClose,
  onImportDone,
  onImportStart,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();

  const preflightData = usePreflight(orgId);

  if (!preflightData) {
    return null;
  }

  const {
    orgsWithNewPeople,
    addedTags,
    importDisabled,
    importPeople,
    loading,
    onAllChecked,
    problems,
    statusMessage,
    summary,
  } = preflightData;

  return (
    <Box display="flex" flexDirection="column" height={loading ? '' : '90vh'}>
      <ImportHeader
        activeStep={loading ? undefined : ImportStep.PREFLIGHT}
        onClose={loading ? undefined : onClose}
      />
      {loading && (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          paddingY={4}
        >
          <CircularProgress sx={{ color: theme.palette.statusColors.blue }} />
          <Typography sx={{ color: theme.palette.text.primary }}>
            {messages.importStatus.loadingState()}
          </Typography>
        </Box>
      )}
      {!loading && (
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="space-between"
          overflow="hidden"
        >
          <Box display="flex" mt={3} overflow="hidden">
            <Box
              display="flex"
              flexDirection="column"
              sx={{ overflowY: 'auto' }}
              width="50%"
            >
              <CreatedAndUpdated summary={summary} />
              <Stack spacing={2} sx={{ mt: 2 }}>
                <ChangedFields
                  changedFields={summary.updated.byChangedField}
                  initializedFields={summary.updated.byInitializedField}
                  orgId={orgId}
                />
                {addedTags.length > 0 && (
                  <AddedTags
                    addedTags={addedTags}
                    numPeopleWithTagsAdded={summary.tagged.total}
                  />
                )}
                {orgsWithNewPeople.length > 0 && (
                  <AddedOrgs
                    numPeopleWithOrgsAdded={summary.addedToOrg.total}
                    orgsWithNewPeople={orgsWithNewPeople}
                  />
                )}
              </Stack>
            </Box>
            <Box ml={2} sx={{ overflowY: 'auto' }} width="50%">
              <Typography sx={{ mb: 2 }} variant="h5">
                <Msg id={messageIds.validation.messages} />
              </Typography>
              <Box display="flex" flexDirection="column">
                <ImportMessageList
                  onAllChecked={onAllChecked}
                  onClickBack={onClickBack}
                  problems={problems}
                />
              </Box>
            </Box>
          </Box>
          <ImportFooter
            onClickPrimary={async () => {
              onImportStart();
              await importPeople();
              onImportDone();
            }}
            onClickSecondary={onClickBack}
            primaryButtonDisabled={importDisabled}
            primaryButtonMsg={messages.actionButtons.import()}
            secondaryButtonMsg={messages.actionButtons.back()}
            statusMessage={statusMessage}
          />
        </Box>
      )}
    </Box>
  );
};

export default Preflight;
