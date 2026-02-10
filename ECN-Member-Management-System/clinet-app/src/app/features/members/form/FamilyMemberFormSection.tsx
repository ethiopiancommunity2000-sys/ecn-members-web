import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import WarningIcon from '@mui/icons-material/Warning';
// import EditIcon from '@mui/icons-material/Edit'; // Optional
import { v4 as uuidv4 } from 'uuid';
import type { FamilyMember } from '../../../lib/types';

// type FamilyMember = {
//   id: string;
//   memberFamilyFirstName: string;
//   memberFamilyLastName: string;
//   memberFamilyMiddleName: string;
//   relationship: string;
// };

type Props = {
  familymembers: FamilyMember[];
  setFamilyMembers: Dispatch<SetStateAction<FamilyMember[]>>;
  memberId?: string;
  onSave?: (familyMembers: FamilyMember[]) => Promise<void>;
};

export default function FamilyMemberFormSection({
  familymembers,
  setFamilyMembers,
  memberId,
  onSave
}: Props) {
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updated = [...familymembers];
    updated[index] = { ...updated[index], [name]: value };
    setFamilyMembers(updated);
  };

  const handleAdd = () => {
    setFamilyMembers([
      ...familymembers,
      {
        id: uuidv4(),
        memberFamilyFirstName: '',
        memberFamilyMiddleName: '',
        memberFamilyLastName: '',
        relationship: ''
      }
    ]);
  };

  const handleRemoveClick = (index: number) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleRemoveConfirm = () => {
    if (deleteIndex !== null) {
      const updated = [...familymembers];
      updated.splice(deleteIndex, 1);
      setFamilyMembers(updated);
      setDeleteDialogOpen(false);
      setDeleteIndex(null);
    }
  };

  const handleRemoveCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const handleSave = async () => {
    if (!memberId || !onSave) return;
    setSaving(true);
    try {
      await onSave(familymembers);
    } catch (error) {
      console.error('Failed to save family members:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
      <Box mt={3}>
        <Typography variant="h6">Family Members</Typography>
        {familymembers.map((family, index) => (
          <Box
            key={family.id}
            display="grid"
            gridTemplateColumns="repeat(6, 1fr)"
            gap={2}
            alignItems="center"
            mt={2}
          >
            <TextField
              label="First Name"
              name="memberFamilyFirstName"
              value={family.memberFamilyFirstName}
              onChange={(e) => handleChange(index, e)}
            />
            <TextField
              label="Middle Name"
              name="memberFamilyMiddleName"
              value={family.memberFamilyMiddleName}
              onChange={(e) => handleChange(index, e)}
            />
            <TextField
              label="Last Name"
              name="memberFamilyLastName"
              value={family.memberFamilyLastName}
              onChange={(e) => handleChange(index, e)}
            />
            <TextField
              label="Relationship"
              name="relationship"
              value={family.relationship}
              onChange={(e) => handleChange(index, e)}
            />
            <Box />
            <Box display="flex" justifyContent="end" gap={1}>
              <IconButton onClick={() => handleRemoveClick(index)} color="error">
                <DeleteIcon />
              </IconButton>
              {/* Uncomment and implement edit functionality if needed
              <IconButton onClick={() => handleEdit(index)}>
                <EditIcon />
              </IconButton>
              */}
            </Box>
          </Box>
        ))}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button onClick={handleAdd} variant="outlined">
            Add Family Member
          </Button>
          {/* {memberId && onSave && (
            <Button 
              onClick={handleSave} 
              variant="contained" 
              color="primary"
              startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Family Members'}
            </Button>
          )} */}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleRemoveCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d32f2f' }}>
          <WarningIcon />
          Confirm Delete Family Member
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this family member record?
            <br />
            <br />
            <strong>Important:</strong> After deleting, remember to click the <strong>"Save Family Members"</strong> button to save your changes, and then click the <strong>"Update"</strong> button to finalize the update.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleRemoveConfirm} color="error" variant="contained" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
