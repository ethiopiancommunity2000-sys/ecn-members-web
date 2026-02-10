import { Container, CssBaseline, Box, Typography, Link, Divider, Grid } from '@mui/material';
import NavBar from '../../../component/NavBar';
import './style.css';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Email, Phone, LocationOn } from '@mui/icons-material';

//https://chatgpt.com/c/698ab63f-da20-8326-b4cd-7e1c330d6779      --> for azure configration


//! C:\Users\ghail\OneDrive\Desktop\JS Course\CSharpReactProject\clinet-app>   and type ==> .env.development  to check waht url is used for the API calls
// dotnet dev-certs https --check
// dotnet dev-certs https --trust
// dotnet dev-certs https --clean

 //john.doe@example.com / john_doe      ==  true
//getachew.hailu@example.com / getachew_hailu    ==  true
                    
//tomSmith@example.com / tom_smith     ==  FALSE
                    

//=>  Password123!
 
function App() {

    console.log(import.meta.env.MODE);
  console.log(import.meta.env.VITE_API_URL);
  return (
    <>
      <NavBar />
      <Container
        maxWidth="xl"
        sx={{
          minHeight: 'calc(100vh - 64px - 200px)',
          paddingTop: '80px',
          paddingBottom: '180px',
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          overflowX: 'hidden',
        }}
      >
        <CssBaseline />
        <Outlet />  
      </Container>
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          width: '100%',
          maxWidth: '100vw',
          mt: 'auto',
          backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          color: '#ffffff',
          overflowX: 'hidden',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            {/* About Section */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ffffff' }}>
                ECN Network
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.8 }}>
                Building stronger communities through connection and support. Together we make a difference.
              </Typography>
            </Grid>

            {/* Quick Links */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ffffff' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link
                  component={RouterLink}
                  to="/"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textDecoration: 'none',
                    '&:hover': { color: '#ffffff', textDecoration: 'underline' },
                    transition: 'color 0.3s ease',
                  }}
                >
                  Home
                </Link>
                <Link
                  component={RouterLink}
                  to="/memberList"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textDecoration: 'none',
                    '&:hover': { color: '#ffffff', textDecoration: 'underline' },
                    transition: 'color 0.3s ease',
                  }}
                >
                  Members
                </Link>
                <Link
                  component={RouterLink}
                  to="/contact"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textDecoration: 'none',
                    '&:hover': { color: '#ffffff', textDecoration: 'underline' },
                    transition: 'color 0.3s ease',
                  }}
                >
                  Contact
                </Link>
                <Link
                  component={RouterLink}
                  to="/about"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textDecoration: 'none',
                    '&:hover': { color: '#ffffff', textDecoration: 'underline' },
                    transition: 'color 0.3s ease',
                  }}
                >
                  About
                </Link>
              </Box>
            </Grid>

            {/* Contact Info */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ffffff' }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.9)' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    info@ecnnetwork.org
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.9)' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    (614)549-1893
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.9)' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Columbus, OH
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Newsletter/Updates */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ffffff' }}>
                Stay Connected
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2, lineHeight: 1.8 }}>
                Subscribe to our newsletter to receive updates and news about our community.
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Copyright */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              © {new Date().getFullYear()} ECN Network. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#ffffff', textDecoration: 'underline' },
                  transition: 'color 0.3s ease',
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="terms"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#ffffff', textDecoration: 'underline' },
                  transition: 'color 0.3s ease',
                }}
              >
                Terms of Service
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
 
export default App
