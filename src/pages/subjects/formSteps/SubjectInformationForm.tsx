import React from 'react';
import { Card, Row, Col, Form, Input, Select, Checkbox, Typography } from 'antd';

const { Option } = Select;
const { Title } = Typography;

interface SubjectInformationFormProps {
    generalInfo: {
        subjectCode: string;
        subjectName: string;
        academicYear: string;
        temporality: string;
        credits: number;
        materia: string;
        type: string;
        isKey: boolean;
        theoryHours: number;
        practiceHours: number;
        labHours: number;
        tutorialHours: number;
    };
    setGeneralInfo: (info: any) => void;
}

const COURSES: { [key: number]: string } = {
    1: 'Primero',
    2: 'Segundo',
    3: 'Tercero',
    4: 'Cuarto',
    5: 'Quinto',
    6: 'Sexto',
};

const SubjectInformationForm: React.FC<SubjectInformationFormProps> = ({ generalInfo, setGeneralInfo }) => (
    <Card title="Información de la Asignatura" style={{ marginTop: 16 }}>
        <Row gutter={16}>
            <Col span={8}>
                <Form.Item label="Código de la Asignatura" rules={[{ required: true, message: 'Introduzca el código de la asignatura' }]}>
                    <Input
                        value={generalInfo.subjectCode}
                        onChange={e => setGeneralInfo({ ...generalInfo, subjectCode: e.target.value })}
                    />
                </Form.Item>
            </Col>
            <Col span={16}>
                <Form.Item label="Nombre de la Asignatura" rules={[{ required: true, message: 'Introduzca el nombre de la asignatura' }]}>
                    <Input
                        value={generalInfo.subjectName}
                        onChange={e => setGeneralInfo({ ...generalInfo, subjectName: e.target.value })}
                    />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={8}>
                <Form.Item label="Curso Académico" rules={[{ required: true, message: 'Introduzca el curso académico' }]}>
                    <Select
                        value={generalInfo.academicYear}
                        onChange={value => setGeneralInfo({ ...generalInfo, academicYear: value })}
                    >
                        {[...Array(6)].map((_, index) => (
                            <Option key={index + 1} value={`${index + 1}`}>
                                {COURSES[index + 1]}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Temporalidad" rules={[{ required: true, message: 'Seleccione una temporalidad' }]}>
                    <Select
                        value={generalInfo.temporality}
                        onChange={value => setGeneralInfo({ ...generalInfo, temporality: value })}
                    >
                        <Option value="semestral">Semestral</Option>
                        <Option value="anual">Anual</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Créditos"
                    rules={[
                        { required: true, message: 'Introduzca los créditos' },
                        {
                            type: 'number',
                            min: 0,
                            message: 'Los créditos deben ser un número positivo',
                        },
                    ]}
                >
                    <Input
                        type="number"
                        min={0}
                        value={generalInfo.credits}
                        onChange={e => setGeneralInfo({ ...generalInfo, credits: Number(e.target.value) || 0 })}
                    />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Carácter de la Asignatura" rules={[{ required: true, message: 'Seleccione un tipo de asignatura' }]}>
                    <Select
                        value={generalInfo.type}
                        onChange={value => setGeneralInfo({ ...generalInfo, type: value })}
                    >
                        <Option value="Obligatoria">Obligatoria</Option>
                        <Option value="Optativa">Optativa</Option>
                        <Option value="Básica">Básica</Option>
                        <Option value="Prácticas">Prácticas</Option>
                        <Option value="Trabajo Final de Carrera">Trabajo Final de Carrera</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Materia" rules={[{ required: true, message: 'Introduzca una materia' }]}>
                    <Input
                        value={generalInfo.materia}
                        onChange={e => setGeneralInfo({ ...generalInfo, materia: e.target.value })}
                    />
                </Form.Item>
            </Col>
        </Row>

        <Title level={5}>Distribución de Horas</Title>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Clases Expositivas" rules={[{ required: true, message: 'Introduzca las horas de clases expositivas' }]}>
                    <Input
                        type="number"
                        value={generalInfo.theoryHours}
                        onChange={e => setGeneralInfo({ ...generalInfo, theoryHours: Number(e.target.value) || 0 })}
                    />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Prácticas de Aula/Seminario" rules={[{ required: true, message: 'Introduzca las horas de prácticas de aula/seminario' }]}>
                    <Input
                        type="number"
                        value={generalInfo.practiceHours}
                        onChange={e => setGeneralInfo({ ...generalInfo, practiceHours: Number(e.target.value) || 0 })}
                    />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Prácticas de Laboratorio" rules={[{ required: true, message: 'Introduzca las horas de prácticas de laboratorio' }]}>
                    <Input
                        type="number"
                        value={generalInfo.labHours}
                        onChange={e => setGeneralInfo({ ...generalInfo, labHours: Number(e.target.value) || 0 })}
                    />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Tutorías Grupales" rules={[{ required: true, message: 'Introduzca las horas de tutorías grupales' }]}>
                    <Input
                        type="number"
                        value={generalInfo.tutorialHours}
                        onChange={e => setGeneralInfo({ ...generalInfo, tutorialHours: Number(e.target.value) || 0 })}
                    />
                </Form.Item>
            </Col>
        </Row>

        <Form.Item>
            <Checkbox
                checked={generalInfo.isKey}
                onChange={e => setGeneralInfo({ ...generalInfo, isKey: e.target.checked })}
            >
                Asignatura Llave
            </Checkbox>
        </Form.Item>
    </Card>
);

export default SubjectInformationForm;
