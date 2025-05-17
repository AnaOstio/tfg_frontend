import React from 'react';
import { Card, Button } from 'antd';

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
        <h4>Básicas</h4>
        <ul>
            {titleMemory.competencies.basic.map((comp: any) => (
                <li key={comp.id}><strong>{comp.name}:</strong> {comp.description}</li>
            ))}
        </ul>

        <h4>Generales</h4>
        <ul>
            {titleMemory.competencies.general.map((comp: any) => (
                <li key={comp.id}><strong>{comp.name}:</strong> {comp.description}</li>
            ))}
        </ul>

        <h4>Transversales</h4>
        <ul>
            {titleMemory.competencies.transversal.map((comp: any) => (
                <li key={comp.id}><strong>{comp.name}:</strong> {comp.description}</li>
            ))}
        </ul>

        <div style={{ marginTop: 24 }}>
            <Button onClick={onPrev} style={{ marginRight: 8 }}>Atrás</Button>
            <Button type="primary" onClick={onSubmit}>Guardar Memoria</Button>
        </div>
    </Card>
);