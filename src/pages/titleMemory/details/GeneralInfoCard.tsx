import React from 'react';
import { Card, Row, Col, Typography, Divider, Tag } from 'antd';
import { TitleMemory } from '../types';

const { Text } = Typography;

const GeneralInfoCard: React.FC<{ titleMemory: TitleMemory; loading: boolean }> = ({ titleMemory, loading }) => (
    <Card title="Información Básica" loading={loading}>
        <Row gutter={16}>
            <Col span={12}><Text strong>Universidad:</Text><div>{titleMemory.universities.join(', ')}</div></Col>
            <Col span={12}><Text strong>Centro:</Text><div>{titleMemory.centers.join(', ')}</div></Col>
        </Row>
        <Divider />
        <Row gutter={16}>
            <Col span={8}><Text strong>Nivel Académico:</Text><div>{titleMemory.academicLevel}</div></Col>
            <Col span={8}><Text strong>Rama:</Text><div>{titleMemory.branch}</div></Col>
            <Col span={8}><Text strong>Área Académica:</Text><div>{titleMemory.academicField}</div></Col>
        </Row>
        <Divider />
        <Row gutter={16}>
            <Col span={12}>
                <Text strong>Estado:</Text>
                <Tag color={titleMemory.status === 'Activo' ? 'green' : 'red'}>{titleMemory.status}</Tag>
            </Col>
            <Col span={12}><Text strong>Año de Entrega:</Text><div>{titleMemory.yearDelivery}</div></Col>
        </Row>
    </Card>
);

export default GeneralInfoCard;
