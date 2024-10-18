import React, { useRef, useState } from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import { useLogin } from '../../hooks/useUsers';
import { checkEmail } from '../../validators/user';
import { ValidatedTextField } from '../../components/common/ValidatedTextField';
import { useTranslation } from 'react-i18next';

const LoginPage: React.FC = () => {

    const initialState = {
        email: '',
        password: ''
    }

    const { t } = useTranslation();

    const [data, setData] = useState(initialState);
    const formValid = useRef({ email: false, password: false });
    const { mutate, isError, isSuccess, error } = useLogin();

    const handleLogin = () => {
        mutate({ email: data.email, password: data.password });
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
                <Typography variant="h4" gutterBottom>
                    {t('login.title')}
                </Typography>
                <ValidatedTextField
                    id='email'
                    label={t('login.email')}
                    validator={checkEmail}
                    isValid={isValid => (formValid.current.email = isValid)}
                    onChange={email => setData({ ...data, email })}
                />

                <ValidatedTextField
                    id='password'
                    label={t('login.password')}
                    validator={checkEmail}
                    isValid={isValid => (formValid.current.password = isValid)}
                    onChange={password => setData({ ...data, password })}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                >
                    {t('login.submit')}
                </Button>
                {isError && <Typography color="error">{(error as Error).message}</Typography>}
                {isSuccess && <Typography color="primary">Login successful!</Typography>}
            </Box>
        </Container>
    );
};

export default LoginPage;
