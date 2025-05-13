import React, { useState } from 'react';
import { Checkbox, Button } from 'antd';
import { ACADEMIC_FIELDS } from '../../utils/const';

interface AcademicFieldFilterProps {
    value: string[];
    onChange: (fields: string[]) => void;
}

const AcademicFieldFilter: React.FC<
    AcademicFieldFilterProps
> = ({ value, onChange }) => {
    const [showAll, setShowAll] = useState(false);
    const visibleFields = showAll ? ACADEMIC_FIELDS : ACADEMIC_FIELDS.slice(0, 5);

    const handleChange = (checkedValues: string[]) => {
        onChange(checkedValues);
    };

    return (
        <>
            <div style={{ marginBottom: '0.5em' }}>
                <h3 style={{ marginBottom: '8px', fontWeight: 500 }}>Campo Académico</h3>

                <Checkbox.Group
                    options={visibleFields}
                    value={value}
                    onChange={handleChange}
                    style={{ display: 'flex', flexDirection: 'column' }}
                />

                {ACADEMIC_FIELDS.length > 5 && (
                    <Button
                        type="link"
                        onClick={() => setShowAll(!showAll)}
                        style={{
                            paddingLeft: 0,
                            marginTop: '8px',
                            fontWeight: 'normal'
                        }}
                    >
                        {showAll ? 'Ver menos' : 'Ver más...'}
                    </Button>
                )}
            </div>
        </>
    );
};

export default AcademicFieldFilter;