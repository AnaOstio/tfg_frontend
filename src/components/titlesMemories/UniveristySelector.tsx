import React from 'react';
import { Select, Tag, Form } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface UniversitySelectorProps {
    universities: string[];
    selected: string[];
    loading: boolean;
    onSelect: (value: string) => void;
    onRemove: (value: string) => void;
}

export const UniversitySelector: React.FC<UniversitySelectorProps> = ({
    universities,
    selected,
    loading,
    onSelect,
    onRemove
}) => (
    <Form.Item
        label="Universidad"
        required
        help={selected.length === 0 ? 'Seleccione al menos una universidad' : null}
        validateStatus={selected.length === 0 ? 'error' : ''}
    >
        <div>
            <Select
                showSearch
                placeholder="Buscar universidad..."
                style={{ width: '100%' }}
                value={null}
                onChange={onSelect}
                filterOption={(input, option) =>
                    (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent={loading ? "Cargando..." : "No se encontraron universidades"}
                disabled={loading}
            >
                {universities.map(univ => (
                    <Select.Option key={univ} value={univ}>{univ}</Select.Option>
                ))}
            </Select>
            <div style={{ marginTop: 8 }}>
                {selected.map(univ => (
                    <Tag
                        key={univ}
                        closable
                        onClose={() => onRemove(univ)}
                        closeIcon={<CloseOutlined />}
                        style={{ marginBottom: 4 }}
                    >
                        {univ}
                    </Tag>
                ))}
            </div>
        </div>
    </Form.Item>
);