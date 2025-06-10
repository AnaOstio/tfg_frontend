import React from 'react';
import { Card, Row, Col, Divider, Form, Input, Select, Button } from 'antd';
import { UniversitySelector } from '../../../components/titlesMemories/UniveristySelector';
import { CenterSelector } from '../../../components/titlesMemories/CenterSelector';
import { ACADEMIC_BRANCHES, ACADEMIC_FIELDS, ACADEMIC_LEVEL } from '../../../utils/const';


interface GeneralInfoStepProps {
    universities: string[];
    selectedUniversities: string[];
    centers: string[];
    selectedCenters: string[];
    loading: boolean;
    onUniversitySelect: (value: string) => void;
    onUniversityRemove: (value: string) => void;
    onCenterSelect: (value: string) => void;
    onCenterRemove: (value: string) => void;
    onNext: () => void;
}

export const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({
    universities,
    selectedUniversities,
    centers,
    selectedCenters,
    loading,
    onUniversitySelect,
    onUniversityRemove,
    onCenterSelect,
    onCenterRemove,
    onNext
}) => (
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

        <UniversitySelector
            universities={universities}
            selected={selectedUniversities}
            loading={loading}
            onSelect={onUniversitySelect}
            onRemove={onUniversityRemove}
        />

        <CenterSelector
            centers={centers}
            selected={selectedCenters}
            disabled={selectedUniversities.length === 0}
            onSelect={onCenterSelect}
            onRemove={onCenterRemove}
        />

        <Row gutter={16}>
            <Col span={8}>
                <Form.Item
                    label="Nivel Académico"
                    name={['generalInfo', 'academicLevel']}
                    rules={[{ required: true, message: 'Seleccione nivel académico' }]}
                >
                    <Select placeholder="Seleccione una opción">
                        {ACADEMIC_LEVEL.map(l => (
                            <Select.Option key={l} value={l}>{l}</Select.Option>
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
                            <Select.Option key={b} value={b}>{b}</Select.Option>
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
                filterOption={(input, option) =>
                    (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
            >
                {ACADEMIC_FIELDS.map(f => (
                    <Select.Option key={f} value={f}>{f}</Select.Option>
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
            </Col>
            <Col span={12}>
                <Form.Item label="Optativos" name={['credits', 'optional']}>
                    <Input type="number" min={0} />
                </Form.Item>
                <Form.Item label="Trabajo Final Garado" name={['credits', 'finalWork']}>
                    <Input type="number" min={0} />
                </Form.Item>
            </Col>
        </Row>

        <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Button type="primary" onClick={onNext}>
                Siguiente
            </Button>
        </div>
    </Card>
);