import { useState } from 'react';
import { Table, Card, Tag, Button, Modal, Typography, Divider, message, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Datos mockeados
const mockSkills = [
    {
        _id: { $oid: "682778f0fd9e1d4977e760bd" },
        name: "Comunicación escrita",
        description: "Capacidad de redactar documentos claros",
        type: "General",
        created_at: { $date: "2025-05-09T17:00:27.305Z" },
        updated_at: { $date: "2025-05-09T17:00:27.305Z" }
    },
    {
        _id: { $oid: "683f1cf023e3d381435d0e70" },
        name: "Redacción técnica",
        description: "Habilidad para escribir documentos técnicos precisos",
        type: "General",
        created_at: { $date: "2025-05-15T10:20:15.120Z" },
        updated_at: { $date: "2025-05-15T10:20:15.120Z" }
    },
    {
        _id: { $oid: "683f1cf023e3d381435d0e71" },
        name: "Expresión escrita",
        description: "Capacidad de expresarse claramente por escrito",
        type: "General",
        created_at: { $date: "2025-05-16T08:15:22.450Z" },
        updated_at: { $date: "2025-05-16T08:15:22.450Z" }
    }
];

const mockSimilarities = [
    {
        _id: { $oid: "683f2a3c2a6d5d162b740f00" },
        document_id: { $oid: "682778f0fd9e1d4977e760bd" },
        similars: [
            {
                other_id: { $oid: "683f1cf023e3d381435d0e70" },
                description_similarity: 0.8055,
                seen_at: { $date: "2025-06-15T09:07:44.325Z" }
            },
            {
                other_id: { $oid: "683f1cf023e3d381435d0e71" },
                description_similarity: 0.7543,
                seen_at: { $date: "2025-06-15T10:12:33.215Z" }
            }
        ]
    }
];

const SimilarityReview = () => {
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [similarities, setSimilarities] = useState(mockSimilarities);

    // Función para encontrar una skill por ID
    const findSkillById = (id) => {
        return mockSkills.find(skill => skill._id.$oid === id);
    };

    // Procesar datos para la tabla
    const tableData = similarities.map(similarity => {
        const mainSkill = findSkillById(similarity.document_id.$oid);
        return {
            key: similarity._id.$oid,
            mainSkillName: mainSkill.name,
            mainSkillDescription: mainSkill.description,
            similarCount: similarity.similars.length,
            similarityId: similarity._id.$oid,
            similars: similarity.similars.map(similar => {
                const similarSkill = findSkillById(similar.other_id.$oid);
                return {
                    ...similar,
                    similarSkillName: similarSkill.name,
                    similarSkillDescription: similarSkill.description
                };
            })
        };
    });

    // Manejar aprobación/rechazo global
    const handleGlobalAction = (similarityId, actionType) => {
        // Aquí iría la lógica para guardar la decisión en tu backend
        setSimilarities(prev => prev.filter(item => item._id.$oid !== similarityId));

        const mainSkillName = tableData.find(item => item.similarityId === similarityId)?.mainSkillName;

        message.success(`Has ${actionType === 'approve' ? 'aprobado' : 'rechazado'} todas las similitudes para "${mainSkillName}"`);
    };

    // Columnas para la tabla principal
    const columns = [
        {
            title: 'Competencia Principal',
            dataIndex: 'mainSkillName',
            key: 'mainSkillName',
        },
        {
            title: 'Descripción',
            dataIndex: 'mainSkillDescription',
            key: 'mainSkillDescription',
        },
        {
            title: 'Similitudes',
            dataIndex: 'similarCount',
            key: 'similarCount',
            render: (count) => (
                <Tag color={count > 0 ? 'blue' : 'green'}>
                    {count} similar{count !== 1 ? 'es' : ''}
                </Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedSkill(record);
                            setModalVisible(true);
                        }}
                    >
                        Detalles
                    </Button>

                    <Popconfirm
                        title={`¿Aprobar todas las similitudes para ${record.mainSkillName}?`}
                        onConfirm={() => handleGlobalAction(record.similarityId, 'approve')}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button type="primary" icon={<CheckOutlined />}>
                            Aprobar
                        </Button>
                    </Popconfirm>

                    <Popconfirm
                        title={`¿Rechazar todas las similitudes para ${record.mainSkillName}?`}
                        onConfirm={() => handleGlobalAction(record.similarityId, 'reject')}
                        okText="Sí"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<CloseOutlined />}>
                            Rechazar
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', width: '80%', margin: '0 auto' }}>
            <Card title="Revisión de Competencias Similares" bordered={false}>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    rowKey="key"
                />
            </Card>

            <Modal
                title={`Detalles de similitudes para: ${selectedSkill?.mainSkillName}`}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedSkill && (
                    <>
                        <div style={{ marginBottom: '20px' }}>
                            <Text strong>Habilidad principal:</Text>
                            <p>{selectedSkill.mainSkillDescription}</p>
                        </div>

                        <Divider orientation="left">Habilidades similares</Divider>

                        <Table
                            dataSource={selectedSkill.similars}
                            pagination={false}
                            rowKey={record => record.other_id.$oid}
                            columns={[
                                {
                                    title: 'Habilidad Similar',
                                    dataIndex: 'similarSkillName',
                                    key: 'similarSkillName',
                                },
                                {
                                    title: 'Descripción',
                                    dataIndex: 'similarSkillDescription',
                                    key: 'similarSkillDescription',
                                },
                                {
                                    title: 'Similitud',
                                    dataIndex: 'description_similarity',
                                    key: 'description_similarity',
                                    render: (value) => `${(value * 100).toFixed(1)}%`,
                                },
                            ]}
                        />
                    </>
                )}
            </Modal>
        </div>
    );
};
export default SimilarityReview;