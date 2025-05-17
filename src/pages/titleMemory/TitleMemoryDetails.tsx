import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Menu, Card, Table, Typography, Divider, Row, Col, Tag } from 'antd';
import {
    BookOutlined,
    AppstoreOutlined,
    BarsOutlined,
    CheckCircleOutlined,
    BankOutlined,
    ClusterOutlined,
    FlagOutlined
} from '@ant-design/icons';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

interface Skill {
    _id: string;
    code: string;
    description: string;
    type: string;
}

interface LearningOutcome {
    _id: string;
    description: string;
    associatedSkills: string[];
}

interface TitleMemory {
    _id: string;
    titleCode: number;
    universities: string[];
    centers: string[];
    name: string;
    academicLevel: string;
    branch: string;
    academicField: string;
    status: string;
    yearDelivery: number;
    totalCredits: number;
    distributedCredits: {
        [key: string]: number;
    };
    skills: Skill[];
    learningOutcomes: LearningOutcome[];
}

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

    const menuItems = [
        {
            key: 'general',
            icon: <AppstoreOutlined />,
            label: 'Datos Generales',
        },
        {
            key: 'skills',
            icon: <CheckCircleOutlined />,
            label: 'Competencias',
        },
        {
            key: 'outcomes',
            icon: <BarsOutlined />,
            label: 'Resultados de Aprendizaje',
        },
    ];

    const renderContent = () => {
        if (!titleMemory) return null;

        switch (selectedMenuKey) {
            case 'general':
                return (
                    <>
                        <Card title="Información Básica" loading={loading}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Text strong>Universidad:</Text>
                                    <div>{titleMemory.universities.join(', ')}</div>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Centro:</Text>
                                    <div>{titleMemory.centers.join(', ')}</div>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Text strong>Nivel Académico:</Text>
                                    <div>{titleMemory.academicLevel}</div>
                                </Col>
                                <Col span={8}>
                                    <Text strong>Rama:</Text>
                                    <div>{titleMemory.branch}</div>
                                </Col>
                                <Col span={8}>
                                    <Text strong>Área Académica:</Text>
                                    <div>{titleMemory.academicField}</div>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Text strong>Estado:</Text>
                                    <div>
                                        <Tag color={titleMemory.status === 'Activo' ? 'green' : 'red'}>
                                            {titleMemory.status}
                                        </Tag>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Año de Entrega:</Text>
                                    <div>{titleMemory.yearDelivery}</div>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="Distribución de Créditos" style={{ marginTop: 16 }} loading={loading}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Text strong>Total de Créditos:</Text>
                                    <div>{titleMemory.totalCredits}</div>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={16}>
                                {Object.entries(titleMemory.distributedCredits).map(([key, value]) => (
                                    <Col span={6} key={key}>
                                        <Text strong>{key}:</Text>
                                        <div>{value}</div>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </>
                );
            case 'skills':
                return (
                    <Card title="Competencias" loading={loading}>
                        <Table
                            columns={[
                                {
                                    title: 'Código',
                                    dataIndex: 'code',
                                    key: 'code',
                                    width: 120,
                                },
                                {
                                    title: 'Descripción',
                                    dataIndex: 'description',
                                    key: 'description',
                                },
                                {
                                    title: 'Tipo',
                                    dataIndex: 'type',
                                    key: 'type',
                                    width: 150,
                                },
                            ]}
                            dataSource={titleMemory.skills}
                            rowKey="_id"
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                );
            case 'outcomes':
                return (
                    <Card title="Resultados de Aprendizaje" loading={loading}>
                        <Table
                            columns={[
                                {
                                    title: 'Descripción',
                                    dataIndex: 'description',
                                    key: 'description',
                                },
                                {
                                    title: 'Competencias Asociadas',
                                    key: 'associatedSkills',
                                    render: (_, record) => (
                                        <div>
                                            {record.associatedSkills.map(skillId => {
                                                const skill = titleMemory.skills.find(s => s._id === skillId);
                                                return skill ? (
                                                    <Tag key={skill._id}>{skill.code}</Tag>
                                                ) : null;
                                            })}
                                        </div>
                                    ),
                                },
                            ]}
                            dataSource={titleMemory.learningOutcomes}
                            rowKey="_id"
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                );
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={250} theme="light">
                <div style={{ padding: '24px 16px' }}>
                    <Title level={4} style={{ marginBottom: 0 }}>
                        <BookOutlined /> Memoria de Título
                    </Title>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedMenuKey]}
                    onSelect={({ key }) => setSelectedMenuKey(key)}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Content style={{ padding: '24px' }}>
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