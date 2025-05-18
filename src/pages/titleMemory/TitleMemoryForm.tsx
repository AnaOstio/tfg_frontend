import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Steps, Form, notification } from 'antd';
import { AppDispatch, RootState } from '../../redux/store';
import {
    addLearningOutcome,
    addOutcomeSkill,
    addSkill, removeLearningOutcome, removeOutcomeSkill, removeSkill, saveTitleMemory,
    updateCredits, updateGeneralInfo
} from '../../redux/slices/titleMemorySlice';
import {
    selectUniversitiesData,
    selectUniversitiesLoading,
    selectUniversitiesError,
} from '../../redux/slices/universitiesSlice';
import { GeneralInfoStep } from './formSteps/GeneralInfoStep';
import { SkillsStep } from './formSteps/SkillsStep';
import { ReviewStep } from './formSteps/ReviewStep';
import { Skill } from '../../utils/skill';
import { LearningOutcomesStep } from './formSteps/LearningOutcomesStep';
import { LearningOutcome } from './types';
import { useLearningOutcomesSearch } from '../../hooks/useLearningOucomes';
import { useTitleMemoriesCreate } from '../../hooks/useTitleMemories';

type SkillType = 'basic' | 'general' | 'transversal' | 'specific';
type SkillState = Record<SkillType, Skill | null>;
type SearchTextState = Record<SkillType, string>;
type NewSkillState = Record<SkillType, { name: string; description: string }>;

const { Step } = Steps;

