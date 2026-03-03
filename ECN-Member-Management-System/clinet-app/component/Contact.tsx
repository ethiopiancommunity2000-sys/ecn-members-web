import {
  Typography,
  Container,
  CardContent,
  Card,
  Grid,
  CardHeader,
} from '@mui/material';

function Contact() {


  return (
    <Container maxWidth="lg" sx={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
      <Grid size={9} sx={{ margin: '5rem auto' }}>
        <Card sx={{ borderRadius: 3, minWidth: '40rem' }}>
          <CardHeader
            title="Contact Us"
            sx={{
              backgroundColor: '#0d1b2a',
              color: 'white',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />

          <CardContent>
            {/* Contact Info */}
            <Typography variant="h6">Phone: 614-549-1893</Typography>
            <Typography variant="h6">Email: info@ecnnetwork.org</Typography>
            <Typography variant="h6">Fax: 614-549-1893</Typography>

          <Typography variant="h6" sx={{ mb: 0.5 }}>
  Address: 4409 East Main St., Columbus, OH 43213
</Typography>

          </CardContent>

       
        </Card>
      </Grid>
    </Container>
  );
}

export default Contact;
