import React from 'react';
import { Row, Col, List, Button, Input } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Skill } from '../../utils/skill';
import { InfiniteSearchSelectInput } from '../inputs/InfiniteSearchSelectInput';
import { useSkillSearch } from '../../hooks/useSkills';

interface SkillSectionProps {
    skillType: string;
    skills?: Skill[];
    selectedSkill?: Skill | null;
    newSkill?: { name: string; description: string };
    searchText?: string;
    onSearchTextChange: (value: string) => void;
    onSelectSkill: (item: Skill) => void;
    onAddSkill: () => void;
    onRemoveSkill: (id: string) => void;
    onNewSkillChange: (field: 'name' | 'description', value: string) => void;
}

export const SkillSection: React.FC<SkillSectionProps> = ({
    skillType,
    skills = [],
    selectedSkill = null,
    newSkill = { name: '', description: '' },
    searchText = '',
    onSearchTextChange,
    onSelectSkill,
    onAddSkill,
    onRemoveSkill,
    onNewSkillChange,
}) => {
    const { mutateAsync: searchSkillMutate } = useSkillSearch();

    const fetchSkills = async (search: string, page: number) => {
        const res = await searchSkillMutate({ search, page, type: skillType });
        return {
            data: res.data,
            hasMore: res.hasMore,
        };
    };

    return (
        <>
            <Row gutter={8} style={{ marginBottom: 16 }}>
                <Col span={24}>
                    <InfiniteSearchSelectInput<Skill>
                        placeholder={`Buscar competencia ${skillType}...`}
                        fetchData={fetchSkills}
                        renderItem={(item) => (
                            <div>
                                <strong>{item.name}</strong> - {item.description}
                            </div>
                        )}
                        onSelect={onSelectSkill}
                        value={searchText}
                        onChange={onSearchTextChange}
                        selectedItem={selectedSkill}
                        onAddItem={onAddSkill}
                    />
                </Col>
            </Row>

            <div style={{ marginBottom: 16, padding: 16, border: '1px dashed #d9d9d9', borderRadius: 4 }}>
                <Row gutter={8} align="middle">
                    <Col span={8}>
                        <Input
                            placeholder="Código"
                            value={newSkill.name}
                            onChange={(e) => onNewSkillChange('name', e.target.value)}
                        />
                    </Col>
                    <Col span={14}>
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
                            disabled={!newSkill.name || !newSkill.description}
                        />
                    </Col>
                </Row>
            </div>

            <List
                dataSource={skills}
                locale={{ emptyText: 'No hay competencias añadidas' }}
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
                                <>
                                    <strong>{skill.name}</strong> - {skill.description}
                                </>
                            }
                        />
                    </List.Item>
                )}
            />
        </>
    );
};