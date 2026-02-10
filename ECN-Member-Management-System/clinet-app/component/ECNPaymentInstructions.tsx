import { Container, Box, Typography, Divider } from "@mui/material";

export default function ECNPaymentInstructions() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      
      {/* ===============================
          TERMS OF SERVICE
      =============================== */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          ECN New Member – Terms of Service
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          By submitting an application for new membership with ECN, the applicant
          (“Member”) acknowledges and agrees to the following Terms of Service:
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          1. Agreement to ECN Policies
        </Typography>
        <Typography variant="body2">
          By applying for membership, the Member confirms that they have read,
          understood, and agree to comply with all ECN policies, rules,
          procedures, and guidelines, as established and updated by ECN.
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          2. Required Method of Payment
        </Typography>
        <Typography variant="body2">
          For new memberships, ECN does not accept the following payment methods:
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 3 }}>
          <li>Credit or debit cards</li>
          <li>Check payments</li>
          <li>Online or electronic payments</li>
        </Typography>
        <Typography variant="body2">
          All new members are required to make payment via direct deposit to
          ECN’s Fifth Third Bank account.
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          3. Proof of Payment (Bank Deposit Receipt)
        </Typography>
        <Typography variant="body2">
          New members must provide an official receipt issued by the bank
          confirming the direct deposit into ECN’s Fifth Third Bank account.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Membership will not be processed or activated until:
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 3 }}>
          <li>The bank receipt is submitted, and</li>
          <li>The deposit has been verified by ECN.</li>
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          4. Incomplete or Invalid Applications
        </Typography>
        <Typography variant="body2">
          Applications submitted without a valid bank deposit receipt or
          agreement to these Terms of Service may be delayed, rejected, or
          returned for correction.
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          5. No Refund Policy
        </Typography>
        <Typography variant="body2">
          Unless otherwise approved in writing by ECN, membership fees are
          non-refundable once payment has been verified and membership is
          activated.
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          6. Verification and Approval
        </Typography>
        <Typography variant="body2">
          ECN reserves the right to verify all payment and application
          information, request additional documentation, and approve or deny
          membership at its sole discretion.
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          7. Acknowledgment and Consent
        </Typography>
        <Typography variant="body2">
          By submitting the membership application, the Member confirms that all
          information provided is accurate and complete, they understand and
          agree to these Terms of Service, and failure to comply with ECN
          policies may result in denial or termination of membership.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* ===============================
          PAYMENT INFORMATION
      =============================== */}
      <Box>
        <Typography variant="h4" gutterBottom>
          ECN Membership Payment Information
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          All payments must be made via <strong>direct bank deposit only</strong>.
          Credit cards, checks, and online payments are not accepted.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Membership Registration Payment</Typography>
          <Typography variant="body2">
            <strong>Bank:</strong> Fifth Third Bank
          </Typography>
          <Typography variant="body2">
            <strong>Account Number:</strong> 7980165216
          </Typography>
          <Typography variant="body2">
            <strong>Amount:</strong> $200.00
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Annual Membership Payment</Typography>
          <Typography variant="body2">
            <strong>Bank:</strong> Fifth Third Bank
          </Typography>
          <Typography variant="body2">
            <strong>Account Number:</strong> 7936120158
          </Typography>
          <Typography variant="body2">
            <strong>Amount:</strong> $50.00
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          An official bank-issued receipt must be submitted as proof of payment.
          Membership will not be processed without valid documentation.
        </Typography>
      </Box>

    </Container>
  );
}
