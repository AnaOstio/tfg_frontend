import React, { useState, useEffect } from 'react';
import { Layout, Card, Pagination, Row, Col, Spin, message, Button, Drawer, Dropdown, Menu, MenuProps } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import GeneralFilters from '../../components/filters/GeneralFilters';
import NoData from '../../components/NoData';
import { Filters } from '../../components/filters/types/types';
import { YEAR_RANGE } from '../../components/filters/consts/cosnts';
import useIsMobileOrTablet from '../../hooks/useIsMobileOrTablet';
import { useTitleMemoriesSearch } from '../../hooks/useTitleMemories';
import useConfirmation from '../../hooks/useConfirmation';

const { Content } = Layout;

interface TitleMemory {
    _id: string;
    name: string;
    universities: string[];
    centers: string[];
    totalCredits: number;
    academicLevel: string;
    academicField: string;
    fromUser?: boolean;
}

interface TitleMemoriesViewProps {
    fromUser?: boolean;
}

const TitleMemoriesView: React.FC<TitleMemoriesViewProps> = ({ fromUser = false }) => {
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
        year: YEAR_RANGE,
    });
    const [filtersVisible, setFiltersVisible] = useState(false);
    const isMobileOrTablet = useIsMobileOrTablet();
    const { mutate: searchTitleMemories } = useTitleMemoriesSearch({
        setData,
        setPagination,
        setLoading
    });

    const fetchData = async () => {
        setLoading(true);
        searchTitleMemories({
            filters,
            page: pagination.current,
            limit: pagination.pageSize,
            fromUser: fromUser,
        });
    };

    useEffect(() => {
        fetchData();
    }, [pagination.current, filters]);

    const handlePageChange = (page: number) => {
        setPagination({ ...pagination, current: page });
    };

    const handleFilterChange = (filterType: keyof Filters, values: string[] | [number, number]) => {
        setFilters({ ...filters, [filterType]: values });
        setPagination({ ...pagination, current: 1 });
    };

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const { showConfirmation, ConfirmationModal } = useConfirmation();

    const handleDelete = (itemId: string) => {
        // Aquí va tu lógica real para eliminar
        console.log('Eliminando memoria:', itemId);
    };


    const getActionItems = (item: TitleMemory): MenuProps['items'] => [
        {
            key: 'edit',
            label: (
                <div onClick={(e) => {
                    console.log('Editando memoria:', item._id);
                }}>
                    Editar
                </div>
            ),
        },
        {
            key: 'delete',
            label: (
                <div onClick={(e) => {
                    e.stopPropagation();
                    showConfirmation(
                        '¿Desea eliminar esta memoria de título?',
                        () => handleDelete(item._id)
                    );
                }}>
                    Eliminar
                </div>
            ),
        },
        {
            key: 'clone',
            label: (
                <div onClick={(e) => {
                    e.stopPropagation();
                    // Lógica para clonar
                    message.info(`Clonando memoria: ${item.name}`);
                }}>
                    Clonar
                </div>
            ),
        },
        {
            key: 'add-subject',
            label: (
                <div onClick={(e) => {
                    e.stopPropagation();
                    // Lógica para añadir asignatura
                    message.info(`Añadiendo asignatura a: ${item.name}`);
                }}>
                    Añadir asignatura
                </div>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
            {/* Botón de hamburguesa solo en móvil/tablet */}
            {isMobileOrTablet && !filtersVisible && (
                <Button
                    type="primary"
                    icon={filtersVisible ? <CloseOutlined /> : <MenuOutlined />}
                    onClick={toggleFilters}
                    style={{
                        position: 'fixed',
                        top: '8%',
                        left: '16px',
                        zIndex: 1001
                    }}
                >
                    {filtersVisible ? 'Cerrar filtros' : 'Abrir filtros'}
                </Button>
            )}

            {/* Sidebar de filtros - Versión escritorio */}
            {!isMobileOrTablet && (
                <Layout.Sider
                    width={"20%"}
                    style={{
                        background: 'transparent',
                        padding: '24px 16px',
                        marginRight: '24px'
                    }}
                >
                    <GeneralFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </Layout.Sider>
            )}

            {/* Drawer para móvil/tablet */}
            {isMobileOrTablet && (
                <Drawer
                    title="Filtros"
                    placement="left"
                    closable={true}
                    onClose={toggleFilters}
                    visible={filtersVisible}
                    width="100%"
                    bodyStyle={{ padding: '16px' }}
                >
                    <GeneralFilters
                        filters={filters}
                        onFilterChange={(type, values) => {
                            handleFilterChange(type, values);
                            setFiltersVisible(false); // Cierra el drawer al aplicar filtros
                        }}
                    />
                </Drawer>
            )}

            {/* Contenido principal */}
            <Layout>
                <Content style={{
                    padding: '24px',
                    marginLeft: isMobileOrTablet ? 0 : '24px' // Ajuste de margen para móvil
                }}>
                    {data.length === 0 ? <NoData onRefresh={fetchData} /> : (
                        <>
                            <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>
                                {fromUser ? 'Mis memorias de título' : 'Memorias de título'}
                            </h1>

                            <Spin spinning={loading}>
                                <Row gutter={[16, 16]}>
                                    {data.map((item) => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                                            <Card
                                                title={
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span>{item.name}</span>
                                                        {fromUser && (
                                                            <Dropdown
                                                                menu={{ items: getActionItems(item) }}
                                                                trigger={['click']}
                                                            >
                                                                <Button
                                                                    type="primary"
                                                                    size="small"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    Acciones
                                                                </Button>
                                                            </Dropdown>
                                                        )}
                                                    </div>
                                                }
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
                    )}
                </Content>
            </Layout>
            <ConfirmationModal />
        </Layout>
    );
};

export default TitleMemoriesView;