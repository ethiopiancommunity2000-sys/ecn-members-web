import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {  Box, Typography, Button, CircularProgress, Alert, Divider, IconButton, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip,} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState, useRef } from "react";
import agent from "../src/app/lib/api/agent";



const ReceiptImage = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const imageUrlRef = useRef<string | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!fileId) {
      setError("Invalid receipt ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    cancelledRef.current = false;

    // Revoke previous URL if it exists
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }

    agent.Members.getFile(fileId)
      .then((blob) => {
        // Don't update if effect was cancelled (fileId changed or unmounted)
        if (cancelledRef.current) {
          const url = URL.createObjectURL(blob);
          URL.revokeObjectURL(url); // Clean up immediately
          return;
        }

        const url = URL.createObjectURL(blob);
        imageUrlRef.current = url;
        setImageUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        // Don't update if effect was cancelled
        if (cancelledRef.current) return;

        console.error("Error loading receipt:", err);
        setError(err instanceof Error ? err.message : "Failed to load receipt");
        setLoading(false);
      });

    // Cleanup: mark as cancelled and revoke URL
    return () => {
      cancelledRef.current = true;
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
    };
  }, [fileId]);

  if (!fileId) {
    return (
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Alert severity="error">Invalid receipt ID</Alert>
        <Button component={RouterLink} to="/memberList" sx={{ mt: 2 }}>
          Back to Members
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading receipt…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button component={RouterLink} to="/memberList">
          Back to Members
        </Button>
      </Box>
    );
  }

  if (!imageUrl) {
    return (
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Alert severity="warning">Receipt not found</Alert>
        <Button component={RouterLink} to="/memberList" sx={{ mt: 2 }}>
          Back to Members
        </Button>
      </Box>
    );
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileId) return;

    setDeleting(true);
    setError(null);
    try {
      console.log("Attempting to delete file with ID:", fileId);
      await agent.Members.deleteFile(fileId);
      console.log("File deleted successfully");
      // Navigate back to member list after successful deletion
      navigate("/memberList");
    } catch (err: any) {
      console.error("Error deleting file:", err);
      const errorMessage = err?.response?.data?.error 
        || err?.response?.data 
        || err?.message 
        || "Failed to delete receipt";
      console.error("Error details:", {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data
      });
      setError(errorMessage);
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <Box sx={{ mt: 3, textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Receipt Preview</Typography>
      </Box>

      <Box
        component="img"
        src={imageUrl}
        alt="Receipt"
        sx={{
          maxWidth: "100%",
          maxHeight: "70vh",
          objectFit: "contain",
          border: "1px solid #ddd",
          borderRadius: 1,
          boxShadow: 2,
        }}
      />
      <Divider sx={{ my: 3 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
            gap: 4,
          mb: 2,
        }}
      >
        <Box>
          <Tooltip title="Delete payment slip">
        <IconButton
          color="error"
          onClick={handleDeleteClick}
          disabled={deleting}
          aria-label="delete receipt"
          sx={{
            "&:hover": {
              backgroundColor: "error.light",
              color: "error.contrastText",
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
        </Tooltip>
        </Box>
        <Box>
        <Button component={RouterLink} to="/memberList" variant="outlined">
          Back to Members
        </Button>
        </Box>
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Receipt?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this receipt? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting ? <CircularProgress size={20} /> : <DeleteIcon />
            }
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReceiptImage;
