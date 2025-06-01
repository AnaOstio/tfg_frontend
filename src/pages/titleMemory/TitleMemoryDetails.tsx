import React, { useEffect, useState } from 'react';
import { Layout, Typography, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import { TitleMemory } from './types';
import GeneralInfoCard from './details/GeneralInfoCard';
import CreditsDistributionCard from './details/CreditsDistributionCard';
import SkillsTable from './details/SkillsTables';
import OutcomesTable from './details/OutcomesTable';
import TitleSidebar from './details/TitleSidebar';
import SubjectsGrid from './details/SubjectsGrid';
import { useGetTileMemoryById } from '../../hooks/useTitleMemories';

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
            const data = await getById(id);

            setTitleMemory(data);
        } catch (error) {
            console.error("Error fetching title memory:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTitleMemory();
    }, [id]);

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
                            <Title level={2}>{titleMemory.name}</Title>
                            <Divider />
                            {renderContent()}
                        </>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default TitleMemoryDetails;