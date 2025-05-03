import { Layout, Menu, Button, Space, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useLogout } from '../hooks/useUsers';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
import { useSelector } from 'react-redux';

const { Header } = Layout;

const NavBar = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const logout = useLogout();

    return (
        <Header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
            background: '#001529',
            height: '64px',
            lineHeight: '64px'
        }}>
            <div style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                minWidth: '120px'
            }}>
                <Link to="/" style={{ color: 'inherit' }}>
                    TFG
                </Link>
            </div>
            <Menu
                theme="dark"
                mode="horizontal"
                style={{
                    flex: 1,
                    minWidth: 0,
                    justifyContent: 'center',
                    background: 'transparent',
                    borderBottom: 'none'
                }}
                selectedKeys={[]}
            >
                {isAuthenticated && (
                    <Menu.Item key="dashboard">
                        <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>
                    </Menu.Item>
                )}
            </Menu>

            <Space size="middle" style={{ minWidth: '120px', justifyContent: 'flex-end' }}>
                {isAuthenticated ? (
                    <>
                        <Button
                            type="primary"
                            danger
                            icon={<LogoutOutlined />}
                            onClick={logout}
                        >
                            Cerrar sesión
                        </Button>
                    </>
                ) : (
                    <>
                        <Button type="default">
                            <Link to="/signup">Registro</Link>
                        </Button>
                        <Button type="primary">
                            <Link to="/">Iniciar sesión</Link>
                        </Button>
                    </>
                )}
            </Space>
        </Header>
    );
};

export default NavBar;