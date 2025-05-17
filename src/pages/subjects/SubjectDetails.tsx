import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Typography, Divider, Tag, Table } from 'antd';

const { Title, Text } = Typography;

interface Subject {
    _id: string;
    code: string;
    name: string;
    credits: number;
    nature: string;
    duration: string;
    skills: { [key: string]: number };
    learningsOutcomes: string[];
}

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

const mockSkills: Skill[] = [
    {
        _id: "681e34ab57faf39c006df5ab",
        code: "SKL001",
        description: "Capacidad para desarrollar software de calidad",
        type: "Técnica",
    },
];

const mockOutcomes: LearningOutcome[] = [
    {
        _id: "681f0d8f7627d592a98f8642",
        description: "Capacidad para analizar problemas complejos",
        associatedSkills: ["681e34ab57faf39c006df5ab"],
    },
];

const mockSubject: Subject = {
    _id: "6828ae32746eb3747517101b",
    code: "MAT101",
    name: "Matemáticas I",
    credits: 6,
    nature: "Obligatoria",
    duration: "Anual",
    skills: {
        "681e34ab57faf39c006df5ab": 20,
    },
    learningsOutcomes: ["681f0d8f7627d592a98f8642"],
};

const SubjectDetails: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simular carga de datos
        setTimeout(() => {
            setSubject(mockSubject);
            setLoading(false);
        }, 500);
    }, [subjectId]);

    if (!subject) return null;

    const associatedSkills = Object.keys(subject.skills).map(skillId =>
        mockSkills.find(s => s._id === skillId)
    );

    const associatedOutcomes = subject.learningsOutcomes.map(outcomeId =>
        mockOutcomes.find(o => o._id === outcomeId)
    );

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>{subject.name}</Title>
            <Divider />

            <Card title="Datos Generales" loading={loading} style={{ marginBottom: 24 }}>
                <Row gutter={16}>
                    <Col span={12}><Text strong>Código: </Text> <div>{subject.code}</div></Col>
                    <Col span={12}><Text strong>Créditos:</Text> <div>{subject.credits}</div></Col>
                    <Col span={12}><Text strong>Naturaleza:</Text> <div>{subject.nature}</div></Col>
                    <Col span={12}><Text strong>Duración:</Text> <div>{subject.duration}</div></Col>
                </Row>
            </Card>

            <Card title="Competencias Asociadas" loading={loading} style={{ marginBottom: 24 }}>
                {associatedSkills.map(skill =>
                    skill ? (
                        <Card type="inner" key={skill._id} style={{ marginBottom: 12 }}>
                            <Text strong>Código:</Text> {skill.code}<br />
                            <Text strong>Descripción:</Text> {skill.description}<br />
                            <Text strong>Tipo:</Text> {skill.type}
                        </Card>
                    ) : null
                )}
            </Card>

            <Card title="Resultados de Aprendizaje" loading={loading}>
                <Table
                    dataSource={associatedOutcomes}
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
                                <>
                                    {record?.associatedSkills.map(id => {
                                        const skill = mockSkills.find(s => s._id === id);
                                        return skill ? <Tag key={id}>{skill.code}</Tag> : null;
                                    })}
                                </>
                            ),
                        },
                    ]}
                    rowKey="_id"
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default SubjectDetails;
