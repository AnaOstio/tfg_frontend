import React from 'react';
import { Card, Row, Col, Typography, Divider } from 'antd';
import { TitleMemory } from '../types';

const { Text } = Typography;

const CreditsDistributionCard: React.FC<{ titleMemory: TitleMemory; loading: boolean }> = ({ titleMemory, loading }) => (
    <Card title="Distribución de Créditos" style={{ marginTop: 16 }} loading={loading}>
        <Row gutter={16}>
            <Col span={24}><Text strong>Total de Créditos:</Text><div>{titleMemory.totalCredits}</div></Col>
        </Row>
        <Divider />
        <Row gutter={16}>
            {Object.entries(titleMemory.distributedCredits).map(([key, value]) => (
                <Col span={6} key={key}><Text strong>{key}:</Text><div>{value}</div></Col>
            ))}
        </Row>
    </Card>
);

export default CreditsDistributionCard;
