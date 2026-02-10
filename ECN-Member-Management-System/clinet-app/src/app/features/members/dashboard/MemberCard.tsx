import {  Box, Button,Card, CardActions, CardContent, CardHeader, Chip,
  Table, TableBody, TableCell, TableHead, TableRow, Typography, Collapse,
  IconButton, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, Grid,} from "@mui/material";

import { Delete as DeleteIcon, ExpandMore, ExpandLess, LocationOn,} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";

import type { Member } from "../../../lib/types";
import { useStore } from "../../../stores/store";

type Props = {
  member: Member;
  onDeleteClick?: () => void;
};

export default function MemberCard({ member, onDeleteClick }: Props) {
  const navigate = useNavigate();
  const { memberStore } = useStore();
  const { loadMember, setEditMode } = memberStore;

  const familyMembers = member.familyMembers ?? [];

  const [showFamilyMembers, setShowFamilyMembers] = useState(false);
  // const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  useEffect(() => {
    if (member?.id) {
      setEditMode(true);
      loadMember(member.id);
    } else {
      setEditMode(false);
    }
  }, [member?.id, loadMember, setEditMode]);

  const navigateList = () => navigate("/memberList");

  const handleUpdate = () => {
    navigate(`/edit/${member.id}`);
  };

  const formatSafeDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return !isNaN(d.getTime()) ? format(d, "dd MMM yyyy") : "N/A";
  };

  const formatCurrency = (amount?: number) => {
    if (amount == null) return "N/A";
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

const formatAddress = (
  addr?: NonNullable<Member["addresses"]>[number]
) => {
  if (!addr) return "N/A";

  const main = [addr.street, addr.city, addr.state]
    .filter(Boolean)
    .join(", ");

  const zip = addr.zipCode ? ` ${addr.zipCode}` : "";
  const country = addr.country ? `, ${addr.country}` : "";

  return `${main}${zip}${country}`.trim() || "N/A";
};



  return (
    <Grid container justifyContent="center" mt={10}>
      <Grid>
        <Card sx={{ borderRadius: 3, backgroundColor: "#f5f5f5" }}>
          <CardHeader
            title={
              <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
                {member.firstName} {member.lastName}
              </Typography>
            }
            sx={{
              backgroundColor: "#006663",
              color: "white",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />

          <CardContent>
            <Typography mb={2} variant="h6">
              <strong>Email:</strong> {member.email}
            </Typography>

            <Typography mb={2} variant="h6">
              <strong>Phone:</strong> {member.phoneNumber}
            </Typography>

            {/* ADDRESSES */}
            <Box mb={3}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#006663", mb: 1 }}
              >
                Addresses
              </Typography>

              {member.addresses?.length ? (
                <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                  <List disablePadding>
                    {member.addresses.map((addr, idx) => (
                      <Box key={addr.id || idx}>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemIcon sx={{ minWidth: 40, color: "#006663" }}>
                            <LocationOn />
                          </ListItemIcon>
                          <ListItemText
                            primary={formatAddress(addr)}
                            secondary={
                              addr.street && addr.city
                                ? `${addr.street} • ${addr.city}`
                                : undefined
                            }
                          />
                        </ListItem>
                        {/* {idx < member.addresses.length - 1 && <Divider />} */}
                        <Divider />
                      </Box>
                    ))}
                  </List>
                </Paper>
              ) : (
                <Typography color="text.secondary">
                  No address on file
                </Typography>
              )}
            </Box>

            {/* BIO */}
            {member.bio && (
              <Box>
              <Chip
                label={member.bio}
                variant="outlined"
                sx={{
                  mt: 3,
                  backgroundColor: "grey.100",
                  color: "white",
                  fontWeight: 700,
                  padding: 2.5,
                }}
              />
              </Box>
            )}

            {/* REGISTER DATE */}
            <Typography mt={3} variant="body2" color="primary">
              <strong>Member since:</strong> {formatSafeDate(member.registerDate)}
            </Typography>

            {/* FAMILY MEMBERS + PAYMENTS */}
            <Box mt={4}>
              <Grid container spacing={3}>
                {/* FAMILY MEMBERS */}
                {familyMembers.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#006663" }}
                      >
                        Family Members ({familyMembers.length})
                      </Typography>

                      <IconButton
                        onClick={() => setShowFamilyMembers(!showFamilyMembers)}
                        sx={{ color: "#006663" }}
                      >
                        {showFamilyMembers ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>

                    <Collapse in={showFamilyMembers}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>First</TableCell>
                            <TableCell>Middle</TableCell>
                            <TableCell>Last</TableCell>
                            <TableCell>Relation</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {familyMembers.map((fm, idx) => (
                            <TableRow key={fm.id || idx}>
                              <TableCell>
                                {fm.memberFamilyFirstName || "N/A"}
                              </TableCell>
                              <TableCell>
                                {fm.memberFamilyMiddleName || "N/A"}
                              </TableCell>
                              <TableCell>
                                {fm.memberFamilyLastName || "N/A"}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={fm.relationship || "N/A"}
                                  size="small"
                                  sx={{
                                    backgroundColor: "#006663",
                                    color: "white",
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </Grid>
                )}
              </Grid>
            </Box>
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end", p: 2, gap: 1 }}>
            <Button onClick={navigateList}>Cancel</Button>

            {onDeleteClick && (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onDeleteClick}
              >
                Delete
              </Button>
            )}

            <Button variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
