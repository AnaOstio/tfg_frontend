import React, { useEffect, useState } from 'react';
import { Layout, Typography, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import { TitleMemory } from './types';
import GeneralInfoCard from './details/GeneralInfoCard';
import CreditsDistributionCard from './details/CreditsDistributionCard';
import SkillsTable from './details/SkillsTables';
import OutcomesTable from './details/OutcomesTable';
import TitleSidebar from './details/TitleSidebar';

const { Content } = Layout;
const { Title } = Typography;

const TitleMemoryDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [titleMemory, setTitleMemory] = useState<TitleMemory | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMenuKey, setSelectedMenuKey] = useState('general');

    useEffect(() => {
        // Simulación de llamada a la API
        const fetchTitleMemory = async () => {
            setLoading(true);
            try {
                // Mock data basado en tu ejemplo
                const mockData: TitleMemory = {
                    _id: "68239c33c367cb78e9713cba",
                    titleCode: 1,
                    universities: ["Universidad de Ejemplo 2"],
                    centers: ["Facultad de Ingeniería"],
                    name: "Ing. Informatica del software 202239",
                    academicLevel: "Grado",
                    branch: "Ingeniería",
                    academicField: "Informática",
                    status: "Activo",
                    yearDelivery: 2023,
                    totalCredits: 240,
                    distributedCredits: {
                        "Básicos": 60,
                        "Optativa": 30,
                        "Obligatoria": 150,
                        "Trabajo Fin de Carrera": 6
                    },
                    skills: [
                        {
                            _id: "681e34ab57faf39c006df5ab",
                            code: "SKL001",
                            description: "Capacidad para desarrollar software de calidad",
                            type: "Técnica"
                        },
                        {
                            _id: "681e34ad57faf39c006df5ad",
                            code: "SKL002",
                            description: "Habilidad para trabajar en equipo",
                            type: "Transversal"
                        }
                    ],
                    learningOutcomes: [
                        {
                            _id: "681f0d8f7627d592a98f8642",
                            description: "Capacidad para analizar problemas complejos",
                            associatedSkills: ["681e34ab57faf39c006df5ab"]
                        }
                    ]
                };

                setTitleMemory(mockData);
            } catch (error) {
                console.error("Error fetching title memory:", error);
            } finally {
                setLoading(false);
            }
        };

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