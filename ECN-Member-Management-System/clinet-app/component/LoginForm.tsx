import {Avatar,  Box,  FormControlLabel, Paper,
       TextField,  Typography,  Checkbox,  Button, Alert} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from "react";
import { useStore } from "../src/app/stores/store";
import { observer } from "mobx-react-lite";

const LoginPage = observer(() => {
  const { userStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    
    try {
      await userStore.login(username, password);
      const from = (location.state as any)?.from?.pathname || '/memberList';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data || 'Invalid username or password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundImage: `
          linear-gradient(135deg, rgba(17, 18, 18, .2) 0%, rgb(238, 242, 244) 69%, rgb(220, 230, 232) 78%),
          url("https://media.istockphoto.com/id/1082508340/photo/people-relation-and-organization-structure-social-media-business-and-communication-technology.jpg?s=2048x2048&w=is&k=20&c=n5W1SNY7wXdRtXmRA31LWUkH-cCdjFp-HjXiqj-1-W0=")
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: 2,
        marginTop: 2,
        paddingBottom: 10,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Avatar
          sx={{ mx: "auto", bgcolor: "secondary.main", mb: 2 }}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" textAlign="center">
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Username"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            fullWidth
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
});

export default LoginPage;
