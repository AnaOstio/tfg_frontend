import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useLogin } from '../../hooks/useUsers';

const LoginPage: React.FC = () => {

    const initialState = {
        email: '',
        password: ''
    }

    const [data, setData] = useState(initialState);
    const { mutate, isError, isSuccess, error } = useLogin();

    const handleLogin = () => {
        mutate({ email: data.email, password: data.password });
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
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
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