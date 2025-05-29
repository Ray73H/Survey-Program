import React from 'react';
import { TextField, Box, IconButton, Tooltip } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';

function CopyableTextField({ label, value }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset "copied" state after 1.5 seconds
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
        label={label}
        value={value}
        InputProps={{
          readOnly: true, // Makes the TextField uneditable
        }}
        variant="outlined" // Or "filled" or "standard"
        fullWidth
      />
      <Tooltip title={copied ? "Copied!" : "Click to copy"}>
        <IconButton onClick={handleCopyToClipboard} aria-label="copy to clipboard">
          <FileCopyIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default CopyableTextField;