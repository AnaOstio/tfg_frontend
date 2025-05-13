import React from 'react';
import { Card, Checkbox } from 'antd';
import UniversityFilter from './UniversityFilter';
import { ACADEMIC_BRANCHES, ACADEMIC_LEVEL } from '../../utils/const';
import AcademicFieldFilter from './AcademicField';
import { Filters } from './types/types';
import Search from 'antd/es/input/Search';

interface GeneralFiltersProps {
    filters: Filters;
    onFilterChange: (filterType: keyof Filters, values: string[]) => void;
}

const GeneralFilters: React.FC<GeneralFiltersProps> = ({
    filters,
    onFilterChange,
}) => {
    return (
        <Card title="Filtros" style={{ width: '100%', marginBottom: 16 }}>
            <div style={{ marginBottom: '1em' }}>
                <h3 style={{ marginBottom: '8px', fontWeight: 500 }}>Nombre Memoria</h3>
                <Search
                    placeholder="Buscar universidad o centro..."
                    allowClear
                    onChange={(e) => onFilterChange('titleName', [e.target.value])}
                />
            </div>

            <div style={{ marginBottom: '1em' }}>
                <h3 style={{ marginBottom: '8px', fontWeight: 500 }}>Nivel Académico</h3>
                <Checkbox.Group
                    options={ACADEMIC_LEVEL}
                    value={filters.academicLevel}
                    onChange={(values) => onFilterChange('academicLevel', values)}
                    style={{ display: 'flex', flexDirection: 'column' }}
                />
            </div>

            <div style={{ marginBottom: '1em' }}>
                <h3 style={{ marginBottom: '8px', fontWeight: 500 }}>Rama Académica</h3>
                <Checkbox.Group
                    options={ACADEMIC_BRANCHES}
                    value={filters.branchAcademic}
                    onChange={(values) => onFilterChange('branchAcademic', values)}
                    style={{ display: 'flex', flexDirection: 'column' }}
                />
            </div>

            <div style={{ marginBottom: '1em' }}>
                <AcademicFieldFilter
                    value={filters.academicFields}
                    onChange={(values) => onFilterChange('academicFields', values)}
                />
            </div>

            <div>
                <UniversityFilter
                    selectedUniversities={filters.universities}
                    selectedCenters={filters.centers}
                    onUniversityChange={(values) => onFilterChange('universities', values)}
                    onCenterChange={(values) => onFilterChange('centers', values)}
                />
            </div>
        </Card>
    );
};

export default GeneralFilters;