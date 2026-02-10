import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
} from "@mui/material";

import { Diversity1, Add } from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../src/app/stores/store";

const NavBar = observer(function NavBar() {
  const { userStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    userStore.logout();
    navigate('/');
  };

  const navLinks = [
    { label: "Home", path: "/" },
  
    { label: "About", path: "/about" },
    { label: "Account", path: "/account" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            maxWidth: "100vw",
            height: "4rem",
            backgroundImage:
              "linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 10,
            overflowX: "hidden",
          }}
        >
          <Container 
            maxWidth="xl"
            sx={{
              width: "100%",
              maxWidth: "100%",
              margin: "0 auto",
              overflowX: "hidden",
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "100%",
                gap: 2,
              }}
            >
              {/* Logo/Title */}
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "white",
                  "&:hover": {
                    opacity: 0.9,
                  },
                  transition: "opacity 0.3s ease",
                }}
              >
                <Diversity1 sx={{ fontSize: "2rem", mr: 1 }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.75rem" },
                  }}
                >
                  ECN Network
                </Typography>
              </Box>

              {/* Navigation Links */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 2 },
                  flexWrap: "wrap",
                }}
              >
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      color: "white",
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      fontWeight: location.pathname === link.path ? 700 : 500,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                      ...(location.pathname === link.path && {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                      }),
                    }}
                  >
                    {link.label}
                  </Button>
                ))}

                {userStore.isLoggedIn && (
                  <Button
                    component={RouterLink}
                    to="/memberList"
                    sx={{
                      color: "white",
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      fontWeight: location.pathname === "/memberList" ? 700 : 500,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                      ...(location.pathname === "/memberList" && {
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                      }),
                    }}
                  >
                    Members
                  </Button>
                )}

                {userStore.isLoggedIn && (
                  <Button
                    component={RouterLink}
                    to="/create"
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                      backgroundColor: "#ff9800",
                      color: "white",
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      "&:hover": {
                        backgroundColor: "#f57c00",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Create Member
                  </Button>
                )}

                {userStore.isLoggedIn ? (
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderColor: "white",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Logout ({userStore.username})
                  </Button>
                ) : (
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </>
  );
});

export default NavBar;
