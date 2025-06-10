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
import { useGetTileMemoryById } from '../../hooks/useTitleMemories';
import useConfirmation from '../../hooks/useConfirmation';

const { Content } = Layout;
const { Title } = Typography;

const TitleMemoryDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [titleMemory, setTitleMemory] = useState<TitleMemory | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMenuKey, setSelectedMenuKey] = useState('general');
    const { mutateAsync: getById } = useGetTileMemoryById();

    const fetchTitleMemory = async () => {
        setLoading(true);

        try {
            if (id) {
                const data = await getById(id);
                setTitleMemory(data);
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
    const { showConfirmation, ConfirmationModal } = useConfirmation();

    const getActionItems = (id: string): MenuProps['items'] => [
        {
            key: 'edit',
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
            label: (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        showConfirmation(
                            '¿Desea eliminar esta memoria de título?',
                            () => console.log('Eliminando memoria:', id)
                        );
                    }}
                >
                    Eliminar
                </div>
            ),
        },
        {
            key: 'clone',
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
                return <SubjectsGrid />;
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