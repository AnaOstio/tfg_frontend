import React from 'react';
import { Card, Table, Form, Input } from 'antd';
import { LearningOutcome } from '../SubjectForm';

interface Props {
    outcomes: LearningOutcome[];
}

const LearningOutcomesTable: React.FC<Props> = ({ outcomes }) => (
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
                }
            ]}
        />
    </Card>
);

export default LearningOutcomesTable;
