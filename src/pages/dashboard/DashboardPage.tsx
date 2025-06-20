import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Layout,
    Pagination,
    Row,
    Col,
    Spin,
    message,
    Button,
    Drawer,
    Dropdown,
    MenuProps
} from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

import GeneralFilters from '../../components/filters/GeneralFilters';
import NoData from '../../components/NoData';
import TitleMemoryCard from '../../components/titlesMemories/TitleMemoryCard';
import useIsMobileOrTablet from '../../hooks/useIsMobileOrTablet';
import useConfirmation from '../../hooks/useConfirmation';
import { useDeleteTitleMemory, useTitleMemoriesSearch } from '../../hooks/useTitleMemories';
import { Filters } from '../../components/filters/types/types';
import { YEAR_RANGE } from '../../components/filters/consts/cosnts';

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

type ActionKey = 'edit' | 'delete' | 'clone' | 'add-subject';
const REQUIRED_PERMISSIONS: Record<ActionKey, string[]> = {
    edit: ['Propietario', 'Edición'],
    delete: ['Propietario', 'Eliminar'],
    clone: [],               // siempre permitido
    'add-subject': ['Propietario', 'Asignaturas'],
};

const TitleMemoriesView: React.FC<TitleMemoriesViewProps> = ({ fromUser = false }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<TitleMemory[]>([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 12, total: 0 });
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
    const { showConfirmation, ConfirmationModal } = useConfirmation();

    // Estado de permisos: lo poblamos desde el hook de búsqueda
    const [permissions, setPermissions] = useState<any>([]);

    const { mutate: searchTitleMemories } = useTitleMemoriesSearch({
        setData,
        setPagination,
        setLoading,
        setPermissions,
    });

    // Construimos un mapa de memoryId → permisos[]
    const permissionsHash = useMemo<Record<string, string[]>>(() => {
        if (!Array.isArray(permissions)) return {};

        return permissions.reduce((acc, p) => {
            acc[p.memoryId] = p.permissions;
            return acc;
        }, {} as Record<string, string[]>);
    }, [permissions]);

    const hasAny = (userPerms: string[], needed: string[]) =>
        needed.length === 0 || needed.some(p => userPerms.includes(p));

    const { mutateAsync: deleteTitleMemory } = useDeleteTitleMemory();

    const getActionItems = (item: TitleMemory): MenuProps['items'] => {
        const userPerms = permissionsHash[item._id] ?? [];
        return [
            {
                key: 'edit',
                disabled: !hasAny(userPerms, REQUIRED_PERMISSIONS.edit),
                label: (
                    <div
                        onClick={e => {
                            e.stopPropagation();
                            if (hasAny(userPerms, REQUIRED_PERMISSIONS.edit)) {
                                navigate(`/edit-title-memory/${item._id}`);
                            }
                        }}
                    >
                        Editar
                    </div>
                ),
            },
            {
                key: 'delete',
                disabled: !hasAny(userPerms, REQUIRED_PERMISSIONS.delete),
                label: (
                    <div
                        onClick={e => {
                            e.stopPropagation();
                            if (hasAny(userPerms, REQUIRED_PERMISSIONS.delete)) {
                                showConfirmation(
                                    '¿Desea eliminar esta memoria de título?',
                                    () => handleDelete(item._id)
                                );
                            }
                        }}
                    >
                        Eliminar
                    </div>
                ),
            },
            {
                key: 'clone',
                disabled: !hasAny(userPerms, REQUIRED_PERMISSIONS.clone),
                label: (
                    <div
                        onClick={e => {
                            e.stopPropagation();
                            navigate(`/clone-title-memory/${item._id}`);
                        }}
                    >
                        Clonar
                    </div>
                ),
            },
            {
                key: 'add-subject',
                disabled: !hasAny(userPerms, REQUIRED_PERMISSIONS['add-subject']),
                label: (
                    <Link
                        to={`/add-subject/${item._id}`}
                        onClick={e => {
                            e.stopPropagation();
                            // la navegación no ocurrirá si está disabled
                        }}
                        style={{ display: 'block', width: '100%' }}
                    >
                        Añadir asignatura
                    </Link>
                ),
            },
        ];
    };

    const fetchData = () => {
        searchTitleMemories({
            filters,
            page: pagination.current,
            limit: pagination.pageSize,
            fromUser,
        });
    };

    const didMountRef = useRef(false);
    useEffect(() => {
        if (didMountRef.current) {
            fetchData();
        } else {
            didMountRef.current = true;
        }
    }, [pagination.current, filters, fromUser]);


    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, current: page }));
    };

    const handleFilterChange = (
        filterType: keyof Filters,
        values: string[] | [number, number]
    ) => {
        setFilters(prev => ({ ...prev, [filterType]: values }));
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const toggleFilters = () => {
        setFiltersVisible(v => !v);
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            await deleteTitleMemory(id);
            fetchData();
        } catch (error) {
            console.error('Error al eliminar la memoria de título:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
            {isMobileOrTablet && !filtersVisible && (
                <Button
                    type="primary"
                    icon={filtersVisible ? <CloseOutlined /> : <MenuOutlined />}
                    onClick={toggleFilters}
                    style={{
                        position: 'fixed',
                        top: '8%',
                        left: '16px',
                        zIndex: 1001,
                    }}
                >
                    {filtersVisible ? 'Cerrar filtros' : 'Abrir filtros'}
                </Button>
            )}

            {!isMobileOrTablet && (
                <Layout.Sider
                    width="20%"
                    style={{ background: 'transparent', padding: '24px 16px', marginRight: '24px' }}
                >
                    <GeneralFilters filters={filters} onFilterChange={handleFilterChange} />
                </Layout.Sider>
            )}

            {isMobileOrTablet && (
                <Drawer
                    title="Filtros"
                    placement="left"
                    closable
                    onClose={toggleFilters}
                    visible={filtersVisible}
                    width="100%"
                    bodyStyle={{ padding: '16px' }}
                >
                    <GeneralFilters
                        filters={filters}
                        onFilterChange={(t, v) => {
                            handleFilterChange(t, v);
                            setFiltersVisible(false);
                        }}
                    />
                </Drawer>
            )}

            <Layout>
                <Content style={{ padding: '24px', marginLeft: isMobileOrTablet ? 0 : '24px' }}>
                    {data.length === 0 ? (
                        <NoData onRefresh={fetchData} />
                    ) : (
                        <>
                            <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>
                                {fromUser ? 'Mis memorias de título' : 'Memorias de título'}
                            </h1>
                            <Spin spinning={loading}>
                                <Row gutter={[16, 16]}>
                                    {data.map(item => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                                            <TitleMemoryCard
                                                item={item}
                                                fromUser={fromUser}
                                                getActionItems={() => getActionItems(item)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Spin>
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
