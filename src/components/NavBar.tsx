import { Layout, Menu, Button, Space, Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useLogout } from '../hooks/useUsers';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
import { useSelector } from 'react-redux';

const { Header } = Layout;

const NavBar = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const logout = useLogout();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <Link to="/" style={{ color: 'inherit' }}>
                    TFG
                </Link>
            </div>

            <Menu
                theme="dark"
                mode="horizontal"
                style={{ flex: 1, minWidth: 0 }}
            >
                {isAuthenticated ? (
                    <Menu.Item key="dashboard">
                        <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
                ) : (
                    <></>
                )}
            </Menu>

            <Space size="middle">
                {isAuthenticated ? (
                    <>
                        <Avatar
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#1890ff' }}
                        />
                        <Button
                            type="primary"
                            danger
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Cerrar sesión
                        </Button>
                    </>
                ) : (
                    <>
                        <Button type="primary">
                            <Link to="/">Iniciar sesión</Link>
                        </Button>

                        <Button type="primary">
                            <Link to="/signup">Registro</Link>
                        </Button>
                    </>
                )}
            </Space>
        </Header>
    );
};

export default NavBar;