import * as React from "react";
import { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  Button,
  Container,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  TablePagination,
  Chip,
} from "@mui/material";
import PageviewIcon from "@mui/icons-material/Pageview";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { format } from "date-fns";

import { observer } from "mobx-react-lite";
import { SpaRounded } from "@mui/icons-material";
import type { Member } from "../src/app/lib/types";
import ReceiptThumbnail from "./ReceiptThumbnail";



type Props = {
  members: Member[];
};

const MemberList = function ({ members }: Props) {
  const [openMemberId, setOpenMemberId] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // --- Helpers ---
  const toggleOpen = (id: string) =>
    setOpenMemberId((prev) => (prev === id ? null : id));
  const handleDetailsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const memberId = event.currentTarget.getAttribute("data-member-id");
    if (memberId) navigate(`/card/${memberId}`);
  };
  const handleNavigateHome = () => members.length > 0 && navigate(`/home`);
  const handleSearchMember = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMember(event.target.value.toLowerCase());
    setPage(0);
  };
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  // --- Filter and paginate ---
  const searchedMembers = members.filter(
    (member) =>
      member.firstName.toLowerCase().includes(selectedMember) ||
      member.lastName.toLowerCase().includes(selectedMember) ||
      member.email.toLowerCase().includes(selectedMember) ||
      member.phoneNumber.toLowerCase().includes(selectedMember)
  );

  const paginatedMembers = searchedMembers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (

    <Container
      maxWidth="xl"
      sx={{ m: "auto", justifyContent: "space-between" }}
    >
      {members.length === 0 ? (
        <Box
          sx={{
            mt: 22,
            borderRadius: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "15vh",
            p: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "text.secondary" }}
          >
            No members found
          </Typography>
        </Box>
      ) : (
        <>
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 2,
              fontSize: "2rem",
            }}
          >
            Members' List
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 2,
            }}
          >
            <TextField
              label="Search by name, email, or phone number"
              variant="outlined"
              size="small"
              sx={{ width: "45ch" }}
              value={selectedMember}
              onChange={handleSearchMember}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <PageviewIcon sx={{ fontSize: "2rem" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {searchedMembers.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                fontWeight: 700,
                mb: 2,
                fontSize: "1.5rem",
                borderRadius: "1rem",
                p: 2,
              }}
            >
              <Chip
                icon={
                  <SpaRounded sx={{ fontSize: "2rem", color: "#006663" }} />
                }
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mt: 0.2,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#fd0101",
                        fontSize: "1.5rem",
                        color: "white",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      Sorry
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: "#f0f0f0",
                        color: "#000",
                        padding: "1rem .5rem",
                        borderRadius: "0.5rem",
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      <Typography>
                        We couldn’t find a member named <br />"{" "}
                        {selectedMember.toUpperCase()} "
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{
                  m: 3,
                  backgroundColor: "#fd0101",
                  padding: 2.5,
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "white",
                  wordBreak: "break-word",
                }}
              />
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ maxWidth: "100%", margin: "auto", borderRadius: "1rem" }}
            >
              <Table aria-label="collapsible table">
                <TableHead sx={{ backgroundColor: "lightblue" }}>
                  <TableRow>
                    <TableCell />
                    <TableCell>First Name</TableCell>
                    <TableCell>Middle Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Bio</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone number</TableCell>
                    <TableCell>View</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedMembers.map((member, index) => (
                    <React.Fragment key={index}>
                      <TableRow
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                        }}
                      >
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => toggleOpen(member.id ?? "")}
                          >
                            {openMemberId === member.id ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{member.firstName}</TableCell>
                        <TableCell>{member.middleName}</TableCell>
                        <TableCell>{member.lastName}</TableCell>
                        {/* BIO */}
                  <TableCell>
  <Typography variant="subtitle2" fontWeight={600}>
    Member since
  </Typography>


  <Typography mt={1} variant="caption" color="primary">
     {formatSafeDate(member.registerDate)}
  </Typography>
</TableCell>



             
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phoneNumber}</TableCell>
                        <TableCell>
                          <Button
                            onClick={handleDetailsClick}
                            data-member-id={member.id}
                            variant="contained"
                            color="secondary"
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={7}
                        >
                          <Collapse
                            in={openMemberId === member.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box margin={1}>
                              <Typography variant="h5" gutterBottom>
                                Payment Details
                              </Typography>
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
                                  {member.payments &&
                                  member.payments.length > 0 ? (
                                    member.payments.map((payment, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell>
                                          {member.incidents &&
                                          member.incidents[idx]
                                            ? member.incidents[idx].eventNumber
                                            : member.incidents &&
                                              member.incidents.length > 0
                                            ? member.incidents[0].eventNumber
                                            : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {member.incidents &&
                                          member.incidents[idx] &&
                                          member.incidents[idx].incidentDate
                                            ? formatSafeDate(
                                                member.incidents[idx]
                                                  .incidentDate
                                              )
                                            : member.incidents &&
                                              member.incidents[idx] &&
                                              member.incidents[idx].paymentDate
                                            ? formatSafeDate(
                                                member.incidents[idx]
                                                  .paymentDate
                                              )
                                            : member.incidents &&
                                              member.incidents.length > 0
                                            ? formatSafeDate(
                                                member.incidents[0]
                                                  .incidentDate ||
                                                  member.incidents[0]
                                                    .paymentDate
                                              )
                                            : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {formatCurrency(
                                            payment.paymentAmount
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          {formatSafeDate(payment.paymentDate)}
                                        </TableCell>
                                        <TableCell>
                                          {member.memberFiles &&
                                          member.memberFiles[idx]
                                            ? member.memberFiles[idx]
                                                .fileDescription
                                            : member.memberFiles &&
                                              member.memberFiles.length > 0
                                            ? member.memberFiles[0]
                                                .fileDescription
                                            : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {(() => {
                                            const files =
                                              member.memberFiles ?? [];

                                            // 1️ Match receipt to payment - find all files for this payment
                                            // Use strict comparison and handle both string and null/undefined cases
                                            // Convert to strings and trim to handle any whitespace or type mismatches
                                            const matchedFiles = files.filter(
                                              (f) => {
                                                if (!f.paymentId || !payment.id)
                                                  return false;
                                                const filePaymentId = String(
                                                  f.paymentId
                                                )
                                                  .trim()
                                                  .toLowerCase();
                                                const paymentId = String(
                                                  payment.id
                                                )
                                                  .trim()
                                                  .toLowerCase();
                                                return (
                                                  filePaymentId === paymentId
                                                );
                                              }
                                            );

                                            // 2️ Use the first matched file, or show N/A (don't fallback to any file)
                                            // This prevents showing the wrong file for a payment
                                            const file =
                                              matchedFiles.length > 0
                                                ? matchedFiles[0]
                                                : null;

                                            if (!file?.id) {
                                              return (
                                                <Typography variant="body2">
                                                  N/A
                                                </Typography>
                                              );
                                            }

                                            // Show the matched file's name, or "View Receipt" if multiple files exist
                                            const buttonText =
                                              matchedFiles.length > 1
                                                ? `View Receipt (${matchedFiles.length})`
                                                : file.fileName ||
                                                  "View Receipt";

                                            return (
                                              <Button
                                                component={RouterLink}
                                                to={`/members/receipt/${file.id}`}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "left",
                                                  gap: 3,
                                                }}
                                              >
                                                {buttonText.includes(".")
                                                  ? buttonText.slice(
                                                      0,
                                                      buttonText.lastIndexOf(
                                                        "."
                                                      )
                                                    )
                                                  : buttonText}
                                                <ReceiptThumbnail
                                                  fileId={file.id}
                                                />
                                              </Button>
                                            );
                                          })()}
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={5} align="center">
                                        No payment information available
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>

              <Box>
                             <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNavigateHome}
                      sx={{
                        width: "15%",
                        letterSpacing: "5px",
                        mb: 2,
                        mt: 2,
                        ml: 2,
                        fontSize: { xs: "12px", sm: "12px", md: "1.5rem" },
                        backgroundColor: "#1976d2",
                        color: "white",
                        "&:hover": { backgroundColor: "#115293" },
                      }}
                    >
                      Home
                    </Button>

                <TablePagination
                  sx={{
                    display: "flex",
                    float: "right",
                    mb: 2,
                    mt: 2,
                    ml: 2,
                    fontSize: "1.5rem",
                  }}
                  component="div"
                  count={searchedMembers.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  labelRowsPerPage="Rows per page"
                />
              </Box>
            </TableContainer>
          )}
        </>
      )}
    </Container>
  );
};

const ObservedMemberList = observer(MemberList);
export default ObservedMemberList;
