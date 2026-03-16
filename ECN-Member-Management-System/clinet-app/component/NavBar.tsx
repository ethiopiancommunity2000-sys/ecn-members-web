import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import { Diversity1, Add, Menu as MenuIcon } from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../src/app/stores/store";
import { useState } from "react";

const NavBar = observer(function NavBar() {
  const { userStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();



  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>)  => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    userStore.logout();
    navigate("/");
    handleMenuClose();
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

      <AppBar
        position="fixed"
        sx={{
          height: "4rem",
          backgroundImage:
            "linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
            }}
          >
            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "white",
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

            {/* Hamburger menu (mobile) */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {navLinks.map((link) => (
                  <MenuItem
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    onClick={handleMenuClose}
                  >
                    {link.label}
                  </MenuItem>
                ))}

                {userStore.isLoggedIn && (
                  <MenuItem
                    component={RouterLink}
                    to="/memberList"
                    onClick={handleMenuClose}
                  >
                    Members
                  </MenuItem>
                )}

                {userStore.isLoggedIn && (
                  <MenuItem
                    component={RouterLink}
                    to="/create"
                    onClick={handleMenuClose}
                  >
                    Create Member
                  </MenuItem>
                )}

                {userStore.isLoggedIn ? (
                  <MenuItem onClick={handleLogout}>
                    Logout ({userStore.username})
                  </MenuItem>
                ) : (
                  <MenuItem
                    component={RouterLink}
                    to="/login"
                    onClick={handleMenuClose}
                  >
                    Sign In
                  </MenuItem>
                )}
              </Menu>
            </Box>

            {/* Desktop navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
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
                    fontWeight: location.pathname === link.path ? 700 : 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      transform: "translateY(-2px)",
                    },
                    ...(location.pathname === link.path && {
                      backgroundColor: "rgba(255,255,255,0.15)",
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
                    fontWeight:
                      location.pathname === "/memberList" ? 700 : 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
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
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "#f57c00",
                    },
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
                    backgroundColor: "rgba(255,255,255,0.2)",
                    textTransform: "none",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
});

export default NavBar;