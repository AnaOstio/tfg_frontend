import React from 'react';
import { Row, Col, Input, Button, List } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Skill } from '../../utils/skill';

interface SkillSectionProps {

    /** Datos */
    skills: Skill[];
    searchText: string;
    newSkill: { code: string; description: string, type: string };

    /** Callbacks */
    onSearchChange: (value: string) => void;
    onAddSkill: () => void;
    onRemoveSkill: (id: string) => void;
    onNewSkillChange: (field: 'code' | 'description' | 'type', value: string) => void;
}

export const SkillSection: React.FC<SkillSectionProps> = ({
    skills,
    searchText,
    newSkill,
    onSearchChange,
    onAddSkill,
    onRemoveSkill,
    onNewSkillChange,
}) => {
    return (
        <>
            {/* 🔍 Buscador + botón “Añadir” */}
            <Row gutter={8} style={{ marginBottom: 16 }}>
                <Col span={18}>
                    <Input
                        placeholder="Buscar competencia…"
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        prefix={<SearchOutlined />}
                    />
                </Col>
                <Col span={6}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onAddSkill}
                        block
                    >
                        Añadir
                    </Button>
                </Col>
            </Row>

            {/* ➕ Formulario rápido para nueva competencia */}
            <div
                style={{
                    marginBottom: 16,
                    padding: 16,
                    border: '1px dashed #d9d9d9',
                    borderRadius: 4,
                }}
            >
                <Row gutter={8} align="middle">
                    <Col span={4}>
                        <Input
                            placeholder="Código"
                            value={newSkill.code}
                            onChange={(e) =>
                                onNewSkillChange('code', e.target.value)
                            }
                        />
                    </Col>
                    <Col span={10}>
                        <Input
                            placeholder="Descripción"
                            value={newSkill.description}
                            onChange={(e) =>
                                onNewSkillChange('description', e.target.value)
                            }
                        />
                    </Col>
                    <Col span={8}>
                        <Input
                            placeholder="Tipo"
                            value={newSkill.type}
                            onChange={(e) =>
                                onNewSkillChange('type', e.target.value)
                            }
                        />
                    </Col>
                    <Col span={2}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onAddSkill}
                            disabled={
                                !newSkill.code.trim() ||
                                !newSkill.description.trim()
                            }
                        />
                    </Col>
                </Row>
            </div>

            {/* 📋 Listado de competencias */}
            <List
                dataSource={skills}
                locale={{ emptyText: 'Sin competencias añadidas' }}
                renderItem={(skill) => (
                    <List.Item
                        key={skill.id}
                        actions={[
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => onRemoveSkill(skill.id)}
                            />,
                        ]}
                    >
                        <List.Item.Meta
                            title={<strong>{skill.code}</strong>}
                            description={skill.description}
                        />
                    </List.Item>
                )}
            />
        </>
    );
};
