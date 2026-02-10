import {  Typography,  Container,  Box,  Paper,  Card,  CardContent,  Divider,} from '@mui/material';
 
import {  AccountCircle,  Phone,  LocationOn,  Email,  CreditCard,} from '@mui/icons-material';

export default function Account() {
  // ECN Account Information
const accountInfo = {
  //accountNumber: 'ECN Account Number  ==> 2024-001234',
  address: {
    street: '1234 East Main St.',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43213',
   
  },
  phone: '(614) 549-1893',
  email: 'info@ecnnetwork.org',

  payments: [
    {
      type: 'Membership Registration Payment',
      bank: 'Fifth Third Bank',
      accountNumber: '7980165216',
      amount: 200.0,
      purpose: 'New Member Registration',
    },
    {
      type: 'Annual Membership Payment',
      bank: 'Fifth Third Bank',
      accountNumber: '7936120158',
      amount: 200.0,
      purpose: 'Annual Membership Fee',
    },
  ],
};


    const {  address, payments} = accountInfo;
    const accountNumber = payments[0]?.accountNumber ?? "N/A";

    const { street, city, state, zipCode } = address;

    const fullAddress = `${street}, ${city}, ${state} ${zipCode}`;

    return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            background: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ECN Account Information
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto' }}>
          General ECN information
        </Typography>
      </Box>

      {/* Account Number Card */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)',
          color: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CreditCard sx={{ fontSize: '3rem' }} />
          <Box>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 0.5 }}>
              Account Number {accountInfo.address.city}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {accountNumber}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Contact Information Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 4,
        }}
      >
        {/* Address Card */}
        <Box component="section">
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <LocationOn sx={{ fontSize: '2.5rem', color: '#218aae' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#182a73' }}>
                  Address
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" sx={{ lineHeight: 2, color: 'text.primary' }}>
                {fullAddress}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Phone Card */}
        <Box component="section">
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Phone sx={{ fontSize: '2.5rem', color: '#218aae' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#182a73' }}>
                  Phone
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {accountInfo.phone}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Email Card */}
        <Box component="section">
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Email sx={{ fontSize: '2.5rem', color: '#218aae' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#182a73' }}>
                  Email
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {accountInfo.email}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Account Details Card */}
        <Box component="section">
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <AccountCircle sx={{ fontSize: '2.5rem', color: '#218aae' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#182a73' }}>
                  Account Details
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Account Status
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#218aae' }}>
                    Active
                  </Typography>
                </Box>
                <Box>
                  
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Additional Information */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#182a73' }}>
          Need Help?
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary' }}>
          If you have any questions about your account or need to update your information,
          please contact us at {accountInfo.phone} or email us at {accountInfo.email}.
          Our support team is available Monday through Friday, 9:00 AM to 5:00 PM EST.
        </Typography>
      </Paper>
    </Container>
  );
}

