import { useRef, type ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Typography } from '@mui/material';
import type { MemberFile } from '../../../lib/types';
import agent from '../../../lib/api/agent';

interface Props {
  memberFiles?: MemberFile[];
  setMemberFiles: (files: MemberFile[]) => void;
  memberId?: string;
}

function MemberFileFormSection({ memberFiles, setMemberFiles, memberId }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setMemberFiles(files.map((file: File) => ({ filePath: file.name } as MemberFile)));

    // Only upload if memberId is provided
    if (memberId && files.length > 0) {
      try {
        await agent.Members.uploadFiles(memberId, files);
        console.log('Files uploaded successfully');
      } catch (error) {
        console.error('Upload failed', error);
      }
    } else if (!memberId) {
      console.warn('Cannot upload files: memberId is required');
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Hidden input */}
      <input
        hidden
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
      />

      {/* Trigger button */}
      <Button
        sx={{ mt: 2, alignSelf: 'start' }}
        color="primary"
        size="large"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={handleUploadClick}
      >
        <Typography sx={{ fontSize: '1rem', p: 1 }}>
          Upload files here...
        </Typography>
      </Button>

      {/* File list */}
      <ul>
        {memberFiles?.map((memFile, index) => (
          <li key={index}>{memFile.filePath}</li>
        ))}
      </ul>
    </div>
  );
}

export default MemberFileFormSection;
