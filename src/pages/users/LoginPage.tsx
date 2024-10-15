import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useLogin } from '../../hooks/useUsers';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { mutate, isError, isSuccess, error } = useLogin();

    const handleLogin = () => {
        mutate({ email, password });
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                >
                    Conectate
                </Button>
                {isError && <Typography color="error">{(error as Error).message}</Typography>}
                {isSuccess && <Typography color="primary">Login successful!</Typography>}
            </Box>
        </Container>
    );
};

export default LoginPage;