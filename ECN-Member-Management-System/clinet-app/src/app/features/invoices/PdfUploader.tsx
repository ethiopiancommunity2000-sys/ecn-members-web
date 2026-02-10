import type { ChangeEvent, FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import agent from '../../lib/api/agent';
import type { Member } from '../../lib/types';

interface UploadFilesProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string; // optional, default to images and PDFs
  label?: string;  // optional custom label
  member:Member
}

const UploadFiles: FC<UploadFilesProps> = ({
  files = [], // fallback to empty array
  onFilesChange,
  accept = '.png,.jpg,.jpeg,.pdf',
  label = 'Upload Files',
  member,
}) => {
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && member?.id) {
      const selectedFiles = Array.from(event.target.files);
      onFilesChange(selectedFiles);
      
      // Upload files if member ID is available
      try {
        await agent.Members.uploadFiles(member.id, selectedFiles);
      } catch (error) {
        console.error('File upload failed:', error);
      }
    }
  };

  return (
    <Box>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="upload-files-input"
        type="file"
        multiple
        onChange={handleChange}
      />
      <label htmlFor="upload-files-input">
        <Button variant="contained" component="span">
          {label}
        </Button>
      </label>

      <Box mt={2}>
        <Typography variant="subtitle1">Selected Files:</Typography>
       {Array.isArray(files) && files.length === 0 ? (
  <Typography variant="body2" color="textSecondary">No files selected.</Typography>
) : (
  files.map((file, index) => (
    <Typography key={index} variant="body2">
      {file.name}
    </Typography>
  ))
)}

      </Box>
    </Box>
  );
};

export default UploadFiles;
