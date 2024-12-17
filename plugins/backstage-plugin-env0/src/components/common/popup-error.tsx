import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@mui/material/Snackbar';
import React, { useState } from 'react';

export type PopupErrorProps = {
  error?: Error;
};

export const PopupError = ({ error }: PopupErrorProps) => {
  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(true);

  return (
    <Snackbar
      open={isErrorOpen}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => setIsErrorOpen(false)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        Failed to load templates from env0. Please try again later.
        {(error)?.message}
      </Alert>
    </Snackbar>
  );
};
