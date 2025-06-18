import React from 'react';
import { Table, Typography, Tag } from 'antd';
import { LearningOutcome, Skill } from '../SubjectForm';

const { Text } = Typography;

interface Props {
    outcomes: LearningOutcome[];
    skills: Skill[];
}

const LearningOutcomesTable: React.FC<Props> = ({ outcomes, skills }) => {
    // Preparar datos para la tabla
    const dataSource = outcomes.map(outcome => {
        // Mapear cada skills_id a su objeto Skill y luego a un Tag
        const skillTags = outcome.skills_id
            .map(id => skills.find(skill => skill._id === id))
            .filter((s): s is Skill => !!s)
            .map(skill => <Tag key={skill._id}>{skill.name}</Tag>);

        return {
            key: outcome._id,
            outcome: (
                <>
                    <Text strong>{outcome.name}</Text>
                    <br />
                    <Text>{outcome.description}</Text>
                </>
            ),
            skills: skillTags
        };
    });

    const columns = [
        {
            title: 'Resultado de Aprendizaje',
            dataIndex: 'outcome',
            key: 'outcome'
        },
        {
            title: 'Competencias Asociadas',
            dataIndex: 'skills',
            key: 'skills'
        }
    ];

    return <Table dataSource={dataSource} columns={columns} pagination={false} />;
};

export default LearningOutcomesTable;
