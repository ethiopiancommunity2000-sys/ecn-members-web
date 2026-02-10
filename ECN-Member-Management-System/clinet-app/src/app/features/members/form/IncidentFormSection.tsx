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
  DialogActions,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import WarningIcon from '@mui/icons-material/Warning';
import { v4 as uuidv4 } from 'uuid';
import type { Incident } from '../../../lib/types';
import { useCallback, useState, type ChangeEvent } from 'react';

type Props = {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  memberId?: string;
  onSave?: (incidents: Incident[]) => Promise<void>;
};

const incidentTypes = ['NaturalDeath', 'AccidentalDeath'];

export default function IncidentFormSection({ incidents, setIncidents, memberId, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleChange = useCallback(
    (index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setIncidents(prev => {
        const updated: Incident[] = [...prev];
        if (name === 'eventNumber') {
          const parsed = value === '' ? 0 : parseInt(value, 10);
          updated[index] = { ...updated[index], eventNumber: Number.isNaN(parsed) ? 0 : parsed };
        } else {
          updated[index] = { ...updated[index], [name]: value };
        }
        return updated;
      });
    }, [setIncidents]);



  const handleAdd = () => {
    setIncidents([
      ...incidents,
      {
        id: uuidv4(),
        incidentDate: '',
        paymentDate: '',
        eventNumber: 0,
        incidentType: 'NaturalDeath',
        incidentDescription: ''
      }
    ]);
  };

  const handleRemoveClick = (index: number) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleRemoveConfirm = () => {
    if (deleteIndex !== null) {
      const updated = [...incidents];
      updated.splice(deleteIndex, 1);
      setIncidents(updated);
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
      await onSave(incidents);
    } catch (error) {
      console.error('Failed to save incidents:', error);
    } finally {
      setSaving(false);
    }
  };




  return (

    <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>

 
      <Box mt={3}>
        <Typography variant="h6">Incidents</Typography>
        {incidents.map((incident, index) => (
          <Box
            key={incident.id}
            display="grid"
            gridTemplateColumns="repeat(4, minmax(0, 1fr)) 2fr auto"
            gap={2}
            alignItems="center"
            mt={2}
          >
            <TextField
              label="Incident Date"
              type="date"
              name="incidentDate"
              value={incident.incidentDate || ''}
              onChange={(e) => handleChange(index, e)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Payment Date"
              type="date"
              name="paymentDate"
              value={incident.paymentDate || ''}
              onChange={(e) => handleChange(index, e)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              select
              label="Incident Type"
              name="incidentType"
              value={incident.incidentType || ''}
              onChange={(e) => handleChange(index, e)}
            >
              {incidentTypes.map(option => (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Event Number"
              name="eventNumber"
              type="number"
              value={incident.eventNumber ?? 0}
              onChange={(e) => handleChange(index, e)}
            />

            <TextField
              label="Description"
              name="incidentDescription"
              value={incident.incidentDescription || ''}
              onChange={(e) => handleChange(index, e)}
              multiline
              minRows={2}
            />

            <IconButton onClick={() => handleRemoveClick(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button onClick={handleAdd} variant="outlined">
            Add Incident
          </Button>
          {/* {memberId && onSave && (
            <Button 
              onClick={handleSave} 
              variant="contained" 
              color="primary"
              startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Incidents'}
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
          Confirm Delete Incident
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this incident record?
            <br />
            <br />
            <strong>Important:</strong> After deleting, remember to click the <strong>"Save Incidents"</strong> button to save your changes, and then click the <strong>"Update"</strong> button to finalize the update.
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
