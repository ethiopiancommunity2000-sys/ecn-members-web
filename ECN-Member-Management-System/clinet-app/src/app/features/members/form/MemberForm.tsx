import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import agent from "../../../lib/api/agent";

import AddressFormSection from "./AddressFormSection";
import FamilyMemberFormSection from "./FamilyMemberFormSection";
import PaymentFormSection from "./PaymentFormSection";
import IncidentFormSection from "./IncidentFormSection";
import type {
  Member,
  Address,
  FamilyMember,
  Payment,
  Incident,
  MemberFile,
} from "../../../lib/types";
import { useStore } from "../../../stores/store";

const defaultMember: Member = {
  id: "",
  firstName: "",
  receiverId: "",
  middleName: "",
  lastName: "",
  email: "",
  registerDate: "",
  phoneNumber: "",
  isAdmin: false,
  userName: "",
  password: "",
  addresses: [],
  familyMembers: [],
  payments: [],
  incidents: [],
  memberFiles: [],
  isActive: true, // New members are active by default
};

const formatCurrencyValue = (amount?: number) => {
  if (amount == null || isNaN(amount)) return "N/A";
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

function MemberForm() {
  const { memberStore } = useStore();
  const { selectedMember, editMode, setEditMode, loadMember } = memberStore;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [member, setMember] = useState<Member>(defaultMember);

  //  MUST come before selectedFile



  const [addresses, setAddresses] = useState<Address[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  //1 chnage
  const [memberFiles, setMemberFiles] = useState<MemberFile[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const [fileDescription, setFileDescription] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  //2 chnage
  const memberFiles1 = selectedMember?.memberFiles ?? [];

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email);
  // In edit mode, show all sections even if middleName is empty
  // For new members, require all base fields including middleName
  const isBaseInfoFilled = editMode
    ? !!(
        member.firstName &&
        member.lastName &&
        isEmailValid &&
        member.phoneNumber &&
        (!member.isAdmin ||
          (member.isAdmin && member.userName && (editMode || member.password)))
      )
    : !!(
        member.firstName &&
        member.middleName &&
        member.lastName &&
        isEmailValid &&
        member.phoneNumber &&
        (!member.isAdmin ||
          (member.isAdmin && member.userName && (editMode || member.password)))
      );

  useEffect(() => {
    if (id) {
      setEditMode(true);
      // Always ensure we load the member when id changes
      // This ensures we have the latest data even if selectedMember exists
      const currentMemberId = selectedMember?.id
        ? String(selectedMember.id)
        : null;
      const routeId = String(id);

      if (currentMemberId !== routeId) {
        if (import.meta.env.DEV) {
          console.log(
            "MemberForm - Loading member:",
            routeId,
            "Current selectedMember:",
            currentMemberId
          );
        }
        loadMember(id).catch((error) => {
          console.error("MemberForm - Error loading member:", error);
          // Show error to user - you could set an error state here
        });
      } else if (import.meta.env.DEV) {
        console.log(
          "MemberForm - Member already loaded and matches route:",
          routeId
        );
      }
    } else {
      setEditMode(false);
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id to reload when route changes
  // Note: loadMember and setEditMode are from MobX store and are stable references

  useEffect(() => {
    if (editMode && selectedMember && selectedMember.id === id) {
      // const formattedDate = selectedMember.registerDate
      //   ? new Date(selectedMember.registerDate).toISOString().split('T')[0]
      //   : '';
      const formattedDate = (() => {
        const d = new Date(selectedMember.registerDate || "");
        return !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "";
      })();

      // Ensure all fields are set, even if empty (especially middleName)
      setMember({
        ...selectedMember,
        registerDate: formattedDate,
        middleName: selectedMember.middleName || "", // Ensure middleName is at least empty string
        firstName: selectedMember.firstName || "",
        lastName: selectedMember.lastName || "",
        email: selectedMember.email || "",
        phoneNumber: selectedMember.phoneNumber || "",
        password: "", // Always reset password to empty string so user can enter new one
        userName: selectedMember.userName || "", // Ensure userName is set
      });
      setAddresses(selectedMember.addresses ?? []);
      setFamilyMembers(selectedMember.familyMembers ?? []);

      // Log payments for debugging
      setPayments(selectedMember.payments ?? []);
      setIncidents(selectedMember.incidents ?? []);
      const filesToSet = selectedMember.memberFiles ?? [];
      console.log(
        "MemberForm - Setting memberFiles from selectedMember:",
        filesToSet.length
      );
      if (filesToSet.length > 0) {
        console.log(
          "MemberForm - MemberFiles:",
          filesToSet.map((f) => ({
            id: f.id,
            fileName: f.fileName,
            paymentId: f.paymentId,
          }))
        );
      }
      setMemberFiles(filesToSet);
    } else if (!editMode) {
      // Only reset form if we're not in edit mode (i.e., creating a new member)
      resetForm();
    }
    // If we're in edit mode but don't have selectedMember yet, don't reset - wait for it to load
  }, [editMode, selectedMember, id]);

  const resetForm = () => {
    setMember(defaultMember);
    setAddresses([]);
    setFamilyMembers([]);
    setPayments([]);
    setIncidents([]);
    setMemberFiles([]);
    setFiles([]);
    setSelectedPaymentId("");
    setFileDescription("");
  };

  const handleInputChange = (key: keyof Member, value: string | boolean) => {
    setMember((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancel = () => {
    resetForm();
    navigate("/memberList");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedMember: Member = {
      ...member,
      addresses,
      familyMembers,
      payments,
      incidents,
      memberFiles,
    };

    try {
      if (editMode) {
        if (import.meta.env.DEV) {
          console.log("MemberForm - Submitting update with:", {
            hasFiles: files.length > 0,
            fileCount: files.length,
            fileDescription: fileDescription || "none",
            selectedPaymentId: selectedPaymentId || "none",
            memberId: member.id,
          });
        }

        // Clear selectedMember and edit mode BEFORE update to force fresh reload
        memberStore.clearSelectedMember();
        memberStore.setEditMode(false);

        // Perform the update
        await agent.Members.update(
          updatedMember,
          files,
          fileDescription || undefined,
          selectedPaymentId || undefined
        );

        // IMMEDIATELY redirect to memberList - don't wait for anything
        console.log(
          "MemberForm - Update successful, redirecting to memberList immediately"
        );

        // Clear form state before navigation
        resetForm();

        // Navigate immediately with replace to prevent back button issues
        navigate("/memberList", { replace: true });

        // Reload member list in background to ensure fresh data
        setTimeout(async () => {
          try {
            await memberStore.loadAllMembers();
          } catch (loadError) {
            console.error(
              "Error reloading member list after update:",
              loadError
            );
          }
        }, 100);

        return; // Exit early to prevent any further execution
      } else {
        const result = await agent.Members.create(updatedMember, files);
        // Verify the result is valid (should be a string ID)
        if (
          typeof result !== "string" &&
          !(
            result &&
            typeof result === "object" &&
            "value" in result &&
            typeof result.value === "string"
          )
        ) {
          throw new Error(
            "Unexpected response format from server during create."
          );
        }

        navigate("/memberList"); // Navigate immediately
        setTimeout(async () => {
          try {
            await memberStore.loadAllMembers(); // Reload in background
          } catch (loadError) {
            console.error(
              "Error reloading member list after create:",
              loadError
            );
          }
        }, 100);
      }

      // Clear file inputs after successful update/create
      setFiles([]);
      setFileDescription("");
      setSelectedPaymentId("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: unknown) {
      console.error("Error saving member:", error);

      // Even on error, clear state and redirect to memberList to prevent staying in edit mode
      memberStore.clearSelectedMember();
      memberStore.setEditMode(false);
      resetForm();
      navigate("/memberList", { replace: true });

      // Show error message
      if (error instanceof Error) {
        alert(`Failed to save member: ${error.message}`);
      } else {
        alert("Failed to save member. Please try again.");
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      // Append new files to existing ones (allows multiple selections)
      setFiles((prev) => [...prev, ...Array.from(fileList)]);
    }
  };

  useEffect(() => {
    if (
      selectedPaymentId &&
      !payments.some((p) => p.id === selectedPaymentId)
    ) {
      setSelectedPaymentId("");
    }
  }, [payments, selectedPaymentId]);

  const handleUpload = async () => {
    if (!files.length || !member.id) return;

    try {
      await agent.Members.uploadFiles(
        member.id,
        files,
        fileDescription || undefined,
        selectedPaymentId || undefined
      );

      // Reload member details to get updated memberFiles
      const refreshed = await agent.Members.details(member.id);
      if (refreshed) {
        setMemberFiles(refreshed.memberFiles ?? []);
      }

      // Clear the file input
      setFiles([]);
      setSelectedPaymentId("");
      setFileDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handlePaymentSelection = (event: SelectChangeEvent<string>) => {
    setSelectedPaymentId(event.target.value);
  };

  // Individual save handlers for each section
  const handleSaveAddresses = async (updatedAddresses: Address[]) => {
    if (!member.id) return;
    const updatedMember = { ...member, addresses: updatedAddresses };
    await agent.Members.update(updatedMember);
    // Reload member to get latest data
    const refreshed = await agent.Members.details(member.id);
    if (refreshed) {
      setAddresses(refreshed.addresses ?? []);
    }
  };

  const handleSaveFamilyMembers = async (
    updatedFamilyMembers: FamilyMember[]
  ) => {
    if (!member.id) return;
    const updatedMember = { ...member, familyMembers: updatedFamilyMembers };
    await agent.Members.update(updatedMember);
    // Reload member to get latest data
    const refreshed = await agent.Members.details(member.id);
    if (refreshed) {
      setFamilyMembers(refreshed.familyMembers ?? []);
    }
  };

  const handleSavePayments = async (updatedPayments: Payment[]) => {
    if (!member.id) return;
    const updatedMember = { ...member, payments: updatedPayments };
    await agent.Members.update(updatedMember);
    // Reload member to get latest data - use store's loadMember to ensure proper normalization
    await loadMember(member.id);
    // Update local state from the store's selectedMember (which is now normalized)
    if (memberStore.selectedMember) {
      const refreshedPayments = memberStore.selectedMember.payments ?? [];
      setPayments(refreshedPayments);
      setMember((prev) => ({
        ...prev,
        payments: refreshedPayments,
      }));
    }
  };

  const handleSaveIncidents = async (updatedIncidents: Incident[]) => {
    if (!member.id) return;
    const updatedMember = { ...member, incidents: updatedIncidents };
    await agent.Members.update(updatedMember);
    // Reload member to get latest data
    const refreshed = await agent.Members.details(member.id);
    if (refreshed) {
      setIncidents(refreshed.incidents ?? []);
    }
  };

  // Show loading only if we're in edit mode, have an id, and:
  // We don't have a selectedMember yet, OR the selectedMember doesn't match the current id
  // Note: We only check selectedMember here, not the form state, because the form state
  // is populated asynchronously in a useEffect once selectedMember is available
  // Use loose string comparison to handle any type differences
  const selectedMemberIdStr = selectedMember?.id
    ? String(selectedMember.id).trim()
    : "";
  const routeIdStr = id ? String(id).trim() : "";
  const hasMatchingMember =
    editMode &&
    routeIdStr &&
    selectedMember &&
    (selectedMemberIdStr === routeIdStr || selectedMember.id === id);

  // Debug logging (only in development)
  if (import.meta.env.DEV && editMode && id) {
    console.log("MemberForm - Loading check:", {
      editMode,
      routeId: id,
      routeIdStr,
      hasSelectedMember: !!selectedMember,
      selectedMemberId: selectedMember?.id,
      selectedMemberIdStr,
      hasMatchingMember,
      memberFirstName: selectedMember?.firstName,
    });
  }

  // Show loading if we're in edit mode with an id but don't have a matching member
  // Also add a timeout fallback - if we've been loading for a while, show the form anyway
  if (editMode && id && !hasMatchingMember) {
    return (
      <Box
        sx={{
          mt: 22,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "15vh",
        }}
      >
        <CircularProgress style={{ color: "green", width: 100, height: 100 }} />
        <Box sx={{ fontSize: "2rem", ml: 2, fontWeight: 700 }}>
          Loading Member...
        </Box>
        <Box sx={{ fontSize: "1rem", ml: 2, color: "text.secondary" }}>
          ID: {id} | Selected: {selectedMember?.id || "none"}
        </Box>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ backgroundColor: "#f5f5f5", padding: ".1px", pb: 4 }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom color="primary">
            {editMode ? "Edit Member" : "Register New Member"}
          </Typography>

          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            <TextField
              label="First Name"
              value={member.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
            />

            <TextField
              label="Middle Name"
              value={member.middleName || ""}
              onChange={(e) => handleInputChange("middleName", e.target.value)}
              required={!editMode}
              helperText={editMode ? "Optional" : ""}
            />

            <TextField
              label="Last Name"
              value={member.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required
            />

            <TextField
              label="Email"
              value={member.email ?? ""}
              onChange={(e) =>
                setMember((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />

            

            <TextField
              label="Phone Number"
              value={member.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />

            <TextField
              label="Register Date"
              type="date"
              value={member.registerDate || ""}
              onChange={(e) =>
                setMember((prev) => ({ ...prev, registerDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
      <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 3,
    width: "100%",
  }}
>
<TextField
  label="Account Number"
  value={member.receiverId ?? ""}
  onChange={(e) => {
    const value = e.target.value.trim();

    setMember((prev) => ({
      ...prev,
      receiverId: value === "" ? undefined : value,
    }));
  }}
  sx={{ flex: 1 }}
/>


  <FormControlLabel
    control={
      <Checkbox
        checked={member.isActive}
        onChange={(e) =>
          setMember((prev) => ({
            ...prev,
            isActive: e.target.checked,
          }))
        }
      />
    }
    label="Is Active"
  />

      <FormControlLabel
        control={
          <Checkbox
            checked={member.isAdmin}
            onChange={(e) =>
              setMember((prev) => ({
                ...prev,
                isAdmin: e.target.checked,
                // Clear password when toggling admin status to ensure clean state
                password: e.target.checked ? prev.password : "",
              }))
            }
          />
        }
        label="Is Admin"
      />
</Box>

          </Box>

          {/* Username and Password fields - only show when Is Admin is checked */}
          {member.isAdmin && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: "rgba(24, 42, 115, 0.05)",
                borderRadius: 2,
                border: "1px solid rgba(24, 42, 115, 0.2)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#182a73", fontWeight: "bold" }}
              >
                Admin Credentials
              </Typography>
              <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                <TextField
                  label="Username"
                  value={member.userName || ""}
                  onChange={(e) =>
                    setMember((prev) => ({ ...prev, userName: e.target.value }))
                  }
                  required={member.isAdmin}
                  helperText={
                    member.isAdmin && !member.userName
                      ? "Username is required for admin members"
                      : ""
                  }
                  fullWidth
                />
                <TextField
                  label="Password"
                  type="password"
                  value={member.password || ""}
                  onChange={(e) => {
                    setMember((prev) => ({ ...prev, password: e.target.value }));
                  }}
                  required={member.isAdmin && !editMode}
                  helperText={
                    member.isAdmin && !editMode && !member.password
                      ? "Password is required for new admin members"
                      : editMode
                      ? "Leave blank to keep current password"
                      : ""
                  }
                  fullWidth
                  autoComplete="new-password"
                />
              </Box>
            </Box>
          )}

          {isBaseInfoFilled && (
            <>
              <AddressFormSection
                addresses={addresses}
                setAddresses={setAddresses}
                memberId={member.id}
                onSave={editMode ? handleSaveAddresses : undefined}
              />
              <FamilyMemberFormSection
                familymembers={familyMembers}
                setFamilyMembers={setFamilyMembers}
                memberId={member.id}
                onSave={editMode ? handleSaveFamilyMembers : undefined}
              />
              <PaymentFormSection
                payments={payments}
                setPayments={setPayments}
                memberId={member.id}
                onSave={editMode ? handleSavePayments : undefined}
              />
              <IncidentFormSection
                incidents={incidents}
                setIncidents={setIncidents}
                memberId={member.id}
                onSave={editMode ? handleSaveIncidents : undefined}
              />

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {editMode && payments.length > 0 && (
                <FormControl sx={{ mt: 2, minWidth: 280 }}>
                  <InputLabel id="attach-payment-label">
                    Attach Receipt To
                  </InputLabel>
                  <Select
                    labelId="attach-payment-label"
                    value={selectedPaymentId}
                    label="Attach Receipt To"
                    onChange={handlePaymentSelection}
                  >
                    <MenuItem value="">No specific payment</MenuItem>
                    {payments.map((pmt, index) => (
                      <MenuItem value={pmt.id || ""} key={pmt.id || index}>
                        {`Payment ${index + 1} - ${formatCurrencyValue(
                          typeof pmt.paymentAmount === "number"
                            ? pmt.paymentAmount
                            : Number(pmt.paymentAmount)
                        )} (${pmt.paymentDate || "No date"})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Box mt={2}>
                <TextField
          label={
      <Box display="flex" alignItems="center" gap={1}>
        <span>Receipt Description</span>
        <span style={{ fontSize: "0.8rem", color: "#fd0101" }}>
          (Please update the payment first if this is a new payment before attaching the receipt.)
        </span>
      </Box>
    }
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  fullWidth
                  placeholder="e.g., February dues receipt"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Files
                </Button>
              </Box>

              {files.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle1">Selected Files:</Typography>
                  {files.map((file, index) => (
                    <Typography key={index} variant="body2">
                      {file.name}
                    </Typography>
                  ))}
                  {!editMode && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      These files will be uploaded when you click Create Member.
                    </Typography>
                  )}
                </Box>
              )}

              {editMode ? (
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleUpload}
                    disabled={files.length === 0 || !member.id}
                  >
                    Upload Selected Files
                  </Button>
                </Box>
              ) : null}
            </>
          )}

          <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
            <Button onClick={handleCancel} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isBaseInfoFilled}
            >
              {editMode ? "Update Member" : "Create Member"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

const ObservedMemberForm = observer(MemberForm);
export default ObservedMemberForm;
