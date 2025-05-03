import { Button, Form, Input, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { LoginUserParams } from '../../utils/user';
import { useLogin } from '../../hooks/useUsers';

const { Title, Text } = Typography;

const LoginPage = () => {
    const { mutate: login } = useLogin();

    const onFinish = (values: LoginUserParams) => {
        login(values);
    };

    return (
        <div style={{
            width: '90vw',
            maxWidth: '400px',
            margin: '5vh auto',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                INICIAR SESIÓN
            </Title>

            <Form onFinish={onFinish} layout="vertical">
                <Form.Item
                    label="Correo electrónico"
                    name="email"
                    rules={[
                        { required: true, message: 'Por favor ingresa tu correo electrónico' },
                        { type: 'email', message: 'Ingresa un correo válido' }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="correo@ejemplo.com"
                    />
                </Form.Item>

                <Form.Item
                    label="Contraseña"
                    name="password"
                    rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="*********"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        style={{ marginTop: '1rem' }}
                    >
                        Iniciar Sesión
                    </Button>
                </Form.Item>

                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <Text>
                        ¿No tienes cuenta? <Link to="/signup">Regístrate</Link>
                    </Text>
                </Space>
            </Form>
        </div>
    );
};

export default LoginPage;