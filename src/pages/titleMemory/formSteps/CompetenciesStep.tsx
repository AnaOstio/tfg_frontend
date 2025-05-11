import React from 'react';
import { Card, Collapse, Button, Form } from 'antd';
import { Competency } from '../../../utils/titleMemory';
import { CompetencySection } from '../../../components/skills/CompetencySection';

interface CompetenciesStepProps {
    competencies: {
        basic: Competency[];
        general: Competency[];
        transversal: Competency[];
        specific: Competency[];
    };
    searchText: {
        basic: string;
        general: string;
        transversal: string;
        specific: string;
    };
    newCompetency: {
        basic: { code: string; description: string };
        general: { code: string; description: string };
        transversal: { code: string; description: string };
        specific: { code: string; description: string };
    };
    onSearchChange: (type: 'basic' | 'general' | 'transversal' | 'specific', value: string) => void;
    onAddCompetency: (type: 'basic' | 'general' | 'transversal' | 'specific') => void;
    onRemoveCompetency: (type: 'basic' | 'general' | 'transversal' | 'specific', id: string) => void;
    onNewCompetencyChange: (
        type: 'basic' | 'general' | 'transversal' | 'specific',
        field: 'code' | 'description',
        value: string
    ) => void;
    onPrev: () => void;
    onNext: () => void;
}

export const CompetenciesStep: React.FC<CompetenciesStepProps> = (props) => {
    const { competencies, searchText, newCompetency,
        onSearchChange, onAddCompetency, onRemoveCompetency,
        onNewCompetencyChange, onPrev, onNext } = props;

    return (
        <Card title="Competencias" style={{ marginBottom: 20 }}>
            <Collapse defaultActiveKey={['basic', 'general', 'transversal']}>
                {(['basic', 'general', 'transversal', 'specific'] as const).map((type) => (
                    <Collapse.Panel
                        key={type}
                        header={`COMPETENCIAS ${type.toUpperCase()}`}
                    >
                        <CompetencySection
                            competencies={competencies[type]}
                            searchText={searchText[type]}
                            newCompetency={newCompetency[type]}
                            onSearchChange={(val) => onSearchChange(type, val)}
                            onAddCompetency={() => onAddCompetency(type)}
                            onRemoveCompetency={(id) => onRemoveCompetency(type, id)}
                            onNewCompetencyChange={(field, val) => onNewCompetencyChange(type, field, val)}
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

export default CompetenciesStep;