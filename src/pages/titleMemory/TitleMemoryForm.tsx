import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Form, Input, Select, Button, Steps, Card, Collapse,
    Row, Col, Divider, notification, Tag, List
} from 'antd';
import {
    PlusOutlined, DeleteOutlined, CloseOutlined, SearchOutlined
} from '@ant-design/icons';
import { AppDispatch, RootState } from '../../redux/store';
import { Competency } from '../../utils/titleMemory';
import {
    addCompetency, removeCompetency, saveTitleMemory,
    updateCredits, updateGeneralInfo
} from '../../redux/slices/titleMemorySlice';
import {
    fetchUniversities,
    selectUniversitiesData,
    selectUniversitiesLoading,
    selectUniversitiesError,
    UniversityData
} from '../../redux/slices/universitiesSlice';
import {
    ACADEMIC_FIELDS, ACADEMIC_BRANCHES, ACADEMIC_LEVEL
} from '../../utils/const';

const { Step } = Steps;
const { Panel } = Collapse;
const { Option } = Select;

type CompetencyType = 'basic' | 'general' | 'transversal' | 'specific';

const TitleMemoryForm: React.FC = () => {
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

    // Resto de handlers de competencias...
    const filterCompetencies = (type: CompetencyType) => {
        const term = searchText[type].toLowerCase();
        if (!term) return titleMemory.competencies[type];
        return titleMemory.competencies[type].filter(c =>
            c.code.toLowerCase().includes(term) ||
            c.description.toLowerCase().includes(term)
        );
    };

    const handleAddCompetency = (type: CompetencyType) => {
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

    const handleRemoveCompetency = (type: CompetencyType, id: string) => {
        dispatch(removeCompetency({ type, id }));
    };

    const handleSearchChange = (type: CompetencyType, value: string) => {
        setSearchText(prev => ({ ...prev, [type]: value }));
    };

    const handleNewCompetencyChange = (
        type: CompetencyType,
        field: 'code' | 'description',
        value: string
    ) => {
        setNewCompetency(prev => ({
            ...prev,
            [type]: { ...prev[type], [field]: value }
        }));
    };

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

    const renderCompetencySection = (type: CompetencyType, title: string) => (
        <Panel header={title} key={type}>
            <div style={{ marginBottom: 16 }}>
                <Row gutter={8}>
                    <Col span={18}>
                        <Input
                            placeholder={`Buscar ${title.toLowerCase()}...`}
                            value={searchText[type]}
                            onChange={e => handleSearchChange(type, e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col span={6}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddCompetency(type)}
                            block
                        >
                            Añadir
                        </Button>
                    </Col>
                </Row>
            </div>

            <div
                style={{
                    marginBottom: 16,
                    padding: 16,
                    border: '1px dashed #d9d9d9',
                    borderRadius: 4
                }}
            >
                <Row gutter={8} align="middle">
                    <Col span={10}>
                        <Input
                            placeholder="Código"
                            value={newCompetency[type].code}
                            onChange={e =>
                                handleNewCompetencyChange(type, 'code', e.target.value)
                            }
                        />
                    </Col>
                    <Col span={12}>
                        <Input
                            placeholder="Descripción"
                            value={newCompetency[type].description}
                            onChange={e =>
                                handleNewCompetencyChange(type, 'description', e.target.value)
                            }
                        />
                    </Col>
                    <Col span={2}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddCompetency(type)}
                            disabled={
                                !newCompetency[type].code.trim() ||
                                !newCompetency[type].description.trim()
                            }
                        />
                    </Col>
                </Row>
            </div>

            <List
                dataSource={filterCompetencies(type)}
                renderItem={(comp: Competency) => (
                    <List.Item
                        actions={[
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveCompetency(type, comp.id)}
                            />
                        ]}
                    >
                        <List.Item.Meta
                            title={<strong>{comp.code}</strong>}
                            description={comp.description}
                        />
                    </List.Item>
                )}
            />
        </Panel>
    );

    const steps = [
        {
            title: 'Información General',
            content: (
                <Card title="Información General" style={{ marginBottom: 20 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Código del Título"
                                name={['generalInfo', 'titleCode']}
                                rules={[{ required: true, message: 'Ingrese el código del título' }]}
                            >
                                <Input placeholder="Ej: G1234" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Nombre de la memoria"
                                name={['generalInfo', 'memoryName']}
                                rules={[{ required: true, message: 'Ingrese el nombre de la memoria' }]}
                            >
                                <Input placeholder="Ej: Memoria de Ingeniería Informática 2023" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Selector de Universidades - NUEVA IMPLEMENTACIÓN */}
                    <Form.Item
                        label="Universidad"
                        required
                        help={selectedUniversities.length === 0 ? 'Seleccione al menos una universidad' : null}
                        validateStatus={selectedUniversities.length === 0 ? 'error' : ''}
                    >
                        <div>
                            <Select
                                showSearch
                                placeholder="Buscar universidad..."
                                style={{ width: '100%' }}
                                value={null}
                                onChange={handleUniversitySelect}
                                onSearch={setUnivSearchText}
                                filterOption={false}
                                notFoundContent={univLoading ? "Cargando..." : "No se encontraron universidades"}
                                disabled={univLoading}
                            >
                                {availableUniversities.map(univ => (
                                    <Option key={univ} value={univ}>{univ}</Option>
                                ))}
                            </Select>
                            <div style={{ marginTop: 8 }}>
                                {selectedUniversities.map(univ => (
                                    <Tag
                                        key={univ}
                                        closable
                                        onClose={() => removeUniversity(univ)}
                                        closeIcon={<CloseOutlined />}
                                        style={{ marginBottom: 4 }}
                                    >
                                        {univ}
                                    </Tag>
                                ))}
                            </div>
                            <input
                                type="hidden"
                                name={['generalInfo', 'university']}
                                value={selectedUniversities.join(' / ')}
                            />
                        </div>
                    </Form.Item>

                    {/* Selector de Centros - NUEVA IMPLEMENTACIÓN */}
                    <Form.Item
                        label="Centros"
                        required
                        help={selectedCenters.length === 0 ? 'Seleccione al menos un centro' : null}
                        validateStatus={selectedCenters.length === 0 ? 'error' : ''}
                    >
                        <div>
                            <Select
                                showSearch
                                placeholder={
                                    selectedUniversities.length === 0
                                        ? 'Seleccione universidades primero'
                                        : 'Buscar centro...'
                                }
                                style={{ width: '100%' }}
                                value={null}
                                onChange={handleCenterSelect}
                                onSearch={setCenterSearchText}
                                filterOption={false}
                                disabled={selectedUniversities.length === 0}
                                notFoundContent="No se encontraron centros"
                            >
                                {availableCenters.map(center => (
                                    <Option key={center} value={center}>{center}</Option>
                                ))}
                            </Select>
                            <div style={{ marginTop: 8 }}>
                                {selectedCenters.map(center => (
                                    <Tag
                                        key={center}
                                        closable
                                        onClose={() => removeCenter(center)}
                                        closeIcon={<CloseOutlined />}
                                        style={{ marginBottom: 4 }}
                                    >
                                        {center}
                                    </Tag>
                                ))}
                            </div>
                            <input
                                type="hidden"
                                name={['generalInfo', 'centers']}
                                value={selectedCenters.join(' / ')}
                            />
                        </div>
                    </Form.Item>

                    {/* Resto de campos... */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Nivel Académico"
                                name={['generalInfo', 'academicLevel']}
                                rules={[{ required: true, message: 'Seleccione nivel académico' }]}
                            >
                                <Select placeholder="Seleccione una opción">
                                    {ACADEMIC_LEVEL.map(l => (
                                        <Option key={l} value={l}>{l}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Rama Académica"
                                name={['generalInfo', 'academicReign']}
                                rules={[{ required: true, message: 'Seleccione rama académica' }]}
                            >
                                <Select placeholder="Seleccione una opción">
                                    {ACADEMIC_BRANCHES.map(b => (
                                        <Option key={b} value={b}>{b}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Año de Impartición"
                                name={['generalInfo', 'year']}
                                rules={[{ required: true, message: 'Ingrese el año' }]}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Ámbito Académico"
                        name={['generalInfo', 'academicScope']}
                        rules={[{ required: true, message: 'Seleccione un ámbito' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Buscar ámbito académico..."
                            optionFilterProp="children"
                            onChange={(v) => dispatch(updateGeneralInfo({ academicScope: v }))}
                            filterOption={(input, option) =>
                                (option?.children as string)
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                        >
                            {ACADEMIC_FIELDS.map(f => (
                                <Option key={f} value={f}>{f}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Divider orientation="left">Distribución de Créditos</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Básicos" name={['credits', 'basic']}>
                                <Input type="number" min={0} />
                            </Form.Item>
                            <Form.Item label="Obligatorios" name={['credits', 'mandatory']}>
                                <Input type="number" min={0} />
                            </Form.Item>
                            <Form.Item label="Optativos" name={['credits', 'optional']}>
                                <Input type="number" min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Prácticas" name={['credits', 'practices']}>
                                <Input type="number" min={0} />
                            </Form.Item>
                            <Form.Item label="Trabajo Fin" name={['credits', 'finalWork']}>
                                <Input type="number" min={0} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ marginTop: 24, textAlign: 'right' }}>
                        <Button type="primary" onClick={handleNext}>
                            Siguiente
                        </Button>
                    </div>
                </Card>
            )
        },
        {
            title: 'Competencias',
            content: (
                <Card title="Competencias" style={{ marginBottom: 20 }}>
                    <Collapse defaultActiveKey={['basic', 'general', 'transversal']}>
                        {renderCompetencySection('basic', 'COMPETENCIAS BÁSICAS')}
                        {renderCompetencySection('general', 'COMPETENCIAS GENERALES')}
                        {renderCompetencySection('transversal', 'COMPETENCIAS TRANSVERSALES')}
                        {renderCompetencySection('specific', 'COMPETENCIAS ESPECÍFICAS')}
                    </Collapse>
                    <div style={{ marginTop: 24, textAlign: 'right' }}>
                        <Button onClick={handlePrev} style={{ marginRight: 8 }}>Atrás</Button>
                        <Button type="primary" onClick={handleNext}>Confirmar</Button>
                    </div>
                </Card>
            )
        },
        {
            title: 'Revisión',
            content: (
                <Card title="Revisión de la Memoria de Título" style={{ marginBottom: 20 }}>
                    {/* ... muestra todos los datos para revisión ... */}
                    <div style={{ marginTop: 24 }}>
                        <Button onClick={handlePrev} style={{ marginRight: 8 }}>Atrás</Button>
                        <Button type="primary" onClick={handleSubmit}>Guardar Memoria</Button>
                    </div>
                </Card>
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
