import React from 'react';
import { Card, Table, Button, Form, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { LearningOutcome } from '../SubjectForm';

interface Props {
    outcomes: LearningOutcome[];
    onAddOutcome: () => void;
    onRemoveOutcome: (index: number) => void;
}

const LearningOutcomesTable: React.FC<Props> = ({ outcomes, onAddOutcome, onRemoveOutcome }) => (
    <Card title="Resultados de Aprendizaje" style={{ marginTop: 16 }}>
        <Table
            dataSource={outcomes}
            rowKey={(_, index) => `${index}`}
            pagination={false}
            columns={[
                {
                    title: 'Resultado',
                    dataIndex: 'outcome',
                    render: (_, __, index) => (
                        <Form.Item name={['outcomes', index, 'outcome']} rules={[{ required: true }]}>
                            <Input placeholder="Descripción del resultado" />
                        </Form.Item>
                    )
                },
                {
                    title: 'ID Habilidad Asociada',
                    dataIndex: 'skillId',
                    render: (_, __, index) => (
                        <Form.Item name={['outcomes', index, 'skillId']} rules={[{ required: true }]}>
                            <Input placeholder="ID de habilidad" />
                        </Form.Item>
                    )
                },
                {
                    title: 'Acciones',
                    render: (_, __, index) => (
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onRemoveOutcome(index)}
                        />
                    )
                }
            ]}
        />
        <Button type="dashed" onClick={onAddOutcome} icon={<PlusOutlined />} style={{ marginTop: 8 }}>
            Añadir Resultado
        </Button>
    </Card>
);

export default LearningOutcomesTable;
