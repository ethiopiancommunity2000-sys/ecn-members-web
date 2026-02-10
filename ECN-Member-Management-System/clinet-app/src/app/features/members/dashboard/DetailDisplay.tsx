import React, { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
         DialogActions, CircularProgress, Typography, Table, TableBody,
         TableCell, TableHead, TableRow, Collapse, Paper,
         } from '@mui/material';
import { format } from 'date-fns';

import { Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material';
import MemberCard from './MemberCard';
import { useStore } from '../../../stores/store';
import ReceiptThumbnail from '../../../../../component/ReceiptThumbnail';

const DetailDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { memberStore } = useStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(true);
  
  // Load full member details with all related data
  // Always reload when id changes to ensure fresh data (especially after updates)
  React.useEffect(() => {
    if (id) {
      console.log('DetailDisplay - Loading member with ID:', id);
      // Clear selectedMember first to force fresh reload
      memberStore.clearSelectedMember();
      memberStore.loadMember(id);
    }
  }, [id, memberStore]);
  
  // Use selectedMember if available and matches the id, otherwise fall back to members list
  // Always prefer selectedMember if it exists and matches, as it has the most complete data
  const member = memberStore.selectedMember?.id === id
    ? memberStore.selectedMember 
    : memberStore.members.find(m => m.id === id);
  
  // Log memberFiles for debugging
  React.useEffect(() => {
    if (member) {
      console.log('DetailDisplay - Member loaded:', {
        id: member.id,
        memberFilesCount: member.memberFiles?.length ?? 0,
        hasMemberFiles: !!member.memberFiles && member.memberFiles.length > 0,
        source: memberStore.selectedMember?.id === id ? 'selectedMember' : 'membersList',
        paymentsCount: member.payments?.length ?? 0
      });
      if (member.memberFiles && member.memberFiles.length > 0) {
        console.log('DetailDisplay - MemberFiles:', member.memberFiles.map(f => ({
          id: f.id,
          fileName: f.fileName,
          paymentId: f.paymentId,
          fileDescription: f.fileDescription
        })));
      } else {
        console.warn('DetailDisplay - WARNING: Member has no MemberFiles!');
      }
      if (member.payments && member.payments.length > 0) {
        console.log('DetailDisplay - Payments:', member.payments.map(p => ({
          id: p.id,
          amount: p.paymentAmount,
          date: p.paymentDate
        })));
      }
    }
  }, [member, id, memberStore]);

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    if (!isDeleting) {
      setOpenDialog(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!id || !member) return;

    setIsDeleting(true);
    try {
      await memberStore.deleteMember(id);
      setOpenDialog(false);
      navigate('/memberList');
    } catch (error) {
      console.error('Error deleting member:', error);
      setIsDeleting(false);
      // Keep dialog open on error so user can try again or cancel
    }
  };

  if (!memberStore.members) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading...</Typography>
      </Box>
    );
  }

  if (!member) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading member...</Typography>
      </Box>
    );
  }

  const formatSafeDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return !isNaN(d.getTime()) ? format(d, "dd MMM yyyy") : "N/A";
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount == null) return "N/A";
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <>
      <MemberCard member={member} onDeleteClick={handleDeleteClick} />

      {/* Payment Details Section */}
      <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Payment Details
          </Typography>
          <Button
            onClick={() => setShowPaymentDetails(!showPaymentDetails)}
            variant="outlined"
            size="small"
          >
            {showPaymentDetails ? 'Hide' : 'Show'} Details
          </Button>
        </Box>
        
        <Collapse in={showPaymentDetails} timeout="auto" unmountOnExit>
          <Box margin={1}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Number of Event</TableCell>
                  <TableCell>Incident Date</TableCell>
                  <TableCell>Payment Amount</TableCell>
                  <TableCell>Date of Payment</TableCell>
                  <TableCell>Payment description</TableCell>
                  <TableCell>Payment Slips</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {member.payments && member.payments.length > 0 ? (
                  member.payments.map((payment, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {member.incidents && member.incidents[idx]
                          ? member.incidents[idx].eventNumber
                          : member.incidents && member.incidents.length > 0
                          ? member.incidents[0].eventNumber
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {member.incidents &&
                        member.incidents[idx] &&
                        member.incidents[idx].incidentDate
                          ? formatSafeDate(
                              member.incidents[idx].incidentDate
                            )
                          : member.incidents &&
                            member.incidents[idx] &&
                            member.incidents[idx].paymentDate
                          ? formatSafeDate(
                              member.incidents[idx].paymentDate
                            )
                          : member.incidents &&
                            member.incidents.length > 0
                          ? formatSafeDate(
                              member.incidents[0].incidentDate ||
                                member.incidents[0].paymentDate
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(payment.paymentAmount)}
                      </TableCell>
                      <TableCell>
                        {formatSafeDate(payment.paymentDate)}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const files = member.memberFiles ?? [];
                          
                          if (import.meta.env.DEV) {
                            console.log(`DetailDisplay - Payment Description for payment ${payment.id}:`, {
                              paymentId: payment.id,
                              totalFiles: files.length,
                              files: files.map(f => ({ id: f.id, paymentId: f.paymentId, fileName: f.fileName }))
                            });
                          }
                          
                          // Match receipt to payment - find all files for this payment
                          const matchedFiles = files.filter((f) => {
                            if (!f.paymentId || !payment.id) return false;
                            const filePaymentId = String(f.paymentId)
                              .trim()
                              .toLowerCase();
                            const paymentId = String(payment.id)
                              .trim()
                              .toLowerCase();
                            
                            if (import.meta.env.DEV) {
                              console.log(`DetailDisplay - Comparing: filePaymentId="${filePaymentId}" vs paymentId="${paymentId}"`);
                            }
                            
                            return filePaymentId === paymentId;
                          });

                          if (import.meta.env.DEV) {
                            console.log(`DetailDisplay - Matched ${matchedFiles.length} file(s) for payment ${payment.id}`);
                          }

                          // Use the first matched file for description
                          const file = matchedFiles.length > 0 ? matchedFiles[0] : null;
                          return file?.fileDescription || "N/A";
                        })()}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const files = member.memberFiles ?? [];

                          if (import.meta.env.DEV) {
                            console.log(`DetailDisplay - Payment Slips for payment ${payment.id}:`, {
                              paymentId: payment.id,
                              totalFiles: files.length,
                              files: files.map(f => ({ id: f.id, paymentId: f.paymentId, fileName: f.fileName }))
                            });
                          }

                          // Match receipt to payment - find all files for this payment
                          const matchedFiles = files.filter((f) => {
                            if (!f.paymentId || !payment.id) return false;
                            const filePaymentId = String(f.paymentId)
                              .trim()
                              .toLowerCase();
                            const paymentId = String(payment.id)
                              .trim()
                              .toLowerCase();
                            
                            if (import.meta.env.DEV) {
                              console.log(`DetailDisplay - Comparing: filePaymentId="${filePaymentId}" vs paymentId="${paymentId}"`);
                            }
                            
                            return filePaymentId === paymentId;
                          });
                          
                          if (import.meta.env.DEV) {
                            console.log(`DetailDisplay - Matched ${matchedFiles.length} file(s) for payment ${payment.id}`);
                          }

                          // Use the first matched file, or show N/A
                          const file = matchedFiles.length > 0 ? matchedFiles[0] : null;

                          if (!file?.id) {
                            return (
                              <Typography variant="body2">N/A</Typography>
                            );
                          }

                          // Show the matched file's name, or "View Receipt" if multiple files exist
                          const buttonText =
                            matchedFiles.length > 1
                              ? `View Receipt (${matchedFiles.length})`
                              : file.fileName || "View Receipt";

                          return (
                            <Button
                              component={RouterLink}
                              to={`/members/receipt/${file.id}`}
                              size="small"
                              variant="outlined"
                              sx={{ display: "flex", alignItems: "left", gap: 3 }}
                            >
                              {buttonText.includes('.')
                                ? buttonText.slice(0, buttonText.lastIndexOf('.'))
                                : buttonText}
                              <ReceiptThumbnail fileId={file.id} />
                            </Button>
                          );
                        })()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No payment information available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#d32f2f',
            fontWeight: 'bold',
          }}
        >
          <WarningIcon sx={{ fontSize: '2rem' }} />
          Confirm Delete Member
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description" sx={{ fontSize: '1rem', lineHeight: 1.8 }}>
            Are you sure you want to delete{' '}
            <strong>
              {member.firstName} {member.middleName} {member.lastName}
            </strong>
            ?
            <br />
            <br />
            This action <strong>cannot be undone</strong>. All associated data including addresses, family members,
            payments, incidents, and files will be permanently deleted.
            <br />
            <br />
            <strong>This member will be permanently removed from the system.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleDialogClose}
            disabled={isDeleting}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            variant="contained"
            color="error"
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            sx={{ minWidth: 100 }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ObservedDetailDisplay = observer(DetailDisplay);
export default ObservedDetailDisplay;
 






 