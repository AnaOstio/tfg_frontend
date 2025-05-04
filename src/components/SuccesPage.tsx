import React from 'react';
import { Button, Card, Typography, Space } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface SuccessPageProps {
    title: string;
    description: string;
    addMoreButtonText: string;
    backToListButtonText: string;
    onAddMore?: () => void;
    onBackToList?: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({
    title,
    description,
    addMoreButtonText,
    backToListButtonText,
    onAddMore,
    onBackToList
}) => {
    return (
        <Card
            style={{
                maxWidth: 600,
                margin: '0 auto',
                textAlign: 'center',
                marginTop: 24
            }}
        >
            <CheckCircleFilled style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />

            <Title level={3}>{title}</Title>
            <Paragraph type="secondary" style={{ marginBottom: 32 }}>
                {description}
            </Paragraph>

            <Space>
                <Button
                    type="primary"
                    onClick={onAddMore}
                >
                    {addMoreButtonText}
                </Button>
                <Button onClick={onBackToList}>
                    {backToListButtonText}
                </Button>
            </Space>

        </Card>
    );
};

export default SuccessPage;