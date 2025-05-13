// components/NoData.tsx
import { Empty, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

interface NoDataProps {
    message?: string;
    description?: string;
    onRefresh?: () => void;
    fullHeight?: boolean;
}

const NoData = ({
    message = 'No hay datos disponibles',
    description = 'No se encontraron registros para mostrar',
    onRefresh,
    fullHeight = true
}: NoDataProps) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: fullHeight ? 'calc(100vh - 150px)' : 'auto',
            margin: fullHeight ? '0 - 5%' : '0 auto'
        }}>
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