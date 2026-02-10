import {
  Typography,
  Container,
  Box,
  Paper,
  Grid,
  Card,

} from '@mui/material';
import { Groups, VolunteerActivism, Handshake, Diversity1 } from '@mui/icons-material';

export default function About() {
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
          About ECN Network
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto' }}>
          Building stronger communities through connection, support, and service
        </Typography>
      </Box>

      {/* Mission Statement */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#182a73' }}>
          Our Mission
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', color: 'text.primary' }}>
          ECN Network is dedicated to fostering a strong, supportive community where members can connect,
          grow, and make a positive impact. We believe that by working together, we can create meaningful
          change and support one another through life's challenges and celebrations.
        </Typography>
      </Paper>

      {/* Community Services */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold', color: '#182a73' }}>
          Our Community Services
        </Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <Groups sx={{ fontSize: 60, color: '#218aae', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#182a73' }}>
                Member Support
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                We provide comprehensive support to our members, helping them navigate challenges and
                celebrate achievements together as a community.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <VolunteerActivism sx={{ fontSize: 60, color: '#218aae', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#182a73' }}>
                Community Outreach
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                Our outreach programs connect members with resources and opportunities to serve
                and strengthen the broader community.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <Handshake sx={{ fontSize: 60, color: '#218aae', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#182a73' }}>
                Mutual Assistance
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                We facilitate connections between members, enabling mutual support during times
                of need and shared celebration during times of joy.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <Diversity1 sx={{ fontSize: 60, color: '#218aae', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#182a73' }}>
                Cultural Unity
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                We celebrate diversity and promote unity, bringing together people from all
                backgrounds to build a stronger, more inclusive community.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Values Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#182a73' }}>
          Our Core Values
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#218aae', mb: 1 }}>
                Unity
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                We believe in the power of coming together. When we unite as a community, we can
                overcome any challenge and achieve great things.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#218aae', mb: 1 }}>
                Service
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                Service to others is at the heart of our community. We are committed to helping
                those in need and making a positive impact in our neighborhoods.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#218aae', mb: 1 }}>
                Respect
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                We treat every member with dignity and respect, recognizing the unique contributions
                each person brings to our community.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#218aae', mb: 1 }}>
                Integrity
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                We conduct all our activities with honesty, transparency, and ethical behavior,
                building trust within our community and beyond.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: 'center',
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)',
          color: 'white',
          mb: '4rem',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Join Our Community
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px', mx: 'auto', lineHeight: 1.8 }}>
          Become part of a network that values connection, support, and service. Together, we can
          make a difference in our community and in each other's lives.
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          "We are all in this together, and together we can make a difference."
        </Typography>
      </Box>
    </Container>
  );
}
