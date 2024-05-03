import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import Configuration from './Configuration';
import ImportFooter from '../elements/ImportFooter';
import ImportHeader from '../elements/ImportHeader';
import { ImportStep } from '..';
import Mapping from './Mapping';
import messageIds from 'features/import/l10n/messageIds';
import Preview from './Preview';
import SheetSettings from './SheetSettings';
import useConfigure from 'features/import/hooks/useConfigure';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useUIDataColumns from 'features/import/hooks/useUIDataColumns';

interface ConfigureProps {
  onClose: () => void;
  onRestart: () => void;
  onValidate: () => void;
}

const Configure: FC<ConfigureProps> = ({ onClose, onRestart, onValidate }) => {
  const messages = useMessages(messageIds);
  const [columnIndexBeingConfigured, setColumnIndexBeingConfigured] = useState<
    number | null
  >(null);
  const { orgId } = useNumericRouteParams();
  const theme = useTheme();
  const { forwardMessageDisabled, numRows, uiDataColumns } =
    useUIDataColumns(orgId);
  const [loading, setLoading] = useState(false);
  const getPreflightStats = useConfigure(orgId);

  return (
    <>
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
          overflow="hidden"
        >
          <ImportHeader activeStep={ImportStep.CONFIGURE} onClose={onClose} />
          <Box display="flex" flexGrow={1} overflow="hidden">
            <Box
              display="flex"
              flexDirection="column"
              sx={{ overflowY: 'auto' }}
              width="50%"
            >
              <SheetSettings
                clearConfiguration={() => setColumnIndexBeingConfigured(null)}
              />
              <Mapping
                clearConfiguration={() => setColumnIndexBeingConfigured(null)}
                columnIndexBeingConfigured={columnIndexBeingConfigured}
                columns={uiDataColumns}
                onConfigureStart={(columnIndex: number) =>
                  setColumnIndexBeingConfigured(columnIndex)
                }
              />
            </Box>
            <Box display="flex" flexDirection="column" width="50%">
              <Configuration
                uiDataColumn={
                  typeof columnIndexBeingConfigured == 'number'
                    ? uiDataColumns[columnIndexBeingConfigured]
                    : null
                }
              />
            </Box>
          </Box>
          <Preview />
          <ImportFooter
            onClickPrimary={async () => {
              setLoading(true);
              if (getPreflightStats) {
                await getPreflightStats();
              }
              onValidate();
              setLoading(false);
            }}
            onClickSecondary={onRestart}
            primaryButtonDisabled={forwardMessageDisabled}
            primaryButtonMsg={messages.actionButtons.validate()}
            secondaryButtonMsg={messages.actionButtons.restart()}
            statusMessage={
              forwardMessageDisabled
                ? messages.configuration.statusMessage.notDone()
                : messages.configuration.statusMessage.done({
                    numConfiguredPeople: numRows,
                  })
            }
          />
        </Box>
      )}
    </>
  );
};

export default Configure;
