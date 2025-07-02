import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Steps, Form, notification } from 'antd';
import { AppDispatch, RootState } from '../../redux/store';
import {
    addLearningOutcome,
    addOutcomeSkill,
    addSkill, loadFullTitleMemory, removeLearningOutcome, removeOutcomeSkill, removeSkill, saveTitleMemory,
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
import { useGetTileMemoryById, useTitleMemoriesCreate, useTitleMemoriesUpdate } from '../../hooks/useTitleMemories';
import { useParams } from 'react-router-dom';
import { TitleMemoryState } from '../../utils/titleMemory';
import { UsersStep, UserItem } from './formSteps/UsersStep';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

type SkillType = 'basic' | 'general' | 'transversal' | 'specific';
type SkillState = Record<SkillType, Skill | null>;
type SearchTextState = Record<SkillType, string>;
type NewSkillState = Record<SkillType, { name: string; description: string }>;

const { Step } = Steps;

type TitleMemoryFormProps = {
    mode: 'add' | 'edit' | 'clone';
};

export const TitleMemoryForm: React.FC<TitleMemoryFormProps> = ({ mode = 'add' }) => {
    const isEditMode = mode === 'edit';
    const isCloneMode = mode === 'clone';
    const [users, setUsers] = useState<UserItem[]>([]);
    const { id } = useParams<{ id: string }>();
    const { mutateAsync: getById } = useGetTileMemoryById();

    const [api, _] = notification.useNotification();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const dispatch = useDispatch<AppDispatch>();

    // Redux selectors
    const titleMemory = useSelector((state: RootState) => state.titleMemory);
    const universitiesData = useSelector(selectUniversitiesData);
    const univLoading = useSelector(selectUniversitiesLoading);
    const univError = useSelector(selectUniversitiesError);

    const currentUser = useSelector(selectCurrentUser);

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

    const fetchData = async (id: string) => {
        try {
            const data = await getById(id);
            const transformedData: TitleMemoryState = {
                generalInfo: {
                    titleCode: isCloneMode ? '' : data.titleCode,
                    memoryName: data.name,
                    academicLevel: data.academicLevel,
                    academicReign: data.branch,
                    year: data.yearDelivery,
                    academicScope: data.academicField,
                    university: data.universities,
                    centers: data.centers,
                },
                credits: {
                    basic: data.distributedCredits['Básicos'] || 0,
                    mandatory: data.distributedCredits['Obligatoria'] || 0,
                    optional: data.distributedCredits['Optativa'] || 0,
                    finalWork: data.distributedCredits['Trabajo Fin de Carrera'] || 0,
                    practices: 0 // si existe
                },
                skills: {
                    basic: data.skills.filter((item: any) => item.type === 'basic').map((item: any) => ({
                        id: item._id,
                        name: item.name,
                        description: item.description,
                        type: item.type
                    })),
                    general: data.skills.filter((item: any) => item.type === 'general').map((item: any) => ({
                        id: item._id,
                        name: item.name,
                        description: item.description,
                        type: item.type
                    })),
                    transversal: data.skills.filter((item: any) => item.type === 'transversal').map((item: any) => ({
                        id: item._id,
                        name: item.name,
                        description: item.description,
                        type: item.type
                    })),
                    specific: data.skills.filter((item: any) => item.type === 'specific').map((item: any) => ({
                        id: item._id,
                        name: item.name,
                        description: item.description,
                        type: item.type
                    }))
                },
                learningOutcomes: data.learningOutcomes.map((item: any) => ({
                    id: item._id,
                    name: item.name,
                    description: item.description || '',
                    associatedSkills: item.associatedSkills || []
                }))
            };
            dispatch(loadFullTitleMemory(transformedData));

            // Y también setear el form
            form.setFieldsValue(transformedData);

            setSelectedUniversities(data.universities);
            setSelectedCenters(data.centers);
            setCurrentStep(0); // Reset step to 0 when loading new data
        } catch (error) {
            console.error('Error fetching title memory:', error);
            api.error({
                message: 'Error al cargar la memoria de título',
                description: 'No se pudo obtener la información de la memoria de título.',
                duration: 3
            });
        }
    }

    useEffect(() => {
        if (id && (isEditMode || isCloneMode)) {
            fetchData(id);
        }
    }, [id, isEditMode, isCloneMode]);

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
        if (titleMemory.generalInfo?.university && !isEditMode && !isCloneMode) {
            setSelectedUniversities(titleMemory.generalInfo.university.split(' / ').filter(Boolean));
        }
        if (titleMemory.generalInfo?.centers && !isEditMode && !isCloneMode) {
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
            toast.warning('Campos incompletos,Por favor complete tanto el código como la descripción');
            return;
        }

        // Verificar si la skill ya existe (comparando código y descripción)
        const skillExists = titleMemory.skills?.[type]?.some(skill =>
            skill.name.toLowerCase() === name.toLowerCase() ||
            skill.description.toLowerCase() === description.toLowerCase()
        );

        if (skillExists) {
            toast.error('Esta competencia ya está añadida en la lista');
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
    const { mutateAsync: updateMemoryMutate } = useTitleMemoriesUpdate();

    const handleSubmit = useCallback(() => {
        if (mode === 'edit') {
            updateMemoryMutate({ id: id, ...titleMemory })
        } else {
            dispatch(saveTitleMemory(titleMemory));
            saveTitleMemoryMutate({ data: titleMemory, users: users, currentUser: currentUser });
        }

    }, [dispatch, titleMemory, users]);

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
        setNewOutcomeDescription(item.description);
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
                id: selectedOutcomeItem._id,
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

    /*** Aquí incluimos el nuevo paso “Usuarios” ***/
    const handleUsersChange = useCallback((newList: UserItem[]) => {
        setUsers(newList);
    }, []);

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
            title: 'Usuarios',
            content: (
                <UsersStep
                    users={users}
                    onUsersChange={handleUsersChange}
                    onPrev={handlePrev}
                    onNext={handleNext}
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
                    mode={mode} // 'add', 'edit' or 'clone'
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
        newOutcomeText, selectedOutcomeItem, users, handleUsersChange
    ]);

    return (
        <div style={{ width: '80%', margin: '0 auto', padding: '24px 0' }}>
            <h1>{isEditMode
                ? 'Editar memoria de título'
                : isCloneMode
                    ? 'Clonar memoria de título'
                    : 'Añadir nueva memoria de título'}</h1>

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