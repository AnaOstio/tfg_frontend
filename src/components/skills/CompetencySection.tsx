import React from 'react';
import { Row, Col, Input, Button, List } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Competency } from '../../utils/titleMemory';

interface CompetencySectionProps {
    type: 'basicas' | 'general' | 'transversal' | 'especificas';
    title: string;

    /** Datos */
    competencies: Competency[];
    searchText: string;
    newCompetency: { code: string; description: string };

    /** Callbacks */
    onSearchChange: (value: string) => void;
    onAddCompetency: () => void;
    onRemoveCompetency: (id: string) => void;
    onNewCompetencyChange: (field: 'code' | 'description', value: string) => void;
}

export const CompetencySection: React.FC<CompetencySectionProps> = ({
    competencies,
    searchText,
    newCompetency,
    onSearchChange,
    onAddCompetency,
    onRemoveCompetency,
    onNewCompetencyChange,
}) => {
    return (
        <>
            {/* 🔍 Buscador + botón “Añadir” */}
            <Row gutter={8} style={{ marginBottom: 16 }}>
                <Col span={18}>
                    <Input
                        placeholder="Buscar competencia…"
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        prefix={<SearchOutlined />}
                    />
                </Col>
                <Col span={6}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onAddCompetency}
                        block
                    >
                        Añadir
                    </Button>
                </Col>
            </Row>

            {/* ➕ Formulario rápido para nueva competencia */}
            <div
                style={{
                    marginBottom: 16,
                    padding: 16,
                    border: '1px dashed #d9d9d9',
                    borderRadius: 4,
                }}
            >
                <Row gutter={8} align="middle">
                    <Col span={10}>
                        <Input
                            placeholder="Código"
                            value={newCompetency.code}
                            onChange={(e) =>
                                onNewCompetencyChange('code', e.target.value)
                            }
                        />
                    </Col>
                    <Col span={12}>
                        <Input
                            placeholder="Descripción"
                            value={newCompetency.description}
                            onChange={(e) =>
                                onNewCompetencyChange('description', e.target.value)
                            }
                        />
                    </Col>
                    <Col span={2}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onAddCompetency}
                            disabled={
                                !newCompetency.code.trim() ||
                                !newCompetency.description.trim()
                            }
                        />
                    </Col>
                </Row>
            </div>

            {/* 📋 Listado de competencias */}
            <List
                dataSource={competencies}
                locale={{ emptyText: 'Sin competencias añadidas' }}
                renderItem={(comp) => (
                    <List.Item
                        key={comp.id}
                        actions={[
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => onRemoveCompetency(comp.id)}
                            />,
                        ]}
                    >
                        <List.Item.Meta
                            title={<strong>{comp.code}</strong>}
                            description={comp.description}
                        />
                    </List.Item>
                )}
            />
        </>
    );
};
