import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const SignUpPage: React.FC = () => {

    const initialState = {
        email: '',
        password: '',
        repeatPassword: ''
    };

    const [data, setData] = useState(initialState);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (data.password !== data.repeatPassword) {
            alert('Passwords do not match!');
            return;
        }
        // Handle sign up logic here
        console.log('Email:', data.email);
        console.log('Password:', data.password);
    };

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Sign Up
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Repeat Password"
                            type="password"
                            fullWidth
                            value={data.repeatPassword}
                            onChange={(e) => setData({ ...data, repeatPassword: e.target.value })}
                            required
                        />
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Sign Up
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default SignUpPage;