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
    skills_id: string[];
    _id?: string; // Optional for compatibility with existing data
    description?: string; // Optional for compatibility with existing data
    name?: string; // Optional for compatibility with existing data
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
    const [availableOutcomes, setAvailableOutcomes] = useState([]);

    const [generalInfo, setGeneralInfo] = useState({
        subjectCode: '',
        subjectName: '',
        academicYear: '',
        temporality: '',
        credits: 0,
        type: '',
        materia: '',
        isKey: false,
        theoryHours: 0,
        practiceHours: 0,
        labHours: 0,
        tutorialHours: 0
    });

    const getTitleMemory = async (memoryId: string) => {
        const data = await getBtId(memoryId);
        setTitleMemory(data);
        setAvailableSkills(data.skills || []);
        setAvailableOutcomes(data.learningOutcomes || []);
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
        const newSkills = skills.filter(skill => skill.id !== id);
        setSkills(newSkills);

        const { [id]: _, ...updatedSkillsHours } = skillsHours;
        setSkillsHours(updatedSkillsHours);

        const selectedSkillIds = Object.keys(updatedSkillsHours);
        const filtered = availableOutcomes.filter((outcome: LearningOutcome) =>
            outcome.skills_id.every(skillId =>
                selectedSkillIds.includes(skillId)
            )
        );

        setLearningOutcomes(filtered);
    };

    const handleHourSkillChange = (skillId: string, hours: number) => {

        const newSkillsHours = {
            ...skillsHours,
            [skillId]: hours
        };
        setSkillsHours(newSkillsHours);

        const filtered = availableOutcomes.filter((outcome: LearningOutcome) =>
            outcome.skills_id.every(id => Object.keys(newSkillsHours).includes(id))
        );

        setLearningOutcomes(filtered)
    }


    const steps = [
        {
            title: 'Información General',
            content: <SubjectInformationForm generalInfo={generalInfo} setGeneralInfo={setGeneralInfo} />
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
                />
            )
        }
    ];

    const next = () => {
        form.validateFields().then(() => setCurrentStep(prev => prev + 1));
    };

    const prev = () => setCurrentStep(prev => prev - 1);

    const onFinish = (values: any) => {

        for (const key in values) {
            if (values[key] === undefined || values[key] === null) {
                values[key] = '';
            }
        }

        console.log('General Info:', generalInfo);

        console.log('Form values:', values);
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
                        <Button type="primary" htmlType="submit" onClick={onFinish}>Guardar Asignatura</Button>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default AddSubjectToMemory;
