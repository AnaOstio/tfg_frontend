import React from 'react';
import { Card, Collapse, Button } from 'antd';
import { SkillSection } from '../../../components/skills/SkillSection';
import { Skill } from '../../../utils/skill';

interface SkillsStepProps {
    skills: {
        basic: Skill[];
        general: Skill[];
        transversal: Skill[];
        specific: Skill[];
    };
    searchText: {
        basic: string;
        general: string;
        transversal: string;
        specific: string;
    };
    newSkill: {
        basic: { code: string; description: string, type: string };
        general: { code: string; description: string, type: string };
        transversal: { code: string; description: string, type: string };
        specific: { code: string; description: string, type: string };
    };
    onSearchChange: (type: 'basic' | 'general' | 'transversal' | 'specific', value: string) => void;
    onAddSkill: (type: 'basic' | 'general' | 'transversal' | 'specific') => void;
    onRemoveSkill: (type: 'basic' | 'general' | 'transversal' | 'specific', id: string) => void;
    onNewSkillChange: (
        type: 'basic' | 'general' | 'transversal' | 'specific',
        field: 'code' | 'description',
        value: string
    ) => void;
    onPrev: () => void;
    onNext: () => void;
}

export const SkillsStep: React.FC<SkillsStepProps> = (props) => {
    const { skills, searchText, newSkill,
        onSearchChange, onAddSkill, onRemoveSkill,
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
                            searchText={searchText[type]}
                            newSkill={newSkill[type]}
                            onSearchChange={(val) => onSearchChange(type, val)}
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