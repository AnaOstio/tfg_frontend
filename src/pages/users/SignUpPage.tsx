import { Button, Form, Input, Typography, Space, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { useSignup } from '../../hooks/useUsers';
import { SignUpUserParams } from '../../utils/user';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

const SignUpPage = () => {

    const { mutate: signup } = useSignup();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const onFinish = (values: SignUpUserParams) => {
        if (values.password !== values.confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }
        signup(values);
    };

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

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
            <Title level={2} style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontSize: 'calc(1rem + 1vw)'
            }}>
                REGISTRO
            </Title>

            <Form
                onFinish={onFinish}
                layout="vertical"
                autoComplete="off"
            >
                <Form.Item
                    label="Correo electrónico"
                    name="email"
                    rules={[
                        { required: true, message: 'Por favor ingresa tu correo' },
                        { type: 'email', message: 'Correo no válido' }
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="correo@ejemplo.com"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Contraseña"
                    name="password"
                    rules={[
                        { required: true, message: 'Por favor ingresa tu contraseña' },
                        { min: 6, message: 'Mínimo 6 caracteres' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="*******"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Repetir Contraseña"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Confirma tu contraseña' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Las contraseñas no coinciden');
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="*******"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        style={{
                            marginTop: '1rem',
                            height: '40px',
                            fontSize: '1rem'
                        }}
                    >
                        Registrarse
                    </Button>
                </Form.Item>

                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <Text style={{ fontSize: '0.9rem' }}>
                        ¿Ya tienes cuenta? <Link to="/">Iniciar Sesión</Link>
                    </Text>
                </Space>
            </Form>
        </div>
    );
};

export default SignUpPage;