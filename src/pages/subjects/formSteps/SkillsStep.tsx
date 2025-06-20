import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Input, Button, Table, Space, Typography, Select, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;

interface Skill {
    id: string;
    description: string;
    type: string;
}

const SkillsScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Simulación de carga de habilidades disponibles desde el backend
    useEffect(() => {
        const fetchAvailableSkills = async () => {
            setLoading(true);
            try {
                // Aquí iría la llamada real al backend
                // const response = await api.get(`/skills/available?memoryId=${id}`);
                const mockSkills: Skill[] = [
                    { id: 'SKL001', description: 'Habilidad técnica en desarrollo frontend', type: 'Técnica' },
                    { id: 'SKL002', description: 'Gestión de proyectos ágiles', type: 'Gestión' },
                    { id: 'SKL003', description: 'Comunicación efectiva en equipo', type: 'Blanda' },
                    { id: 'SKL004', description: 'Análisis de datos avanzado', type: 'Técnica' },
                    { id: 'SKL005', description: 'Diseño de interfaces de usuario', type: 'Técnica' },
                ];
                setAvailableSkills(mockSkills);
            } catch (error) {
                toast.error('Error al cargar las habilidades disponibles');
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableSkills();
    }, [id]);

    // Simulación de carga de habilidades ya asignadas
    useEffect(() => {
        const fetchAssignedSkills = async () => {
            try {
                // Aquí iría la llamada real al backend
                // const response = await api.get(`/skills/assigned?memoryId=${id}`);
                const mockAssignedSkills: Skill[] = [
                    { id: 'SKL006', description: 'Resolución de problemas complejos', type: 'Técnica' },
                ];
                setSkills(mockAssignedSkills);
            } catch (error) {
                toast.error('Error al cargar las habilidades asignadas');
            }
        };

        fetchAssignedSkills();
    }, [id]);

    const handleAddSkill = () => {
        if (!selectedSkill) {
            toast.warning('Por favor selecciona una habilidad');
            return;
        }

        const skillToAdd = availableSkills.find(skill => skill.id === selectedSkill);
        if (!skillToAdd) return;

        // Verificar si la habilidad ya está añadida
        if (skills.some(skill => skill.id === selectedSkill)) {
            toast.warning('Esta habilidad ya está añadida');
            return;
        }

        setSkills([...skills, skillToAdd]);
        setSelectedSkill(null);
        toast.success('Habilidad añadida correctamente');
    };

    const handleRemoveSkill = (skillId: string) => {
        setSkills(skills.filter(skill => skill.id !== skillId));
        toast.success('Habilidad eliminada');
    };

    const filteredSkills = availableSkills.filter(skill =>
        skill.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        skill.id.toLowerCase().includes(searchValue.toLowerCase())
    );

    const columns = [
        {
            title: 'ID-Habilidad',
            dataIndex: 'id',
            key: 'id',
            width: 120,
        },
        {
            title: 'Descripción de la Habilidad',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Tipo de Habilidad',
            dataIndex: 'type',
            key: 'type',
            width: 150,
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: 100,
            render: (_: any, record: Skill) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveSkill(record.id)}
                />
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Gestión de Habilidades</Title>
            <Title level={4} type="secondary" style={{ marginBottom: 24 }}>
                Memoria ID: {id}
            </Title>

            {/* Buscador y selector */}
            <Space.Compact style={{ width: '100%', marginBottom: 24 }}>
                <Input
                    placeholder="Buscar habilidades..."
                    prefix={<SearchOutlined />}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ width: '60%' }}
                />
                <Select
                    placeholder="Selecciona una habilidad"
                    style={{ width: '40%' }}
                    value={selectedSkill}
                    onChange={setSelectedSkill}
                    loading={loading}
                    showSearch
                    filterOption={false}
                    onSearch={(value) => setSearchValue(value)}
                >
                    {filteredSkills.map(skill => (
                        <Option key={skill.id} value={skill.id}>
                            {skill.id} - {skill.description}
                        </Option>
                    ))}
                </Select>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddSkill}
                    style={{ marginLeft: 8 }}
                >
                    Añadir
                </Button>
            </Space.Compact>

            {/* Lista de habilidades */}
            <Table
                columns={columns}
                dataSource={skills}
                rowKey="id"
                pagination={false}
                scroll={{ y: 400 }}
                locale={{
                    emptyText: 'No hay habilidades añadidas. Usa el buscador para añadir algunas.'
                }}
            />
        </div>
    );
};

export default SkillsScreen;