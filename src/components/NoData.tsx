import React from 'react';
import { Empty, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

interface EmptyDataDisplayProps {
    message?: string;
    description?: string;
    onRefresh?: () => void;
}

const NoData: React.FC<EmptyDataDisplayProps> = ({
    message = 'No hay datos disponibles',
    description = 'No se encontraron registros para mostrar',
    onRefresh,
}) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Empty
                image={<SmileOutlined style={{ fontSize: '48px', color: '#1890ff' }} />}
                imageStyle={{ height: 60 }}
                description={
                    <>
                        <h3>{message}</h3>
                        <p>{description}</p>
                    </>
                }
            >
                {onRefresh && (
                    <Button type="primary" onClick={onRefresh}>
                        Recargar datos
                    </Button>
                )}
            </Empty>
        </div>
    );
};

export default NoData;