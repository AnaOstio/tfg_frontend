import React, { useState } from 'react';
import { Upload, Button, Select, Card, Typography, Form, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;

interface TitleMemory {
    _id: string;
    name: string;
    titleCode: number;
}

const UploadSubjectsScreen: React.FC = () => {
    const [selectedMemory, setSelectedMemory] = useState<string | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Datos mock de memorias de título - reemplazar con llamada a API real
    const titleMemories: TitleMemory[] = [
        { _id: '1', name: 'Ing. Informática 2023', titleCode: 202301 },
        { _id: '2', name: 'Ing. Telecomunicaciones 2023', titleCode: 202302 },
        { _id: '3', name: 'Matemáticas 2023', titleCode: 202303 },
    ];

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