import React from 'react';
import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ErrorPageProps {
    title: string;
    message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ title, message }) => {

    const { t } = useTranslation();

    return (
        <Container style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h1" component="h2" gutterBottom>
                {t(`error.${title}`)}
            </Typography>
            <Typography variant="h5" component="p" gutterBottom>
                {t(`error.${message}`)}
            </Typography>
        </Container>
    );
};

export default ErrorPage;
