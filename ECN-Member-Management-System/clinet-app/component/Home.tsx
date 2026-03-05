import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Grid,
  Card,
} from "@mui/material";
import { keyframes } from '@mui/system';
import { Groups, VolunteerActivism, Handshake, ArrowForward } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

export default function Home() {
  return (
    <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Full background image */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `
            linear-gradient(135deg, rgba(17, 18, 18, .3) 0%, rgba(24, 42, 115, 0.4) 50%, rgba(33, 138, 174, 0.3) 100%),
            url("https://media.istockphoto.com/id/1082508340/photo/people-relation-and-organization-structure-social-media-business-and-communication-technology.jpg?s=2048x2048&w=is&k=20&c=n5W1SNY7wXdRtXmRA31LWUkH-cCdjFp-HjXiqj-1-W0=")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          zIndex: -1,
        }}
      />

      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 8,
            animation: `${fadeIn} 1s ease-in-out`,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#ffffff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            }}
          >
            Welcome to ECN Network  ECN Member System GitHub Test
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            }}
          >
            Building stronger communities through connection, support, and service.
            Together we can make a difference.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/about"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Explore Members
            </Button>
            <Button
              component={RouterLink}
              to="/terms"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderColor: '#ffffff',
                color: '#ffffff',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Terms of Service
            </Button>
          </Box>
        </Box>

        {/* Featured Quote */}
        <Paper
          elevation={8}
          sx={{
            p: 4,
            mb: '3rem',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            animation: `${fadeIn} 1.2s ease-in-out`,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontStyle: 'italic',
              color: '#182a73',
              mb: 2,
              lineHeight: 1.8,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
            }}
          >
            "We are all in this together, and together we can make a difference."
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#218aae',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            — ECN Network
          </Typography>
        </Paper>

        {/* Features Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            What We Offer
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  animation: `${slideIn} 0.8s ease-in-out`,
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  },
                }}
              >
                <Groups sx={{ fontSize: 60, color: '#218aae', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#182a73' }}>
                  Community Support
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  Connect with members, share experiences, and receive support during life's
                  challenges and celebrations.
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  animation: `${slideIn} 1s ease-in-out`,
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  },
                }}
              >
                <VolunteerActivism sx={{ fontSize: 60, color: '#218aae', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#182a73' }}>
                  Volunteer Opportunities
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  Get involved in community service projects and make a positive impact
                  in your neighborhood.
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  animation: `${slideIn} 1.2s ease-in-out`,
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  },
                }}
              >
                <Handshake sx={{ fontSize: 60, color: '#218aae', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#182a73' }}>
                  Mutual Assistance
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  Access resources and support from fellow members when you need help,
                  and offer assistance to others.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Inspirational Quote Section */}
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(24, 42, 115, 0.9) 0%, rgba(33, 138, 174, 0.9) 100%)',
            color: '#ffffff',
            textAlign: 'center',
            animation: `${fadeIn} 1.4s ease-in-out`,
            mb: '3rem',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontStyle: 'italic',
              mb: 2,
              lineHeight: 1.8,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
            }}
          >
            "Service to others is the rent you pay for your room here on earth."
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            — Muhammad Ali
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
