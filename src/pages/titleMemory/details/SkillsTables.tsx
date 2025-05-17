import React from 'react';
import { Table, Card } from 'antd';
import { Skill } from '../types';

const SkillsTable: React.FC<{ skills: Skill[]; loading: boolean }> = ({ skills, loading }) => (
    <Card title="Competencias" loading={loading}>
        <Table
            columns={[
                { title: 'Código', dataIndex: 'code', key: 'code', width: 120 },
                { title: 'Descripción', dataIndex: 'description', key: 'description' },
                { title: 'Tipo', dataIndex: 'type', key: 'type', width: 150 },
            ]}
            dataSource={skills}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
        />
    </Card>
);

export default SkillsTable;
