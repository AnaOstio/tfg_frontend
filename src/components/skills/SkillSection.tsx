import React, { useState } from 'react';
import { Row, Col, Input, Button, List } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Skill } from '../../utils/skill';
import { InfiniteSearchSelectInput } from '../inputs/InfiniteSearchSelectInput';

interface SkillSectionProps {
    skills: Skill[];
    selectedSkill: Skill | null;
    newSkill: { code: string; description: string; type: string };
    onSelectSkill: (skill: Skill) => void;
    onAddSkill: () => void;
    onRemoveSkill: (id: string) => void;
    onNewSkillChange: (field: 'code' | 'description', value: string) => void;
}

export const SkillSection: React.FC<SkillSectionProps> = ({
    skills,
    selectedSkill,
    newSkill,
    onSelectSkill,
    onAddSkill,
    onRemoveSkill,
    onNewSkillChange,
}) => {
    // Simulación de una búsqueda paginada (puedes reemplazar esto por tu API)
    const fetchSkills = async (search: string, page: number) => {
        const pageSize = 10;
        const allSkills: Skill[] = Array.from({ length: 100 }, (_, i) => ({
            id: String(i),
            code: `S${i}`,
            description: `Competencia ${i}`,
            type: 'technical',
        }));

        const filtered = allSkills.filter(
            (s) =>
                s.description.toLowerCase().includes(search.toLowerCase()) ||
                s.code.toLowerCase().includes(search.toLowerCase())
        );

        const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

        return {
            data: paginated,
            hasMore: page * pageSize < filtered.length,
        };
    };

    return (
        <>
            {/* 🔍 Buscador + botón “Añadir” */}
            <Row gutter={8} style={{ marginBottom: 16 }}>
                <Col span={18}>
                    <InfiniteSearchSelectInput<Skill>
                        placeholder="Buscar competencia…"
                        fetchData={fetchSkills}
                        renderItem={(item) => (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <strong>{item.code}</strong>
                                <span>{item.description}</span>
                            </div>
                        )}
                        value={selectedSkill?.description || ''}
                        onSelect={onSelectSkill}
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
                            onChange={(e) => onNewSkillChange('code', e.target.value)}
                        />
                    </Col>
                    <Col span={18}>
                        <Input
                            placeholder="Descripción"
                            value={newSkill.description}
                            onChange={(e) => onNewSkillChange('description', e.target.value)}
                        />
                    </Col>
                    <Col span={2}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onAddSkill}
                            disabled={!newSkill.code.trim() || !newSkill.description.trim()}
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
                            description={
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        alignItems: 'center',
                                    }}
                                >
                                    <strong>{skill.code}</strong>
                                    <span>{skill.description}</span>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </>
    );
};
