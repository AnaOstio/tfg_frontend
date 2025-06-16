import React from 'react';
import { Card, Row, Col, Form, Input, Select, Checkbox, Typography } from 'antd';

const { Option } = Select;
const { Title } = Typography;

const COURSES: { [key: number]: string } = {
    1: 'Primero',
    2: 'Segundo',
    3: 'Tercero',
    4: 'Cuarto',
    5: 'Quinto',
    6: 'Sexto'
}

const SubjectInformationForm: React.FC = () => (
    <Card title="Información de la Asignatura" style={{ marginTop: 16 }}>
        <Row gutter={16}>
            <Col span={8}>
                <Form.Item label="Código de la Asignatura" name="subjectCode" rules={[{ required: true, message: 'introduzca el código de la asignatura' }]}>
                    <Input />
                </Form.Item>
            </Col>
            <Col span={16}>
                <Form.Item label="Nombre de la Asignatura" name="subjectName" rules={[{ required: true, message: 'introduzca el nombre de la asignatura' }]}>
                    <Input />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={8}>
                <Form.Item label="Curso Académico" name="academicYear" rules={[{ required: true, message: 'introduzca el curso académico' }]}>
                    <Select>
                        {[...Array(6)].map((_, index) => {
                            return <Option key={index + 1} value={`${index + 1}`}>{COURSES[index + 1]}</Option>;
                        })}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Temporalidad" name="temporality" rules={[{ required: true, message: 'seleccione una temporalidad' }]}>
                    <Select>
                        <Option value="semestral">Semestral</Option>
                        <Option value="anual">Anual</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Créditos"
                    name="credits"
                    rules={[
                        { required: true, message: 'introduzca los créditos' },
                        {
                            type: 'number',
                            min: 0,
                            message: 'los créditos deben ser un número positivo',
                            transform: (value) => {
                                // Si viene "" o undefined, devuelvo NaN para que el required lo detecte
                                return value !== undefined && value !== '' ? Number(value) : NaN;
                            },
                        },
                    ]}
                >
                    <Input type="number" min={0} />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Carácter de la Asignatura" name="subjectType" rules={[{ required: true, message: 'seleccione un tipo de asignatura' }]}>
                    <Select>
                        <Option value="Obligatoria">Obligatoria</Option>
                        <Option value="Optativa">Optativa</Option>
                        <Option value="Básica">Básica</Option>
                        <Option value="Prácticas">Prácticas</Option>
                        <Option value="Trabajo Final de Carrera">Trabajo final de carrera</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Materia" name="subjectMatter" rules={[{ required: true, message: 'Introduzca una materia' }]}>
                    <Input />
                </Form.Item>
            </Col>
        </Row>

        <Title level={5}>Distribución de Horas</Title>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Clases Expositivas" name="lectureHours" rules={[{ required: true, message: 'introduzca las horas de clases expositivas' }]}>
                    <Input type="number" />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Prácticas de Aula/Seminario" name="seminarHours" rules={[{ required: true, message: 'introduzca las horas de prácticas de aula/seminario' }]}>
                    <Input type="number" />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Prácticas de Laboratorio" name="labHours" rules={[{ required: true, message: 'introduzca las horas de prácticas de laboratorio' }]}>
                    <Input type="number" />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Tutorías Grupales" name="tutoringHours" rules={[{ required: true, message: 'introduzca las horas de tutorías grupales' }]}>
                    <Input type="number" />
                </Form.Item>
            </Col>
        </Row>

        <Form.Item name="keySubject" valuePropName="checked">
            <Checkbox>Asignatura Llave</Checkbox>
        </Form.Item>
    </Card>
);

export default SubjectInformationForm;
