import React from 'react';
import { Card, Button } from 'antd';
import { Skill } from '../../../utils/skill';

interface ReviewStepProps {
    titleMemory: any;
    onPrev: () => void;
    onSubmit: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
    titleMemory,
    onPrev,
    onSubmit
}) => (
    <Card title="Revisión de la Memoria de Título" style={{ marginBottom: 20 }}>
        <h3>Información General</h3>
        <p><strong>Nombre de la memoria:</strong> {titleMemory.generalInfo.memoryName}</p>
        <p><strong>Código del Título:</strong> {titleMemory.generalInfo.titleCode}</p>
        <p><strong>Centros:</strong> {titleMemory.generalInfo.centers}</p>
        <p><strong>Universidad:</strong> {titleMemory.generalInfo.university}</p>
        <p><strong>Nivel Académico:</strong> {titleMemory.generalInfo.academicLevel}</p>
        <p><strong>Rama Académica:</strong> {titleMemory.generalInfo.academicReign}</p>
        <p><strong>Año de Impartición:</strong> {titleMemory.generalInfo.year}</p>
        <p><strong>Ámbito Académico:</strong> {titleMemory.generalInfo.academicScope}</p>

        <h3>Distribución de Créditos</h3>
        <p><strong>Básicos:</strong> {titleMemory.credits.basic}</p>
        <p><strong>Obligatorios:</strong> {titleMemory.credits.mandatory}</p>
        <p><strong>Optativos:</strong> {titleMemory.credits.optional}</p>
        <p><strong>Prácticas:</strong> {titleMemory.credits.practices}</p>
        <p><strong>Trabajo Fin:</strong> {titleMemory.credits.finalWork}</p>

        <h3>Competencias</h3>

        {(['basic', 'general', 'transversal', 'specific'] as const).map(type => (
            <div key={type}>
                <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                <ul>
                    {titleMemory.skills?.[type]?.map((comp: Skill) => (
                        <li key={comp.id}>
                            <strong>{comp.name}:</strong> {comp.description}
                        </li>
                    ))}
                </ul>
            </div>
        ))}

        {titleMemory.learningOutcomes?.length > 0 && (
            <>
                <h3>Resultados de Aprendizaje</h3>
                <ul>
                    {titleMemory.learningOutcomes.map(outcome => (
                        <li key={outcome.id}>
                            <strong>{outcome.name}</strong>
                            {outcome.description && ` – ${outcome.description}`}
                            {outcome.associatedSkills?.length > 0 && (
                                <div style={{ marginLeft: 16 }}>
                                    <em>Competencias asociadas:</em>
                                    <ul>
                                        {outcome.associatedSkills.map(skillId => {
                                            const skill = Object.values(titleMemory.skills)
                                                .flat()
                                                .find(s => s.id === skillId);
                                            return (
                                                <li key={skillId}>
                                                    {skill ? `${skill.name}: ${skill.description}` : skillId}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </>
        )}

        <div style={{ marginTop: 24 }}>
            <Button onClick={onPrev} style={{ marginRight: 8 }}>Atrás</Button>
            <Button type="primary" onClick={onSubmit}>Guardar Memoria</Button>
        </div>
    </Card>
);
