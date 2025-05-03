import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useUsers';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const logout = useLogout();


    const handleLogout = () => {
        logout(); // Ejecuta la acción de logout
        navigate('/login'); // Redirige al login
    };

    return (
        <div style={{ padding: '24px' }}>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard!</p>

            <Button
                type="primary"
                danger // Estilo rojo para acción destructiva
                onClick={handleLogout}
                style={{ marginTop: '16px' }}
            >
                Cerrar sesión
            </Button>
        </div>
    );
};

export default DashboardPage;