import React, { useState, useEffect } from 'react';
import { Layout, Card, Pagination, Row, Col, Spin, message } from 'antd';
import GeneralFilters from '../../components/filters/GeneralFilters';
import NoData from '../../components/NoData';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Filters } from '../../components/filters/types/types';

const { Content, Sider } = Layout;

interface TitleMemory {
    _id: string;
    name: string;
    universities: string[];
    centers: string[];
    totalCredits: number;
    academicLevel: string;
    academicField: string;
}

const TitleMemoriesView: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<TitleMemory[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0,
    });
    const [filters, setFilters] = useState<Filters>({
        academicLevel: [],
        academicFields: [],
        branchAcademic: [],
        titleName: '',
        universities: [],
        centers: [],
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.current.toString(),
                limit: pagination.pageSize.toString(),
                academicLevel: filters.academicLevel.join(','),
                academicFields: filters.academicFields.join(','),
                branchAcademic: filters.branchAcademic.join(','),
            });

            const response = await fetch(`http://localhost:3003/api/title-memories?${params}`);
            if (!response.ok) throw new Error('Error al cargar los datos');

            const result = await response.json();
            setData(result.data);
            setPagination({
                ...pagination,
                total: result.pagination.total,
            });
        } catch (error) {
            message.error('Error al cargar las memorias de título');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.current, filters]);

    const handlePageChange = (page: number) => {
        setPagination({ ...pagination, current: page });
    };

    const handleFilterChange = (filterType: keyof Filters, values: string[]) => {
        setFilters({ ...filters, [filterType]: values });
        setPagination({ ...pagination, current: 1 });
    };

    { loading && <LoadingSpinner /> }

    return (
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
            {/* Sidebar de filtros */}
            <Sider
                width={"20%"}
                style={{
                    background: 'transparent',
                    padding: '24px 16px',
                    marginRight: '24px'
                }}
                breakpoint="lg"
                collapsedWidth="0"
            >
                <GeneralFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </Sider>

            {/* Contenido principal */}
            <Layout>
                {data.length === 0 ? <NoData onRefresh={fetchData} /> : (
                    <Content style={{ padding: '24px' }}>
                        <>
                            <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>Memorias de título</h1>

                            <Spin spinning={loading}>
                                <Row gutter={[16, 16]}>
                                    {data.map((item) => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                                            <Card
                                                title={item.name}
                                                hoverable
                                                style={{ height: '100%' }}
                                            >
                                                <p><strong>Universidad:</strong> {item.universities.join(', ')}</p>
                                                <p><strong>Centro:</strong> {item.centers.join(', ')}</p>
                                                <p><strong>Créditos:</strong> {item.totalCredits}</p>
                                                <p><strong>Nivel:</strong> {item.academicLevel}</p>
                                                <p><strong>Ámbito:</strong> {item.academicField}</p>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Spin>

                            {/* Paginación */}
                            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                                <Pagination
                                    current={pagination.current}
                                    pageSize={pagination.pageSize}
                                    total={pagination.total}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                />
                            </div>
                        </>
                    </Content>
                )}
            </Layout>
        </Layout>
    );
};

export default TitleMemoriesView;