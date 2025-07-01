import React, { useEffect, useState } from 'react';
import { Upload, Button, Select, Card, Typography, Form, Row, Col, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useGetTileMemoriesByUser } from '../../../hooks/useTitleMemories';
import { useGetSkillsByIds } from '../../../hooks/useSkills';

const { Title } = Typography;
const { Option } = Select;

const UploadSubjectsScreen: React.FC = () => {
    const [selectedMemory, setSelectedMemory] = useState<string | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { mutateAsync: getByUserId } = useGetTileMemoriesByUser();
    const { mutateAsync: getSkills } = useGetSkillsByIds();
    const [titleMemories, setTitleMemories] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const handleUpload = () => {
        if (!selectedMemory) {
            toast.error('Por favor selecciona una memoria de título');
            return;
        }

        if (fileList.length === 0) {
            toast.error('Por favor selecciona un archivo para subir');
            return;
        }

        setLoading(true);

        // Simulación de subida de archivo - reemplazar con llamada a API real
        setTimeout(() => {
            setLoading(false);
            toast.success(`Archivo subido correctamente para la memoria ${selectedMemory}`);
            setFileList([]);
        }, 2000);
    };

    const beforeUpload = (file: File) => {
        const isTxt = file.type === 'text/plain' || file.name.endsWith('.txt');
        if (!isTxt) {
            toast.error('Solo se permiten archivos TXT');
        }
        return isTxt;
    };

    const onFileChange = ({ fileList }: { fileList: any[] }) => {
        setFileList(fileList);
    };

    const fetchTitleMemories = async () => {
        try {
            const memories = await getByUserId();
            const allowedRoles = ['Propietario', 'Asignaturas'];

            const ownedMemories = memories.result.data.filter(memoria => {
                return memories.permissions.some(perm =>
                    perm.memoryId === memoria._id
                    && perm.permissions.some(role => allowedRoles.includes(role))
                );
            });
            setTitleMemories(ownedMemories);

            return memories;
        } catch (error) {
            console.error('Error al obtener las memorias de título:', error);
            toast.error('Lo sentimos, ha ocurrido un error al cargar las memorias de título');
            return [];
        }
    }

    const getSkillsByIds = async (memoryId: string) => {
        try {
            const memory = titleMemories.filter(memory => memory._id === memoryId);

            const skillsIds = await getSkills(memory[0].skills || []);
            setSelectedSkills(skillsIds);
        } catch (error) {
            console.error('Error al obtener las competencias:', error);
            toast.error('Lo sentimos, ha ocurrido un error al cargar las competencias');
        }
    }

    useEffect(() => {
        fetchTitleMemories();
    }, []);

    useEffect(() => {
        if (selectedMemory) {
            getSkillsByIds(selectedMemory);
        }
    }, [selectedMemory]);

    // Columnas para la tabla de competencias
    const skillColumns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Subir Asignaturas desde Archivo TXT</Title>

            <Card style={{ marginTop: 16 }}>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Memoria de Título"
                                required
                                rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                            >
                                <Select
                                    placeholder="Selecciona una memoria de título"
                                    onChange={(value) => setSelectedMemory(value)}
                                    value={selectedMemory}
                                >
                                    {titleMemories.map(memory => (
                                        <Option key={memory._id} value={memory._id}>
                                            {memory.name} (Código: {memory.titleCode})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Archivo TXT de Asignaturas"
                                required
                                rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                            >
                                <Upload
                                    beforeUpload={beforeUpload}
                                    onChange={onFileChange}
                                    fileList={fileList}
                                    accept=".txt"
                                >
                                    <Button icon={<UploadOutlined />}>Seleccionar Archivo</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                onClick={handleUpload}
                                loading={loading}
                                disabled={!selectedMemory || fileList.length === 0}
                            >
                                Subir Asignaturas
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card title="Competencias asociadas a la memoria seleccionada" style={{ marginTop: 24 }}>
                <p>Listado de competencias asociadas a la memoria de título seleccionada:</p>
                <Table
                    columns={skillColumns}
                    dataSource={selectedSkills}
                    rowKey="_id"
                    pagination={false}
                    bordered
                    size="small"
                />
            </Card>

            <Card title="Instrucciones" style={{ marginTop: 24 }}>
                <ol>
                    <li>Selecciona la memoria de título a la que pertenecen las asignaturas</li>
                    <li>Selecciona un archivo TXT con el formato correcto</li>
                    <li>Haz clic en "Subir Asignaturas"</li>
                </ol>
                <p><strong>Ejemplo de contenido del archivo:</strong></p>
            </Card>
        </div>
    );
};

export default UploadSubjectsScreen;