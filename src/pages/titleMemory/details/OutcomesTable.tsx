import React from 'react';
import { Table, Card, Tag } from 'antd';
import { LearningOutcome, Skill } from '../types';

interface Props {
    outcomes: LearningOutcome[];
    skills: Skill[];
    loading: boolean;
}

const OutcomesTable: React.FC<Props> = ({ outcomes, skills, loading }) => (
    <Card title="Resultados de Aprendizaje" loading={loading}>
        <Table
            columns={[
                { title: 'Código', dataIndex: 'name', key: 'name' },
                { title: 'Descripción', dataIndex: 'description', key: 'description' },
                {
                    title: 'Competencias Asociadas',
                    key: 'skills_id',
                    render: (_, record) => (
                        <>
                            {record.skills_id?.map((id: string) => {
                                const skill = skills.find(s => s._id === id);
                                return skill ? <Tag key={id}>{skill.name}</Tag> : null;
                            })}
                        </>
                    ),
                },
            ]}
            dataSource={outcomes}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
        />
    </Card>
);

export default OutcomesTable;
