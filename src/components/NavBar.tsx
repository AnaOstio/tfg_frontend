import { Layout, Menu, Dropdown, Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import { LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { useLogout } from '../hooks/useUsers';
import { selectIsAdmin, selectIsAuthenticated } from '../redux/slices/authSlice';
import { useSelector } from 'react-redux';

const { Header } = Layout;

const NavBar = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isAdmin = useSelector(selectIsAdmin);
    const logout = useLogout();

    const adminMenu = (
        <Menu>
            <Menu.Item key="check-similarities">
                <Link to="/check-similiraties">Similitud de Competencias</Link>
            </Menu.Item>
            <Menu.Item key="check-similarities-los">
                <Link to="/check-similiraties-los">Similitud de Resultados de Aprendizaje</Link>
            </Menu.Item>
        </Menu>
    );

    const uploadMenu = (
        <Menu>
            <Menu.Item key="upload-subjects">
                <Link to="/upload-subjects">Subir asignaturas</Link>
            </Menu.Item>
            <Menu.Item key="upload-title-memories">
                <Link to="/upload-title-memories">Subir Memorias de Título</Link>
            </Menu.Item>
        </Menu>
    );

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
                    <img
                        src="/logo.svg"
                        alt="Logo PLaCo"
                        style={{ width: 32, height: 32, marginRight: 8 }}
                    />
                    PLaCo
                </Link>
            </div>

            <Menu
                theme="dark"
                mode="horizontal"
                style={{
                    flex: 1,
                    minWidth: 0,
                    background: 'transparent',
                    borderBottom: 'none'
                }}
                selectedKeys={[]}
            >
                {isAuthenticated && (
                    <>
                        <Menu.Item key="dashboard">
                            <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>
                        </Menu.Item>
                        <Menu.Item key="my-title-memory">
                            <Link to="/my-title-memory" style={{ color: 'white' }}>Mis memorias de título</Link>
                        </Menu.Item>
                        <Menu.Item key="create-title-memory">
                            <Link to="/title-memory" style={{ color: 'white' }}>Crear memoria de título</Link>
                        </Menu.Item>
                        <Menu.Item key="upload-dropdown">
                            <Dropdown overlay={uploadMenu} trigger={['click']}>
                                <a onClick={e => e.preventDefault()} style={{ color: 'white' }}>
                                    Subir Datos <DownOutlined />
                                </a>
                            </Dropdown>
                        </Menu.Item>
                    </>
                )}

                {isAdmin && (
                    <Menu.Item key="admin-dropdown">
                        <Dropdown overlay={adminMenu} trigger={['click']}>
                            <a onClick={e => e.preventDefault()} style={{ color: 'white' }}>
                                Comprobar Similitudes <DownOutlined />
                            </a>
                        </Dropdown>
                    </Menu.Item>
                )}
            </Menu>

            <Space size="middle" style={{ minWidth: '120px', justifyContent: 'flex-end' }}>
                {isAuthenticated ? (
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={logout}
                    >
                        Cerrar sesión
                    </Button>
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
