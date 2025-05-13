// components/filters/YearSlider.tsx
import React, { useState } from 'react';
import { Slider, Row, Col } from 'antd';
import { YEAR_RANGE } from './consts/cosnts';

interface YearSliderProps {
    value: [number, number];
    onChange: (years: [number, number]) => void;
}

const YearSlider: React.FC<YearSliderProps> = ({ value, onChange }) => {
    const [currentRange, setCurrentRange] = useState<[number, number]>(value);

    const handleChange = (value: number | number[]) => {
        if (Array.isArray(value)) {
            const newRange = value as [number, number];
            setCurrentRange(newRange);
            onChange(newRange);
        }
    };

    return (
        <div style={{ marginBottom: '1em' }}>
            <h3 style={{ marginBottom: '8px', fontWeight: 500 }}>Año de Impartición</h3>

            <Slider
                range
                min={YEAR_RANGE[0]}
                max={YEAR_RANGE[1]}
                defaultValue={value}
                value={currentRange}
                onChange={handleChange}
                marks={{
                    2000: '2000',
                    [new Date().getFullYear()]: new Date().getFullYear().toString()
                }}
            />

            <Row justify="space-between" style={{ marginTop: '8px' }}>
                <Col>
                    <span>Año mínimo: {currentRange[0]}</span>
                </Col>
                <Col>
                    <span>Año máximo: {currentRange[1]}</span>
                </Col>
            </Row>
        </div>
    );
};

export default YearSlider;