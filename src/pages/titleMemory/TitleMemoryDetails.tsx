import React, { use, useEffect, useState } from 'react';
import { Layout, Typography, Divider, Dropdown, Button, MenuProps } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TitleMemory } from './types';
import GeneralInfoCard from './details/GeneralInfoCard';
import CreditsDistributionCard from './details/CreditsDistributionCard';
import SkillsTable from './details/SkillsTables';
import OutcomesTable from './details/OutcomesTable';
import TitleSidebar from './details/TitleSidebar';
import SubjectsGrid from './details/SubjectsGrid';
import { useDeleteTitleMemory, useGetTileMemoryById } from '../../hooks/useTitleMemories';
import useConfirmation from '../../hooks/useConfirmation';
import { useGetPermissionsByMemoriesIds } from '../../hooks/usePermissions';

const { Content } = Layout;
const { Title } = Typography;

const TitleMemoryDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [titleMemory, setTitleMemory] = useState<TitleMemory | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMenuKey, setSelectedMenuKey] = useState('general');
    const { mutateAsync: getById } = useGetTileMemoryById();
    const [permissions, setPermissions] = useState<any[]>([]);

    const { mutateAsync: getPermissionsByMemoriesIds } = useGetPermissionsByMemoriesIds();

    const fetchTitleMemory = async () => {
        setLoading(true);

        try {
            if (id) {
                const data = await getById(id);
                setTitleMemory(data);
                const response = await getPermissionsByMemoriesIds([id]);
                console.log('Permisos obtenidos:', response);
                setPermissions(response.data[0]?.permissions || []);
            }
        } catch (error) {
            console.error("Error fetching title memory:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTitleMemory();
    }, [id]);

    const navigate = useNavigate();
    const { mutateAsync: deleteTitleMemory } = useDeleteTitleMemory();

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            console.log('Eliminando memoria:', id);
            await deleteTitleMemory(id);

            navigate('/dashboard');
        } catch (error) {
            console.error("Error deleting title memory:", error);
        } finally {
            setLoading(false);
        }
    }

    type ActionKey = 'edit' | 'delete' | 'clone' | 'add-subject';
    const REQUIRED_PERMISSIONS: Record<ActionKey, string[]> = {
        edit: ['Propietario', 'Edición'],
        delete: ['Propietario', 'Eliminar'],
        clone: [],               // siempre permitido
        'add-subject': ['Propietario', 'Asignaturas'],
    };

    const hasAny = (userPerms: string[], needed: string[]) =>
        needed.length === 0 || needed.some(p => userPerms.includes(p));

    const { showConfirmation, ConfirmationModal } = useConfirmation();

    const getActionItems = (id: string): MenuProps['items'] => [
        {
            key: 'edit',
            disabled: !hasAny(permissions, REQUIRED_PERMISSIONS.edit),
            label: (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-title-memory/${id}`);
                    }}
                >
                    Editar
                </div>
            ),
        },
        {
            key: 'delete',
            disabled: !hasAny(permissions, REQUIRED_PERMISSIONS.delete),
            label: (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        showConfirmation(
                            '¿Desea eliminar esta memoria de título?',
                            () => handleDelete(id),
                        );
                    }}
                >
                    Eliminar
                </div>
            ),
        },
        {
            key: 'clone',
            disabled: !hasAny(permissions, REQUIRED_PERMISSIONS.clone),
            label: (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/clone-title-memory/${id}`);
                    }}
                >
                    Clonar
                </div>
            ),
        },
        {
            key: 'add-subject',
            disabled: !hasAny(permissions, REQUIRED_PERMISSIONS['add-subject']),
            label: (
                <Link
                    to={`/add-subject/${id}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: 'block', width: '100%' }}
                >
                    Añadir asignatura
                </Link>
            ),
        },
    ];

    const renderContent = () => {
        if (!titleMemory) return null;
        switch (selectedMenuKey) {
            case 'general':
                return (
                    <>
                        <GeneralInfoCard titleMemory={titleMemory} loading={loading} />
                        <CreditsDistributionCard titleMemory={titleMemory} loading={loading} />
                    </>
                );
            case 'skills':
                return <SkillsTable skills={titleMemory.skills} loading={loading} />;
            case 'outcomes':
                return <OutcomesTable outcomes={titleMemory.learningOutcomes} skills={titleMemory.skills} loading={loading} />;
            case 'subjects':
                return <SubjectsGrid permissions={permissions} />;
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <TitleSidebar selectedKey={selectedMenuKey} onSelect={setSelectedMenuKey} />
            <Layout>
                <Content style={{ padding: 24 }}>
                    {titleMemory && (
                        <>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 16
                            }}>
                                <Title level={2} style={{ margin: 0 }}>
                                    {titleMemory.name}
                                </Title>

                                <Dropdown
                                    menu={{ items: getActionItems(id) }}
                                    trigger={['click']}
                                >
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Acciones
                                    </Button>
                                </Dropdown>
                            </div>

                            <Divider />

                            {renderContent()}
                        </>
                    )}
                </Content>
            </Layout>
            <ConfirmationModal />
        </Layout>

    );
};

export default TitleMemoryDetails;