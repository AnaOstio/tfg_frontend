import React, { useState } from 'react';
import { Card, Table, Button, Select, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Skill } from '../SubjectForm';

const { Option } = Select;

interface Props {
    skills: Skill[];
    availableSkills: Skill[];
    onAddSkill: (id: string) => void;
    onRemoveSkill: (id: string) => void;
}

const SkillSelectorTable: React.FC<Props> = ({ skills, availableSkills, onAddSkill, onRemoveSkill }) => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<string | null>(null);

    const filtered = availableSkills.filter(skill =>
        skill.name.toLowerCase().includes(search.toLowerCase()) || skill.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Card title="Competencias relacionadas" style={{ marginTop: 16 }}>
            <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
                <Select
                    showSearch
                    placeholder="Selecciona una habilidad"
                    style={{ width: '95%' }}
                    value={selected}
                    onChange={setSelected}
                    onSearch={setSearch}
                    filterOption={false}
                >
                    {filtered.map(skill => (
                        <Option key={skill.id} value={skill.id}>
                            {skill.id} - {skill.name}
                        </Option>
                    ))}
                </Select>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        if (selected) {
                            onAddSkill(selected);
                            setSelected(null);
                        }
                    }}
                >
                    Añadir
                </Button>
            </Space.Compact>

            <Table
                dataSource={skills}
                rowKey="id"
                pagination={false}
                columns={[
                    { title: 'ID-Comp.', dataIndex: 'id', key: 'id' },
                    { title: 'Competencia', dataIndex: 'name', key: 'name' },
                    { title: 'Tipo', dataIndex: 'type', key: 'type' },
                    {
                        title: 'Acciones',
                        key: 'actions',
                        render: (_, record) => (
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => onRemoveSkill(record.id)}
                            />
                        )
                    }
                ]}
            />
        </Card>
    );
};

export default SkillSelectorTable;
