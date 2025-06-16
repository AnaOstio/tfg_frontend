import React, { useState, useEffect } from 'react';
import { Steps, Typography, Button, Form, message } from 'antd';
import { useParams } from 'react-router-dom';
import SkillSelectorTable from './formSteps/SkillSelectorTable';
import SubjectInformationForm from './formSteps/SubjectInformationForm';
import LearningOutcomesTable from './formSteps/LearningOutcomesTable';

const { Step } = Steps;
const { Title } = Typography;

export interface Skill {
    id: string;
    name: string;
    type: string;
}

export interface LearningOutcome {
    outcome: string;
    skillId: string;
}

const AddSubjectToMemory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
    const [learningOutcomes, setLearningOutcomes] = useState<LearningOutcome[]>([]);

    useEffect(() => {
        const fetchSkills = async () => {
            // Simulación
            const mock: Skill[] = [
                { id: 'SKL001', name: 'Habilidad técnica en desarrollo frontend', type: 'Técnica' },
                { id: 'SKL002', name: 'Gestión de proyectos ágiles', type: 'Gestión' },
                { id: 'SKL003', name: 'Comunicación efectiva en equipo', type: 'Blanda' },
            ];
            setAvailableSkills(mock);
        };
        fetchSkills();
    }, []);

    const handleAddSkill = (id: string) => {
        const skill = availableSkills.find(s => s.id === id);
        if (!skill) return;
        if (skills.some(s => s.id === skill.id)) {
            message.warning('Esta habilidad ya está añadida');
            return;
        }
        setSkills([...skills, skill]);
    };

    const handleRemoveSkill = (id: string) => {
        setSkills(skills.filter(skill => skill.id !== id));
    };

    const handleAddOutcome = () => {
        setLearningOutcomes([...learningOutcomes, { outcome: '', skillId: '' }]);
    };

    const handleRemoveOutcome = (index: number) => {
        const newOutcomes = [...learningOutcomes];
        newOutcomes.splice(index, 1);
        setLearningOutcomes(newOutcomes);
    };

    const getSkillsFromMemoryId = async (memoryId: string) => {
        // Simulación de llamada a la API para obtener habilidades
        const mockSkills: Skill[] = [
            { id: 'SKL001', name: 'Habilidad técnica en desarrollo frontend', type: 'Técnica' },
            { id: 'SKL002', name: 'Gestión de proyectos ágiles', type: 'Gestión' },
            { id: 'SKL003', name: 'Comunicación efectiva en equipo', type: 'Blanda' },
        ];
        setAvailableSkills(mockSkills);
    }

    const steps = [
        {
            title: 'Información General',
            content: <SubjectInformationForm />
        },
        {
            title: 'Competencias y Resultados',
            content: (
                <SkillSelectorTable
                    skills={skills}
                    availableSkills={availableSkills}
                    onAddSkill={handleAddSkill}
                    onRemoveSkill={handleRemoveSkill}
                />
            )
        },
        {
            title: 'Resultados de Aprendizaje',
            content: (
                <LearningOutcomesTable
                    outcomes={learningOutcomes}
                    onAddOutcome={handleAddOutcome}
                    onRemoveOutcome={handleRemoveOutcome}
                />
            )
        }
    ];

    const next = () => {
        form.validateFields().then(() => setCurrentStep(prev => prev + 1));
    };

    const prev = () => setCurrentStep(prev => prev - 1);

    const onFinish = (values: any) => {


        console.log('Memory ID:', id);
        console.log('Form:', values);
        console.log('Skills:', skills);
        console.log('Outcomes:', learningOutcomes);
    };

    return (
        <div style={{ width: '80%', margin: '0 auto', padding: '24px 0' }}>
            <Title level={2}>Añadir nueva asignatura a Memoria de Título</Title>
            <Steps current={currentStep} style={{ marginBottom: 24 }}>
                {steps.map(s => <Step key={s.title} title={s.title} />)}
            </Steps>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                {steps[currentStep].content}
                <div style={{ marginTop: 24, textAlign: 'right' }}>
                    {currentStep > 0 && (
                        <Button onClick={prev} style={{ marginRight: 8 }}>Atrás</Button>
                    )}
                    {currentStep < steps.length - 1 ? (
                        <Button type="primary" onClick={next}>Siguiente</Button>
                    ) : (
                        <Button type="primary" htmlType="submit">Guardar Asignatura</Button>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default AddSubjectToMemory;
