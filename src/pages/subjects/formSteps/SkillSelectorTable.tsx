import React, { useState } from 'react';
import { Card, Table, Button, Select, Space, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Skill } from '../SubjectForm';

const { Option } = Select;

interface Props {
    skills: Skill[];
    availableSkills: Skill[];
    onAddSkill: (id: string) => void;
    onRemoveSkill: (id: string) => void;
    onSkillsHoursChange?: (id: string, hours: number) => void;
    skillsHours: { [key: string]: number };
}

const SkillSelectorTable: React.FC<Props> = ({ skills, availableSkills, onAddSkill, onRemoveSkill, onSkillsHoursChange, skillsHours }) => {
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
                        <Option key={skill.id} value={skill._id}>
                            {skill.name} - {skill.description}
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
                    { title: 'ID-Comp.', dataIndex: 'name', key: 'name' },
                    { title: 'Competencia', dataIndex: 'description', key: 'description' },
                    { title: 'Tipo', dataIndex: 'type', key: 'type' },
                    {
                        title: 'Horas',
                        dataIndex: 'hours',
                        key: 'hours',
                        render: (_, record) => (
                            <Input
                                type="number"
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Horas"
                                value={skillsHours[record._id] || 0}
                                onChange={(e) => {
                                    const value = e.target.value ? Number(e.target.value) : 0;
                                    if (onSkillsHoursChange && value >= 0) {
                                        if (record._id) {
                                            onSkillsHoursChange?.(record._id, value);
                                        }
                                    }
                                }}
                            />
                        )
                    },
                    {
                        title: 'Acciones',
                        key: 'actions',
                        render: (_, record) => (
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => onRemoveSkill(record._id)}
                            />
                        )
                    }
                ]}
            />
        </Card>
    );
};

export default SkillSelectorTable;
