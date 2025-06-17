import React, { useState, useEffect } from 'react';
import { Steps, Typography, Button, Form, message } from 'antd';
import { useParams } from 'react-router-dom';
import SkillSelectorTable from './formSteps/SkillSelectorTable';
import SubjectInformationForm from './formSteps/SubjectInformationForm';
import LearningOutcomesTable from './formSteps/LearningOutcomesTable';
import { useGetTileMemoryById } from '../../hooks/useTitleMemories';

const { Step } = Steps;
const { Title } = Typography;

export interface Skill {
    id: string;
    name: string;
    type: string;
    _id?: string; // Optional for compatibility with existing data
    description?: string; // Optional for compatibility with existing data
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
    const [_, setTitleMemory] = useState<any>(null);
    const [skillsHours, setSkillsHours] = useState<{ [key: string]: number }>({});
    const { mutateAsync: getBtId } = useGetTileMemoryById();

    const getTitleMemory = async (memoryId: string) => {
        const data = await getBtId(memoryId);
        setTitleMemory(data);
        setAvailableSkills(data.skills || []);
    }

    useEffect(() => {
        if (id) {
            getTitleMemory(id);
        }
    }, []);

    const handleAddSkill = (id: string) => {
        const skill = availableSkills.find(s => s._id === id);
        if (!skill) return;
        if (skills.some(s => s.id === skill._id)) {
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

    const handleHourSkillChange = (skillId: string, hours: number) => {

        setSkillsHours({
            ...skillsHours,
            [skillId]: hours
        });
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
                    onSkillsHoursChange={handleHourSkillChange}
                    onAddSkill={handleAddSkill}
                    onRemoveSkill={handleRemoveSkill}
                    skillsHours={skillsHours}
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
        console.log('Skills Hours:', skillsHours);
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
