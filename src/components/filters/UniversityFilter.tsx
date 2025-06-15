import React, { useState, useEffect } from 'react';
import { Input, Checkbox, Button, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { selectUniversitiesData } from '../../redux/slices/universitiesSlice';

const { Search } = Input;

const UniversityFilter: React.FC<{
    selectedUniversities: string[];
    selectedCenters: string[];
    onUniversityChange: (universities: string[]) => void;
    onCenterChange: (centers: string[]) => void;
}> = ({ selectedUniversities, selectedCenters, onUniversityChange, onCenterChange }) => {
    const universitiesData = useSelector(selectUniversitiesData);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllUniversities, setShowAllUniversities] = useState(false);
    const [showAllCenters, setShowAllCenters] = useState(false);
    const [filteredUniversities, setFilteredUniversities] = useState<typeof universitiesData>([]);
    const [loading, setLoading] = useState(true);

    // Inicializar y filtrar universidades
    useEffect(() => {
        if (universitiesData) {
            const filtered = universitiesData.filter(uni =>
                uni.universidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                uni.centros.some(center => center.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredUniversities(filtered);
            setLoading(false);
        }
    }, [searchTerm, universitiesData]);

    // Manejar selección/deselección de universidad
    const handleUniversityToggle = (uni: string) => {
        const newSelection = selectedUniversities.includes(uni)
            ? selectedUniversities.filter(u => u !== uni)
            : [...selectedUniversities, uni];
        onUniversityChange(newSelection);
    };

    // Manejar selección/deselección de centro
    const handleCenterToggle = (center: string) => {
        const newSelection = selectedCenters.includes(center)
            ? selectedCenters.filter(c => c !== center)
            : [...selectedCenters, center];
        onCenterChange(newSelection);
    };

    const visibleUniversities = showAllUniversities
        ? filteredUniversities
        : filteredUniversities.slice(0, 5);

    return (
        <>
            <h3 style={{ marginBottom: '8px', fontWeight: 500 }}>Universidades y Centros</h3>
            <Search
                placeholder="Buscar universidad o centro..."
                allowClear
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 16 }}
            />

            <Spin spinning={loading}>
                {/* Lista de universidades */}
                <div style={{ marginBottom: 16 }}>
                    <h4 style={{ marginBottom: 8 }}>Universidades</h4>
                    {visibleUniversities.map(uni => (
                        <div key={uni.universidad} style={{ marginBottom: 8 }}>
                            <Checkbox
                                checked={selectedUniversities.includes(uni.universidad)}
                                onChange={() => handleUniversityToggle(uni.universidad)}
                            >
                                {uni.universidad}
                            </Checkbox>

                            {/* Centros de esta universidad */}
                            {selectedUniversities.includes(uni.universidad) && (
                                <div style={{ marginLeft: 24, marginTop: 8 }}>
                                    {uni.centros.slice(0, showAllCenters ? undefined : 3).map(center => (
                                        <div key={center} style={{ marginBottom: 4 }}>
                                            <Checkbox
                                                checked={selectedCenters.includes(center)}
                                                onChange={() => handleCenterToggle(center)}
                                            >
                                                {center}
                                            </Checkbox>
                                        </div>
                                    ))}
                                    {uni.centros.length > 3 && (
                                        <Button
                                            type="link"
                                            size="small"
                                            onClick={() => setShowAllCenters(!showAllCenters)}
                                        >
                                            {showAllCenters ? 'Ver menos' : 'Ver más...'}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredUniversities.length > 5 && (
                    <Button
                        type="link"
                        onClick={() => setShowAllUniversities(!showAllUniversities)}
                        style={{ padding: 0, color: '#52c41a' }}
                    >
                        {showAllUniversities ? 'Ver menos universidades' : 'Ver más universidades...'}
                    </Button>
                )}
            </Spin>
        </>
    );
};

export default UniversityFilter;
