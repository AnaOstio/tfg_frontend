import React from 'react';
import { Button, Card, Typography } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <Card
            style={{
                maxWidth: 600,
                margin: '0 auto',
                textAlign: 'center',
                marginTop: 24
            }}
        >
            <CloseCircleFilled style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }} />

            <Title level={3}>Error al procesar la solicitud</Title>
            <Paragraph type="secondary" style={{ marginBottom: 32 }}>
                Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde.
            </Paragraph>

            <Button
                type="primary"
                onClick={handleBackToHome}
            >
                Volver al inicio
            </Button>
        </Card>
    );
};

export default ErrorPage;