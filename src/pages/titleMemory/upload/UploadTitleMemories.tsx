import React, { useState } from 'react';
import { Upload, Button, Card, Typography, Form, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUploadTitleMemories } from '../../../hooks/useTitleMemories';

const { Title } = Typography;

// Campos requeridos para cada objeto de memoria
const requiredKeys = [
    'titleCode',
    'universities',
    'centers',
    'name',
    'academicLevel',
    'branch',
    'academicField',
    'status',
    'yearDelivery',
    'totalCredits',
    'distributedCredits',
    'skills',
    'learningOutcomes'
];

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const UploadTitleMemories: React.FC = () => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { mutateAsync: uploadMemories } = useUploadTitleMemories();

    const validateStructure = (data: any): string[] => {
        const errors: string[] = [];
        if (!Array.isArray(data)) {
            errors.push('El JSON debe ser un array de objetos.');
            return errors;
        }
        data.forEach((item, idx) => {
            if (typeof item !== 'object' || item === null) {
                errors.push(`Ítem ${idx}: no es un objeto válido.`);
                return;
            }
            // Claves
            requiredKeys.forEach(key => {
                if (!(key in item)) {
                    errors.push(`Ítem ${idx}: falta la propiedad "${key}".`);
                }
            });
            // titleCode debe ser string
            if ('titleCode' in item && typeof item.titleCode !== 'string') {
                errors.push(
                    `Ítem ${idx}: "titleCode" debe ser string, no ${typeof item.titleCode}.`
                );
            }
        });
        return errors;
    };

    const handleUpload = async () => {
        if (fileList.length === 0) {
            toast.error('Por favor selecciona al menos un archivo JSON para subir');
            return;
        }

        // Validar estructura de cada archivo antes de subir
        for (let fileWrapper of fileList) {
            const file = fileWrapper.originFileObj as File;
            try {
                const text = await file.text();
                const json = JSON.parse(text);
                const errs = validateStructure(json);
                if (errs.length) {
                    toast.error(`Error en ${file.name}: ${errs.join(' ')}`);
                    return;
                }
            } catch (e) {
                toast.error(`Error parseando ${fileWrapper.name}: JSON inválido.`);
                return;
            }
        }

        // Si todo válido, subir
        const formData = new FormData();
        fileList.forEach((wrapper, i) => {
            formData.append('files', wrapper.originFileObj as File);
        });

        setLoading(true);
        try {
            await uploadMemories(formData);
            setFileList([]);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error al subir los archivos');
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file: File) => {
        const isJson = file.type === 'application/json' || file.name.endsWith('.json');
        const isSizeOk = file.size <= MAX_SIZE;
        if (!isJson) {
            toast.error(`${file.name}: Solo se permiten archivos JSON`);
        }
        if (!isSizeOk) {
            toast.error(
                `${file.name}: Excede el tamaño máximo de 5 MB (${(
                    file.size / 1024 / 1024
                ).toFixed(2)} MB)`
            );
        }
        return (isJson && isSizeOk) || Upload.LIST_IGNORE;
    };

    const onFileChange = ({ fileList }: { fileList: any[] }) => {
        setFileList(fileList);
    };

    return (
        <div style={{ padding: '24px', width: '80%', margin: '0 auto' }}>
            <Title level={2}>Subir Memorias de Título desde Archivo JSON</Title>

            <Card style={{ marginTop: 16 }}>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Archivos JSON de Memorias de Título"
                                required
                                rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                            >
                                <Upload
                                    beforeUpload={beforeUpload}
                                    onChange={onFileChange}
                                    fileList={fileList}
                                    accept=".json,application/json"
                                    multiple
                                >
                                    <Button icon={<UploadOutlined />}>Seleccionar Archivos JSON</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button
                                type="primary"
                                onClick={handleUpload}
                                loading={loading}
                                disabled={fileList.length === 0}
                            >
                                Subir Memorias
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card title="Instrucciones" style={{ marginTop: 24 }}>
                <ol>
                    <li>Selecciona uno o varios archivos JSON con las memorias de título (max 5 MB cada uno).</li>
                    <li>Haz clic en "Subir Memorias" para enviar.</li>
                </ol>
                <p><strong>Ejemplo de contenido del archivo JSON:</strong></p>
                <pre style={{ background: '#f5f5f5', padding: '10px' }}>{`[
  {
    "titleCode": "4",
    "universities": [
      "Universidad de Ejemplo 2",
      "Centros autorizados para impartir Enseñanzas Artísticas Superiores"
    ],
    "centers": [
      "Centros autorizados para impartir el Título de Conservación y Restauración de Bienes Culturales"
    ],
    "name": "otraaaaa",
    "academicLevel": "Grado",
    "branch": "Ciencias de la Salud",
    "academicField": "Bioquímica y biotecnología",
    "status": "Activo",
    "yearDelivery": 2023,
    "totalCredits": 240,
    "distributedCredits": {
      "Básicos": 60,
      "Optativa": 30,
      "Obligatoria": 150,
      "Trabajo Fin de Carrera": 6
    },
    "skills": [
      { "name": "competencia 1", "descripcion": "descripcion1", "type": "general" }
    ],
    "learningOutcomes": [
      { "name": "resp1", "descripcion": "resp1", "skills_id": ["competencia 1"] }
    ]
  }
]`}</pre>
            </Card>
        </div>
    );
};

export default UploadTitleMemories;
