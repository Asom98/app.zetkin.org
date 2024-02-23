import { Clear } from '@mui/icons-material';
import { FC } from 'react';
import {
  Box,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';

import { ImportStep } from '..';
import messageIds from '../../../l10n/messageIds';
import { Msg } from 'core/i18n';

interface ImportHeaderProps {
  activeStep?: ImportStep;
  onClose?: () => void;
}

const ImportHeader: FC<ImportHeaderProps> = ({ activeStep, onClose }) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      paddingBottom={1}
    >
      <Typography variant="h4">
        <Msg id={messageIds.configuration.title} />
      </Typography>
      <Box alignItems="center" display="flex" justifyContent="flex-end">
        {activeStep && (
          <Stepper activeStep={activeStep} sx={{ flexGrow: 1 }}>
            <Step>
              <StepLabel>
                <Msg id={messageIds.steps.upload} />
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Msg id={messageIds.steps.configure} />
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Msg id={messageIds.steps.validate} />
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Msg id={messageIds.steps.import} />
              </StepLabel>
            </Step>
          </Stepper>
        )}
        {onClose && (
          <IconButton onClick={onClose}>
            <Clear color="secondary" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default ImportHeader;
