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
                { title: 'Descripción', dataIndex: 'description', key: 'description' },
                {
                    title: 'Competencias Asociadas',
                    key: 'associatedSkills',
                    render: (_, record) => (
                        <>
                            {record.associatedSkills.map((id: string) => {
                                const skill = skills.find(s => s._id === id);
                                return skill ? <Tag key={id}>{skill.code}</Tag> : null;
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
