import React from 'react';
import { Select, Tag, Form } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface CenterSelectorProps {
    centers: string[];
    selected: string[];
    disabled: boolean;
    onSelect: (value: string) => void;
    onRemove: (value: string) => void;
}

export const CenterSelector: React.FC<CenterSelectorProps> = ({
    centers,
    selected,
    disabled,
    onSelect,
    onRemove
}) => (
    <Form.Item
        label="Centros"
        required
        help={selected.length === 0 ? 'Seleccione al menos un centro' : null}
        validateStatus={selected.length === 0 ? 'error' : ''}
    >
        <div>
            <Select
                showSearch
                placeholder={disabled ? 'Seleccione universidades primero' : 'Buscar centro...'}
                style={{ width: '100%' }}
                value={null}
                onChange={onSelect}
                filterOption={(input, option) =>
                    (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                disabled={disabled}
                notFoundContent="No se encontraron centros"
            >
                {centers.map(center => (
                    <Select.Option key={center} value={center}>{center}</Select.Option>
                ))}
            </Select>
            <div style={{ marginTop: 8 }}>
                {selected.map(center => (
                    <Tag
                        key={center}
                        closable
                        onClose={() => onRemove(center)}
                        closeIcon={<CloseOutlined />}
                        style={{ marginBottom: 4 }}
                    >
                        {center}
                    </Tag>
                ))}
            </div>
        </div>
    </Form.Item>
);