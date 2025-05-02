import { Button, Result, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';

const { Paragraph } = Typography;

const NotFoundPage = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f2f5',
            padding: '24px'
        }}>
            <div style={{
                maxWidth: '800px',
                width: '100%',
                textAlign: 'center',
                padding: '40px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <Result
                    status="404"
                    title="404"
                    subTitle="Página no encontrada"
                    extra={
                        <Space direction="vertical">
                            <Paragraph type="secondary">
                                Lo sentimos, la página que buscas no existe.
                            </Paragraph>
                            <Link to="/">
                                <Button type="primary">
                                    Volver al Login
                                </Button>
                            </Link>
                        </Space>
                    }
                />
            </div>
        </div>
    );
};

export default NotFoundPage;