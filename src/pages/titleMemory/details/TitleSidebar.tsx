import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { AppstoreOutlined, CheckCircleOutlined, BarsOutlined, BookOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;

interface Props {
    selectedKey: string;
    onSelect: (key: string) => void;
}

const TitleSidebar: React.FC<Props> = ({ selectedKey, onSelect }) => {
    const items = [
        { key: 'general', icon: <AppstoreOutlined />, label: 'Datos Generales' },
        { key: 'skills', icon: <CheckCircleOutlined />, label: 'Competencias' },
        { key: 'outcomes', icon: <BarsOutlined />, label: 'Resultados de Aprendizaje' },
        { key: 'subjects', icon: <BookOutlined />, label: 'Asignaturas' },
    ];

    return (
        <Sider width={250} theme="light">
            <div style={{ padding: '24px 16px' }}>
                <Title level={4}><BookOutlined /> Memoria de Título</Title>
            </div>
            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                onSelect={({ key }) => onSelect(key)}
                items={items}
            />
        </Sider>
    );
};

export default TitleSidebar;
