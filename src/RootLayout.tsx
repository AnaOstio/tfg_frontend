import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';

const { Content } = Layout;

const RootLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <NavBar />
            <Content>
                <Outlet />
            </Content>
        </Layout>
    );
};

export default RootLayout;