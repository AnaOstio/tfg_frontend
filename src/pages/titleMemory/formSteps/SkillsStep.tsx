import React from 'react';
import { Card, Collapse, Button } from 'antd';
import { SkillSection } from '../../../components/skills/SkillSection';
import { Skill } from '../../../utils/skill';


export type SkillType = 'basic' | 'general' | 'transversal' | 'specific';

interface SkillsStepProps {
    skills: Record<SkillType, Skill[]>;
    selectedSkill: Record<SkillType, Skill | null>;
    newSkill: Record<SkillType, { code: string; description: string; type: string }>;
    onSelectSkill: (type: SkillType, skill: Skill) => void;
    onAddSkill: (type: SkillType) => void;
    onRemoveSkill: (type: SkillType, id: string) => void;
    onNewSkillChange: (type: SkillType, field: 'code' | 'description' | 'type', value: string) => void;
    onPrev: () => void;
    onNext: () => void;
}

export const SkillsStep: React.FC<SkillsStepProps> = (props) => {
    const { skills, selectedSkill, newSkill,
        onSelectSkill, onAddSkill, onRemoveSkill,
        onNewSkillChange, onPrev, onNext } = props;

    return (
        <Card title="Competencias" style={{ marginBottom: 20 }}>
            <Collapse defaultActiveKey={['basic', 'general', 'transversal']}>
                {(['basic', 'general', 'transversal', 'specific'] as const).map((type) => (
                    <Collapse.Panel
                        key={type}
                        header={`COMPETENCIAS ${type.toUpperCase()}`}
                    >
                        <SkillSection
                            skills={skills[type]}
                            selectedSkill={selectedSkill[type]}
                            newSkill={newSkill[type]}
                            onSelectSkill={(skill) => onSelectSkill(type, skill)}
                            onAddSkill={() => onAddSkill(type)}
                            onRemoveSkill={(id) => onRemoveSkill(type, id)}
                            onNewSkillChange={(field, val) => onNewSkillChange(type, field, val)}
                        />
                    </Collapse.Panel>
                ))}
            </Collapse>

            <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Button onClick={onPrev} style={{ marginRight: 8 }}>Atrás</Button>
                <Button type="primary" onClick={onNext}>Confirmar</Button>
            </div>
        </Card>
    );
};

export default SkillsStep;