export const TitleMemoryForm: React.FC = () => {
    const [api, _] = notification.useNotification();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const dispatch = useDispatch<AppDispatch>();

    // Redux selectors
    const titleMemory = useSelector((state: RootState) => state.titleMemory);
    const universitiesData = useSelector(selectUniversitiesData);
    const univLoading = useSelector(selectUniversitiesLoading);
    const univError = useSelector(selectUniversitiesError);

    // State management
    const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
    const [univSearchText, setUnivSearchText] = useState('');
    const [selectedCenters, setSelectedCenters] = useState<string[]>([]);
    const [centerSearchText, setCenterSearchText] = useState('');
    const [selectedSkill, setSelectedSkill] = useState<SkillState>({
        basic: null, general: null, transversal: null, specific: null
    });
    const [searchText, setSearchText] = useState<SearchTextState>({
        basic: '', general: '', transversal: '', specific: ''
    });
    const [newSkill, setNewSkill] = useState<NewSkillState>({
        basic: { name: '', description: '' },
        general: { name: '', description: '' },
        transversal: { name: '', description: '' },
        specific: { name: '', description: '' }
    });

    const [newOutcomeDescription, setNewOutcomeDescription] = useState('');

    // Initialize skills structure if not exists
    useEffect(() => {
        if (!titleMemory.skills) {
            dispatch(updateGeneralInfo({
                skills: {
                    basic: [],
                    general: [],
                    transversal: [],
                    specific: []
                }
            }));
        }
    }, [dispatch, titleMemory.skills]);

    // Memoized derived data
    const availableUniversities = useMemo(() => (
        universitiesData
            ?.map(u => u.universidad)
            ?.filter(u => !selectedUniversities.includes(u))
            ?.filter(u => u.toLowerCase().includes(univSearchText.toLowerCase())) || []
    ), [universitiesData, selectedUniversities, univSearchText]);

    const availableCenters = useMemo(() => (
        universitiesData
            ?.filter(u => selectedUniversities.includes(u.universidad))
            ?.flatMap(u => u.centros)
            ?.filter(c => !selectedCenters.includes(c))
            ?.filter(c => c.toLowerCase().includes(centerSearchText.toLowerCase())) || []
    ), [universitiesData, selectedUniversities, selectedCenters, centerSearchText]);

    // Effect hooks
    useEffect(() => {
        if (univError) {
            api.error({
                message: 'Error cargando universidades',
                description: univError,
                duration: 3
            });
        }
    }, [univError]);

    useEffect(() => {
        if (titleMemory.generalInfo?.university) {
            setSelectedUniversities(titleMemory.generalInfo.university.split(' / ').filter(Boolean));
        }
        if (titleMemory.generalInfo?.centers) {
            setSelectedCenters(titleMemory.generalInfo.centers.split(' / ').filter(Boolean));
        }
    }, [titleMemory.generalInfo?.university, titleMemory.generalInfo?.centers]);

    // Handlers
    const updateUniversityField = useCallback((universities: string[]) => {
        const value = universities.join(' / ');
        form.setFieldsValue({
            generalInfo: { ...titleMemory.generalInfo, university: value }
        });
        dispatch(updateGeneralInfo({ university: value }));
    }, [dispatch, form, titleMemory.generalInfo]);

    const updateCentersField = useCallback((centers: string[]) => {
        const value = centers.join(' / ');
        form.setFieldsValue({
            generalInfo: { ...titleMemory.generalInfo, centers: value }
        });
        dispatch(updateGeneralInfo({ centers: value }));
    }, [dispatch, form, titleMemory.generalInfo]);

    const handleUniversitySelect = useCallback((value: string) => {
        if (!selectedUniversities.includes(value)) {
            const updated = [...selectedUniversities, value];
            setSelectedUniversities(updated);
            updateUniversityField(updated);
        }
        setUnivSearchText('');
    }, [selectedUniversities, updateUniversityField]);

    const removeUniversity = useCallback((university: string) => {
        const updated = selectedUniversities.filter(u => u !== university);
        setSelectedUniversities(updated);
        updateUniversityField(updated);

        const centersToRemove = universitiesData
            ?.find(u => u.universidad === university)?.centros || [];
        const updatedCenters = selectedCenters.filter(c => !centersToRemove.includes(c));
        setSelectedCenters(updatedCenters);
        updateCentersField(updatedCenters);
    }, [selectedUniversities, selectedCenters, universitiesData, updateUniversityField, updateCentersField]);

    const handleCenterSelect = useCallback((value: string) => {
        if (!selectedCenters.includes(value)) {
            const updated = [...selectedCenters, value];
            setSelectedCenters(updated);
            updateCentersField(updated);
        }
        setCenterSearchText('');
    }, [selectedCenters, updateCentersField]);

    const removeCenter = useCallback((center: string) => {
        const updated = selectedCenters.filter(c => c !== center);
        setSelectedCenters(updated);
        updateCentersField(updated);
    }, [selectedCenters, updateCentersField]);

    const handleAddSkill = useCallback((type: SkillType) => {
        const { name, description } = newSkill[type];

        // Validar campos no vacíos
        if (!name.trim() || !description.trim()) {
            api.warning({
                message: 'Campos incompletos',
                description: 'Por favor complete tanto el código como la descripción'
            });
            return;
        }

        // Verificar si la skill ya existe (comparando código y descripción)
        const skillExists = titleMemory.skills?.[type]?.some(skill =>
            skill.name.toLowerCase() === name.toLowerCase() ||
            skill.description.toLowerCase() === description.toLowerCase()
        );

        if (skillExists) {
            api.error({
                message: 'Competencia duplicada',
                description: 'Esta competencia ya está añadida en la lista'
            });
            return;
        }

        // Añadir la nueva skill si no existe
        const selected = selectedSkill[type];
        const skillId = selected?._id || `${type}-${Date.now()}`;

        dispatch(addSkill({
            type,
            skill: {
                id: skillId,
                name,
                description,
                type
            }
        }));

        // Resetear formulario
        setNewSkill(prev => ({
            ...prev,
            [type]: { name: '', description: '' }
        }));
        setSelectedSkill(prev => ({
            ...prev,
            [type]: null
        }));
        setSearchText(prev => ({
            ...prev,
            [type]: ''
        }));

    }, [dispatch, newSkill, titleMemory.skills]);

    const handleRemoveSkill = useCallback((type: SkillType, id: string) => {
        dispatch(removeSkill({ type, id }));
    }, [dispatch]);

    const handleSearchChange = useCallback((type: SkillType, skill: Skill) => {
        setSelectedSkill(prev => ({ ...prev, [type]: skill }));
        setNewSkill(prev => ({
            ...prev,
            [type]: { name: skill.name, description: skill.description }
        }));
        setSearchText(prev => ({
            ...prev,
            [type]: `${skill.name} - ${skill.description}`
        }));
    }, []);

    const handleSearchTextChange = useCallback((type: SkillType, value: string) => {
        setSearchText(prev => ({ ...prev, [type]: value }));
    }, []);

    const handleNewSkillChange = useCallback((
        type: SkillType,
        field: 'name' | 'description',
        value: string
    ) => {
        setNewSkill(prev => ({
            ...prev,
            [type]: { ...prev[type], [field]: value }
        }));
    }, []);

    const handleNext = useCallback(() => {
        form.validateFields()
            .then(() => setCurrentStep(prev => prev + 1))
            .catch(() => api.error({
                message: 'Error de validación',
                description: 'Complete todos los campos requeridos.'
            }));
    }, [form]);

    const handlePrev = useCallback(() => {
        setCurrentStep(prev => prev - 1);
    }, []);

    const { mutateAsync: saveTitleMemoryMutate } = useTitleMemoriesCreate();

    const handleSubmit = useCallback(() => {
        dispatch(saveTitleMemory(titleMemory));
        api.success({
            message: 'Memoria guardada',
            description: 'Se ha guardado correctamente.'
        });
        saveTitleMemoryMutate(titleMemory);
    }, [dispatch, titleMemory]);

    const learningOutcomes = useSelector((state: RootState) => state.titleMemory.learningOutcomes);
    const [newOutcomeText, setNewOutcomeText] = useState('');
    const [selectedOutcomeItem, setSelectedOutcomeItem] = useState<{ id: string; name: string; description: string } | null>(null);

    const handleOutcomeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewOutcomeText(e.target.value);
    }, []);


    const { mutateAsync: searchOucomesMutate } = useLearningOutcomesSearch();

    const fetchOutcomes = async (search: string, page: number) => {
        const res = await searchOucomesMutate({ search, page });
        return {
            data: res.data,
            hasMore: res.hasMore,
        };
    };

    const onOutcomeSelected = useCallback((item: { id: string; name: string; description: string }) => {
        setSelectedOutcomeItem(item);
        setNewOutcomeText(item.name);
    }, []);

    const onOutcomeInputChange = useCallback((val: string) => {
        setNewOutcomeText(val);
        setNewOutcomeDescription(''); // limpiar si se escribe algo nuevo
        setSelectedOutcomeItem(null);
    }, []);

    const onDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewOutcomeDescription(e.target.value);
    }, []);

    const handleAddOutcome = useCallback(() => {
        if (!newOutcomeText.trim()) {
            api.warning({
                message: 'Campo vacío',
                description: 'Por favor ingrese un learning outcome'
            });
            return;
        }

        let newItem: LearningOutcome;

        if (selectedOutcomeItem) {
            newItem = {
                id: selectedOutcomeItem.id,
                name: selectedOutcomeItem.name,
                description: selectedOutcomeItem.description || '',
                associatedSkills: []
            };
        } else {
            newItem = {
                id: `lo-${Date.now()}`,
                name: newOutcomeText,
                description: newOutcomeDescription,
                associatedSkills: []
            };
        }

        dispatch(addLearningOutcome({ outcome: newItem }));
        setNewOutcomeText('');
        setNewOutcomeDescription('');
        setSelectedOutcomeItem(null);
    }, [newOutcomeText, newOutcomeDescription, selectedOutcomeItem, dispatch]);



    const handleRemoveOutcome = useCallback((id: string) => {
        dispatch(removeLearningOutcome({ id }));
    }, [dispatch]);

    const handleSkillRelationChange = useCallback(
        (outcomeId: string, skillIds: string[]) => {
            const currentOutcome = learningOutcomes.find(o => o.id === outcomeId);
            if (currentOutcome) {
                currentOutcome.associatedSkills?.forEach(skillCode => {
                    dispatch(removeOutcomeSkill({ outcomeId, skillCode }));
                });
            }

            skillIds.forEach(skillCode => {
                dispatch(addOutcomeSkill({ outcomeId, skillCode }));
            });
        },
        [dispatch, learningOutcomes]
    );

    const steps = useMemo(() => [
        {
            title: 'Información General',
            content: (
                <GeneralInfoStep
                    universities={availableUniversities}
                    selectedUniversities={selectedUniversities}
                    centers={availableCenters}
                    selectedCenters={selectedCenters}
                    loading={univLoading}
                    onUniversitySelect={handleUniversitySelect}
                    onUniversityRemove={removeUniversity}
                    onCenterSelect={handleCenterSelect}
                    onCenterRemove={removeCenter}
                    onNext={handleNext}
                />
            )
        },
        {
            title: 'Competencias',
            content: (
                <SkillsStep
                    skills={titleMemory.skills || {
                        basic: [],
                        general: [],
                        transversal: [],
                        specific: []
                    }}
                    selectedSkill={selectedSkill}
                    searchTexts={searchText}
                    newSkills={newSkill}
                    onSelectSkill={handleSearchChange}
                    onSearchTextChange={handleSearchTextChange}
                    onAddSkill={handleAddSkill}
                    onRemoveSkill={handleRemoveSkill}
                    onNewSkillChange={handleNewSkillChange}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            )
        },
        {
            title: 'Resultados de Aprendizaje',
            content: (
                <LearningOutcomesStep
                    learningOutcomes={learningOutcomes}
                    skills={titleMemory.skills || {
                        basic: [],
                        general: [],
                        transversal: [],
                        specific: []
                    }}
                    onAddOutcome={handleAddOutcome}
                    onRemoveOutcome={handleRemoveOutcome}
                    onOutcomeInputChange={onOutcomeInputChange}
                    onOutcomeSelected={onOutcomeSelected}
                    onSkillRelationChange={handleSkillRelationChange}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    fetchOutcomes={fetchOutcomes}
                    selectedItem={selectedOutcomeItem}
                    newOutcomeText={newOutcomeText}
                    newOutcomeDescription={newOutcomeDescription}
                    onOutcomeChange={handleOutcomeChange}
                    onDescriptionChange={onDescriptionChange}
                />
            )
        },
        {
            title: 'Revisión',
            content: (
                <ReviewStep
                    titleMemory={titleMemory}
                    onPrev={handlePrev}
                    onSubmit={handleSubmit}
                />
            )
        }
    ], [
        availableUniversities, availableCenters, univLoading,
        selectedUniversities, selectedCenters, titleMemory,
        selectedSkill, searchText, newSkill, learningOutcomes,
        handleUniversitySelect, removeUniversity, handleCenterSelect,
        removeCenter, handleSearchChange, handleSearchTextChange,
        handleAddSkill, handleRemoveSkill, handleNewSkillChange,
        handlePrev, handleNext, handleSubmit, handleAddOutcome,
        handleRemoveOutcome, handleSkillRelationChange,
        onOutcomeInputChange, onOutcomeSelected,
        newOutcomeText, selectedOutcomeItem
    ]);

    return (
        <div style={{ width: '80%', margin: '0 auto', padding: '24px 0' }}>
            <h1>Añadir nueva memoria de título</h1>

            <Steps current={currentStep} style={{ marginBottom: 24 }}>
                {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>

            <Form
                form={form}
                layout="vertical"
                initialValues={titleMemory}
                onValuesChange={(changed) => {
                    if (changed.generalInfo) dispatch(updateGeneralInfo(changed.generalInfo));
                    if (changed.credits) dispatch(updateCredits(changed.credits));
                }}
            >
                <div>{steps[currentStep].content}</div>
            </Form>
        </div>
    );
};

export default TitleMemoryForm;