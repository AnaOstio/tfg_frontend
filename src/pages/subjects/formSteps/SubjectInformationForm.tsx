import React from 'react';
import { Card, Row, Col, Form, Input, Select, Checkbox, Typography } from 'antd';

const { Option } = Select;
const { Title } = Typography;

const SubjectInformationForm: React.FC = () => (
    <Card title="Información de la Asignatura" style={{ marginTop: 16 }}>
        <Row gutter={16}>
            <Col span={8}>
                <Form.Item label="Código de la Asignatura" name="subjectCode" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Col>
            <Col span={16}>
                <Form.Item label="Nombre de la Asignatura" name="subjectName" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={8}>
                <Form.Item label="Curso Académico" name="academicYear" rules={[{ required: true }]}>
                    <Select>
                        <Option value="2023">2023</Option>
                        <Option value="2024">2024</Option>
                        <Option value="2025">2025</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Temporalidad" name="temporality" rules={[{ required: true }]}>
                    <Select>
                        <Option value="semestral">Semestral</Option>
                        <Option value="anual">Anual</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Créditos" name="credits" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Carácter de la Asignatura" name="subjectType" rules={[{ required: true }]}>
                    <Select>
                        <Option value="obligatoria">Obligatoria</Option>
                        <Option value="optativa">Optativa</Option>
                        <Option value="basica">Básica</Option>
                        <Option value="practicas">Prácticas</Option>
                        <Option value="trabajo-final-carrera">Trabajo final de carrera</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Materia" name="subjectMatter" rules={[{ required: true }]}>
                    <Select>
                        <Option value="matematicas">Matemáticas</Option>
                        <Option value="ciencias">Ciencias</Option>
                        <Option value="humanidades">Humanidades</Option>
                    </Select>
                </Form.Item>
            </Col>
        </Row>

        <Title level={5}>Distribución de Horas</Title>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Clases Expositivas" name="lectureHours" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Prácticas de Aula/Seminario" name="seminarHours" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Prácticas de Laboratorio" name="labHours" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Tutorías Grupales" name="tutoringHours" rules={[{ required: true }]}>
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
