import React from 'react';
import { Card, Collapse, Button } from 'antd';
import { SkillSection } from '../../../components/skills/SkillSection';
import { Skill } from '../../../utils/skill';

export type SkillType = 'basic' | 'general' | 'transversal' | 'specific';

interface SkillsStepProps {
    skills: Record<SkillType, Skill[]>;
    selectedSkill: Record<SkillType, Skill | null>;
    searchTexts: Record<SkillType, string>;
    newSkills: Record<SkillType, { name: string; description: string }>;
    onSelectSkill: (type: SkillType, skill: Skill) => void;
    onSearchTextChange: (type: SkillType, value: string) => void;
    onAddSkill: (type: SkillType) => void;
    onRemoveSkill: (type: SkillType, id: string) => void;
    onNewSkillChange: (type: SkillType, field: 'name' | 'description', value: string) => void;
    onPrev: () => void;
    onNext: () => void;
}

export const SkillsStep: React.FC<SkillsStepProps> = ({
    skills,
    selectedSkill,
    searchTexts,
    newSkills,
    onSelectSkill,
    onSearchTextChange,
    onAddSkill,
    onRemoveSkill,
    onNewSkillChange,
    onPrev,
    onNext,
}) => {
    const skillTypes: SkillType[] = ['basic', 'general', 'transversal', 'specific'];

    return (
        <Card title="Competencias" style={{ marginBottom: 20 }}>
            <Collapse defaultActiveKey={skillTypes}>
                {skillTypes.map((type) => (
                    <Collapse.Panel key={type} header={`Competencias ${type.toUpperCase()}`}>
                        <SkillSection
                            skillType={type}
                            skills={skills[type]}
                            selectedSkill={selectedSkill[type]}
                            searchText={searchTexts[type]}
                            newSkill={newSkills[type]}
                            onSelectSkill={(skill) => onSelectSkill(type, skill)}
                            onSearchTextChange={(value) => onSearchTextChange(type, value)}
                            onAddSkill={() => onAddSkill(type)}
                            onRemoveSkill={(id) => onRemoveSkill(type, id)}
                            onNewSkillChange={(field, value) => onNewSkillChange(type, field, value)}
                        />
                    </Collapse.Panel>
                ))}
            </Collapse>

            <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Button onClick={onPrev} style={{ marginRight: 8 }}>Atrás</Button>
                <Button
                    type="primary"
                    onClick={onNext}
                    disabled={Object.values(skills).flat().length === 0}
                >
                    Siguiente
                </Button>
            </div>
        </Card>
    );
};