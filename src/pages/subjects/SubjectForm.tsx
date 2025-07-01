import React, { useState, useEffect } from 'react';
import { Steps, Typography, Button, Form, message, notification } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import SkillSelectorTable from './formSteps/SkillSelectorTable';
import SubjectInformationForm from './formSteps/SubjectInformationForm';
import LearningOutcomesTable from './formSteps/LearningOutcomesTable';
import { useGetTileMemoryById } from '../../hooks/useTitleMemories';
import { useSubjectsCreate, useSubjectsUpdate, useGetSubjectById } from '../../hooks/useSubjects';
import { toast } from 'react-toastify';

const { Step } = Steps;
const { Title } = Typography;

export interface Skill {
    id: string;
    name: string;
    type: string;
    _id?: string;
    description?: string;
}

export interface LearningOutcome {
    outcome: string;
    skillId: string;
    skills_id: string[];
    _id?: string;
    description?: string;
    name?: string;
}

interface SubjectFormProps {
    mode: 'add' | 'edit';
}

const ordinales: Record<number, string> = {
    1: "Primero",
    2: "Segundo",
    3: "Tercero",
    4: "Cuarto",
    5: "Quinto",
    6: "Sexto",
};

const SubjectForm: React.FC<SubjectFormProps> = ({ mode = 'add' }) => {
    const { id: titleId, subjectId } = useParams<{ id: string; subjectId?: string }>();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
    const [learningOutcomes, setLearningOutcomes] = useState<LearningOutcome[]>([]);
    const [titleMemory, setTitleMemory] = useState<any>(null);
    const [skillsHours, setSkillsHours] = useState<{ [key: string]: number }>({});
    const [availableOutcomes, setAvailableOutcomes] = useState<LearningOutcome[]>([]);
    const { mutateAsync: getById } = useGetTileMemoryById();
    const { mutateAsync: getSubjectById } = useGetSubjectById(subjectId || '');
    const { mutateAsync: saveSubject } = useSubjectsCreate();
    const { mutateAsync: updateSubject } = useSubjectsUpdate();
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

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
        const data = await getById(memoryId);
        setTitleMemory(data);
        setAvailableSkills(data.skills || []);
        setAvailableOutcomes(data.learningOutcomes || []);
    };

    const getSubjectData = async (id: string) => {
        try {
            const subjectData = await getSubjectById(id);

            // Transformar datos de la asignatura al formato del formulario
            setGeneralInfo({
                subjectCode: subjectData.subject.code,
                subjectName: subjectData.subject.name,
                academicYear: ordinales[subjectData.subject.year] || '',
                temporality: subjectData.subject.duration || '',
                credits: subjectData.subject.credits,
                type: subjectData.subject.nature || '',
                materia: subjectData.subject.parentSubject || '',
                isKey: subjectData.subject.isKey || false,
                theoryHours: subjectData.subject.activities.theoryHours || 0,
                practiceHours: subjectData.subject.activities.practiceHours || 0,
                labHours: subjectData.subject.activities.labHours || 0,
                tutorialHours: subjectData.subject.activities.tutorialHours || 0
            });

            // Transformar skills y outcomes si existen
            if (subjectData.validSkills) {
                setSkills(subjectData.validSkills.map((skill: any) => ({
                    _id: skill._id,
                    name: skill.code || skill.name,
                    type: skill.type,
                    description: skill.description
                })));
            }

            if (subjectData.subject.skills) {
                setSkillsHours(subjectData.subject.skills);
            }

            if (subjectData.validLearningOutcomes) {
                setLearningOutcomes(subjectData.validLearningOutcomes.map((outcome: any) => ({
                    id: outcome._id,
                    name: outcome.name,
                    description: outcome.description,
                    skills_id: outcome.skills_id || [],
                    outcome: outcome.outcome || outcome.name
                })));
            }
        } catch (error) {
            console.error('Error fetching subject data:', error);
            api.error({
                message: 'Error al cargar la asignatura',
                description: 'No se pudo obtener la información de la asignatura.',
                duration: 3
            });
        }
    };

    useEffect(() => {
        if (titleId) {
            getTitleMemory(titleId);

            if (mode === 'edit' && subjectId) {
                getSubjectData(subjectId);
            }
        }
    }, [titleId, subjectId, mode]);

    const handleAddSkill = (id: string) => {
        const skill = availableSkills.find(s => s._id === id);
        if (!skill) return;
        if (skills.some(s => s.id === skill._id)) {
            toast.warning('Esta habilidad ya está añadida');
            return;
        }
        setSkills([...skills, skill]);
    };

    const handleRemoveSkill = (id: string) => {
        const newSkills = skills.filter(skill => skill._id !== id);
        setSkills(newSkills);

        const { [id]: _, ...updatedSkillsHours } = skillsHours;
        setSkillsHours(updatedSkillsHours);

        const selectedSkillIds = Object.keys(updatedSkillsHours);
        const filtered = availableOutcomes.filter((outcome: LearningOutcome) =>
            outcome.skills_id.every(skillId =>
                selectedSkillIds.includes(skillId)
            ));

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

        setLearningOutcomes(filtered);
    };

    const steps = [
        {
            title: 'Información General',
            content: <SubjectInformationForm
                generalInfo={generalInfo}
                setGeneralInfo={setGeneralInfo}
            />
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
                    skills={skills}
                />
            )
        }
    ];

    const next = () => {
        form.validateFields().then(() => setCurrentStep(prev => prev + 1));
    };

    const prev = () => setCurrentStep(prev => prev - 1);

    const onFinish = async () => {
        try {
            const subjectData = {
                generalInfo,
                skills,
                outcomes: learningOutcomes,
                skillHours: skillsHours,
                titleMemoryId: titleId
            };

            if (mode === 'add') {
                await saveSubject(subjectData);
                message.success('Asignatura creada exitosamente');
            } else if (mode === 'edit' && subjectId) {
                await updateSubject({ id: subjectId, ...subjectData });
                message.success('Asignatura actualizada exitosamente');
            }

        } catch (error) {
            console.error('Error saving subject:', error);
            api.error({
                message: 'Error al guardar',
                description: 'Ocurrió un error al guardar la asignatura',
                duration: 3
            });
        }
    };

    return (
        <div style={{ width: '80%', margin: '0 auto', padding: '24px 0' }}>
            {contextHolder}
            <Title level={2}>
                {mode === 'edit' ? 'Editar Asignatura' : 'Añadir nueva asignatura a Memoria de Título'}
            </Title>
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
                        <Button type="primary" onClick={e => {
                            e.preventDefault();
                            next();
                        }} htmlType='button'>Siguiente</Button>
                    ) : (
                        <Button type="primary" htmlType="submit">
                            {mode === 'edit' ? 'Actualizar Asignatura' : 'Guardar Asignatura'}
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default SubjectForm;