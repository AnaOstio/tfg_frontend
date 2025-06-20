import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Typography, Divider, Tag, Table, Spin } from 'antd';
import { useGetSubjectById } from '../../hooks/useSubjects';

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
    name: string;
    description: string;
    type: string;
}

interface LearningOutcome {
    _id: string;
    description: string;
    associatedSkills: string[];
}

const SubjectDetails: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [outcomes, setOutcomes] = useState<LearningOutcome[]>([]);
    const [loading, setLoading] = useState(true);
    const { mutateAsync: getById } = useGetSubjectById(subjectId || '');

    const fetchSubject = async (id: string) => {
        setLoading(true);
        try {
            const response = await getById(id);
            setSubject(response.subject);
            setSkills(response.validSkills);
            setOutcomes(response.validLearningOutcomes);
        } catch (error) {
            console.error('Error fetching subject:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (subjectId) fetchSubject(subjectId);
    }, [subjectId]);

    if (loading) return <Spin tip="Cargando detalles de la asignatura..." />;
    if (!subject) return null;

    const associatedSkills = Object.keys(subject.skills)
        .map(id => skills.find(s => s._id === id))
        .filter((s): s is Skill => !!s);

    const associatedOutcomes = outcomes;

    return (
        <div style={{ padding: 24, width: '80%', margin: '0 auto' }}>
            <Title level={2}>{subject.name}</Title>
            <Divider />

            <Card title="Datos Generales" style={{ marginBottom: 24 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Text strong>Código:</Text> <div>{subject.code}</div>
                    </Col>
                    <Col span={12}>
                        <Text strong>Créditos:</Text> <div>{subject.credits}</div>
                    </Col>
                    <Col span={12}>
                        <Text strong>Naturaleza:</Text> <div>{subject.nature}</div>
                    </Col>
                    <Col span={12}>
                        <Text strong>Duración:</Text> <div>{subject.duration}</div>
                    </Col>
                </Row>
            </Card>

            <Card title="Competencias Asociadas" style={{ marginBottom: 24 }}>
                {associatedSkills.map(skill => (
                    <Card type="inner" key={skill._id} style={{ marginBottom: 12 }}>
                        <Text strong>Nombre:</Text> {skill.name}<br />
                        <Text strong>Descripción:</Text> {skill.description}<br />
                        <Text strong>Tipo:</Text> {skill.type}
                    </Card>
                ))}
            </Card>

            <Card title="Resultados de Aprendizaje">
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
                            render: (_, record: LearningOutcome) => (
                                <>
                                    {record.associatedSkills.map(id => {
                                        const skill = skills.find(s => s._id === id);
                                        return skill ? <Tag key={id}>{skill.name}</Tag> : null;
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
