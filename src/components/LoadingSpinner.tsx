import { Spin } from 'antd';

const LoadingSpinner = () => (
    <div style={{
        display: 'grid',
        placeItems: 'center',
        height: '100vh'
    }}>
        <Spin size="large" />
    </div>
);

export default LoadingSpinner;