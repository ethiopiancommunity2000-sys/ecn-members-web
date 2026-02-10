import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import { Box, TextField, Button, IconButton, Typography, Paper, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import WarningIcon from '@mui/icons-material/Warning';
import { v4 as uuidv4 } from 'uuid';
import type { Address } from '../../../lib/types';


 
type Props = {
  addresses: Address[];
  setAddresses: Dispatch<SetStateAction<Address[]>>;
  memberId?: string;
  onSave?: (addresses: Address[]) => Promise<void>;
};

export default function AddressFormSection({ addresses, setAddresses, memberId, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = [...addresses];
    updated[index] = { ...updated[index], [name]: value };
    setAddresses(updated);
  };

  const handleAdd = () => {
    setAddresses([
      ...addresses,
      { id: uuidv4(), street: '', city: '', state: '', country: '', zipCode: '' }
    ]);
  };

  const handleRemoveClick = (index: number) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleRemoveConfirm = () => {
    if (deleteIndex !== null) {
      const updated = [...addresses];
      updated.splice(deleteIndex, 1);
      setAddresses(updated);
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
      await onSave(addresses);
    } catch (error) {
      console.error('Failed to save addresses:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
      <Box mt={3}>
        <Typography variant="h6">Addresses</Typography>
        {addresses.map((address, index) => (
          <Box
            key={address.id}
            display="grid"
            gridTemplateColumns="repeat(6, 1fr)"
            gap={2}
            alignItems="center"
            mt={2}
          >
            <TextField
              label="Street"
              name="street"
              value={address.street}
              onChange={(e) => handleChange(index, e)}
            />
            <TextField
              label="City"
              name="city"
              value={address.city}
              onChange={(e) => handleChange(index, e)}
            />
            <TextField
              label="State"
              name="state"
              value={address.state}
              onChange={(e) => handleChange(index, e)}
            />
            <TextField
              label="Country"
              name="country"
              value={address.country}
              onChange={(e) => handleChange(index, e)}
            />
            <TextField
              label="Zip Code"
              name="zipCode"
              value={address.zipCode}
              onChange={(e) => handleChange(index, e)}
            />
            <IconButton onClick={() => handleRemoveClick(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button onClick={handleAdd} variant="outlined">
            Add Address
          </Button>
          {/* {memberId && onSave && (
            <Button 
              onClick={handleSave} 
              variant="contained" 
              color="primary"
              startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Addresses'}
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
          Confirm Delete Address
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this address record?
            <br />
            <br />
            <strong>Important:</strong> After deleting, remember to click the <strong>"Save Addresses"</strong> button to save your changes, and then click the <strong>"Update"</strong> button to finalize the update.
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
