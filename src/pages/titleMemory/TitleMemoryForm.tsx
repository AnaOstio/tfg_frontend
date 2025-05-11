import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Steps, Form, notification } from 'antd';
import { AppDispatch, RootState } from '../../redux/store';
import {
    addCompetency, removeCompetency, saveTitleMemory,
    updateCredits, updateGeneralInfo
} from '../../redux/slices/titleMemorySlice';
import {
    fetchUniversities,
    selectUniversitiesData,
    selectUniversitiesLoading,
    selectUniversitiesError,
} from '../../redux/slices/universitiesSlice';
import { GeneralInfoStep } from './formSteps/GeneralInfoStep';
import { CompetenciesStep } from './formSteps/CompetenciesStep';
import { ReviewStep } from './formSteps/ReviewStep';

const { Step } = Steps;

export const TitleMemoryForm: React.FC = () => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);

    const dispatch = useDispatch<AppDispatch>();
    const titleMemory = useSelector((state: RootState) => state.titleMemory);
    const universitiesData = useSelector(selectUniversitiesData);
    const univLoading = useSelector(selectUniversitiesLoading);
    const univError = useSelector(selectUniversitiesError);

    // Estados para universidades y centros
    const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
    const [univSearchText, setUnivSearchText] = useState('');
    const [selectedCenters, setSelectedCenters] = useState<string[]>([]);
    const [centerSearchText, setCenterSearchText] = useState('');

    // Estados para competencias
    const [searchText, setSearchText] = useState({
        basic: '', general: '', transversal: '', specific: ''
    });
    const [newCompetency, setNewCompetency] = useState({
        basic: { code: '', description: '' },
        general: { code: '', description: '' },
        transversal: { code: '', description: '' },
        specific: { code: '', description: '' }
    });

    // Cargar universidades al montar el componente
    useEffect(() => {
        dispatch(fetchUniversities());
    }, [dispatch]);

    // Manejar errores de carga
    useEffect(() => {
        if (univError) {
            notification.error({
                message: 'Error cargando universidades',
                description: univError
            });
        }
    }, [univError]);

    // Inicializar valores del formulario
    useEffect(() => {
        if (titleMemory.generalInfo.university) {
            setSelectedUniversities(titleMemory.generalInfo.university.split(' / ').filter(Boolean));
        }
        if (titleMemory.generalInfo.centers) {
            setSelectedCenters(titleMemory.generalInfo.centers.split(' / ').filter(Boolean));
        }
    }, [titleMemory.generalInfo.university, titleMemory.generalInfo.centers]);

    // Filtrar universidades disponibles
    const availableUniversities = universitiesData
        .map(u => u.universidad)
        .filter(u => !selectedUniversities.includes(u))
        .filter(u => u.toLowerCase().includes(univSearchText.toLowerCase()));

    // Obtener centros disponibles según universidades seleccionadas
    const availableCenters = universitiesData
        .filter(u => selectedUniversities.includes(u.universidad))
        .flatMap(u => u.centros)
        .filter(c => !selectedCenters.includes(c))
        .filter(c => c.toLowerCase().includes(centerSearchText.toLowerCase()));

    // Manejar selección de universidades
    const handleUniversitySelect = (value: string) => {
        if (!selectedUniversities.includes(value)) {
            const updated = [...selectedUniversities, value];
            setSelectedUniversities(updated);
            updateUniversityField(updated);
        }
        setUnivSearchText('');
    };

    const removeUniversity = (university: string) => {
        const updated = selectedUniversities.filter(u => u !== university);
        setSelectedUniversities(updated);
        updateUniversityField(updated);

        // Eliminar centros asociados a la universidad eliminada
        const centersToRemove = universitiesData
            .find(u => u.universidad === university)?.centros || [];
        const updatedCenters = selectedCenters.filter(c => !centersToRemove.includes(c));
        setSelectedCenters(updatedCenters);
        updateCentersField(updatedCenters);
    };

    const updateUniversityField = (universities: string[]) => {
        const value = universities.join(' / ');
        form.setFieldsValue({
            generalInfo: { ...titleMemory.generalInfo, university: value }
        });
        dispatch(updateGeneralInfo({ university: value }));
    };

    // Manejar selección de centros
    const handleCenterSelect = (value: string) => {
        if (!selectedCenters.includes(value)) {
            const updated = [...selectedCenters, value];
            setSelectedCenters(updated);
            updateCentersField(updated);
        }
        setCenterSearchText('');
    };

    const removeCenter = (center: string) => {
        const updated = selectedCenters.filter(c => c !== center);
        setSelectedCenters(updated);
        updateCentersField(updated);
    };

    const updateCentersField = (centers: string[]) => {
        const value = centers.join(' / ');
        form.setFieldsValue({
            generalInfo: { ...titleMemory.generalInfo, centers: value }
        });
        dispatch(updateGeneralInfo({ centers: value }));
    };

    // Handlers de competencias
    const handleAddCompetency = (type: 'basic' | 'general' | 'transversal' | 'specific') => {
        const { code, description } = newCompetency[type];
        if (code.trim() && description.trim()) {
            dispatch(addCompetency({
                type,
                competency: { id: Date.now().toString(), code, description }
            }));
            setNewCompetency(prev => ({
                ...prev,
                [type]: { code: '', description: '' }
            }));
        }
    };

    const handleRemoveCompetency = (type: 'basic' | 'general' | 'transversal' | 'specific', id: string) => {
        dispatch(removeCompetency({ type, id }));
    };

    const handleSearchChange = (type: 'basic' | 'general' | 'transversal' | 'specific', value: string) => {
        setSearchText(prev => ({ ...prev, [type]: value }));
    };

    const handleNewCompetencyChange = (
        type: 'basic' | 'general' | 'transversal' | 'specific',
        field: 'code' | 'description',
        value: string
    ) => {
        setNewCompetency(prev => ({
            ...prev,
            [type]: { ...prev[type], [field]: value }
        }));
    };

    // Navegación
    const handleNext = () => {
        form.validateFields()
            .then(() => setCurrentStep(currentStep + 1))
            .catch(() => notification.error({
                message: 'Error de validación',
                description: 'Complete todos los campos requeridos.'
            }));
    };

    const handlePrev = () => setCurrentStep(currentStep - 1);

    const handleSubmit = () => {
        dispatch(saveTitleMemory(titleMemory));
        notification.success({
            message: 'Memoria guardada',
            description: 'Se ha guardado correctamente.'
        });
    };

    const steps = [
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
                <CompetenciesStep
                    competencies={titleMemory.competencies}
                    searchText={searchText}
                    newCompetency={newCompetency}
                    onSearchChange={handleSearchChange}
                    onAddCompetency={handleAddCompetency}
                    onRemoveCompetency={handleRemoveCompetency}
                    onNewCompetencyChange={handleNewCompetencyChange}
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
                />
            )
        }
    ];

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