// src/components/TitleMemoryCard.tsx
import React from 'react';
import { Card, Dropdown, Button } from 'antd';
import { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';

export interface TitleMemory {
    _id: string;
    name: string;
    universities: string[];
    centers: string[];
    totalCredits: number;
    academicLevel: string;
    academicField: string;
    fromUser?: boolean;
}

interface TitleMemoryCardProps {
    item: TitleMemory;
    fromUser: boolean;
    getActionItems: (item: TitleMemory) => MenuProps['items'];
}

const TitleMemoryCard: React.FC<TitleMemoryCardProps> = ({ item, fromUser, getActionItems }) => {
    const navigate = useNavigate();

    const paragraphStyle: React.CSSProperties = {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,   // limitar a 2 líneas
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    const handleCardClick = () => {
        navigate(`/title-memory/details/${item._id}`);
    };

    return (
        <Card
            hoverable
            style={{ height: '100%', cursor: 'pointer' }}
            onClick={handleCardClick}
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{item.name}</span>
                    <Dropdown
                        menu={{ items: getActionItems(item) }}
                        trigger={['click']}
                    >
                        <Button
                            type="primary"
                            size="small"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Acciones
                        </Button>
                    </Dropdown>
                </div>
            }
        >
            <p style={paragraphStyle}>
                <strong>Universidad:</strong> {item.universities.join(', ')}
            </p>
            <p style={paragraphStyle}>
                <strong>Centro:</strong> {item.centers.join(', ')}
            </p>
            <p style={paragraphStyle}>
                <strong>Créditos:</strong> {item.totalCredits}
            </p>
            <p style={paragraphStyle}>
                <strong>Nivel:</strong> {item.academicLevel}
            </p>
            <p style={paragraphStyle}>
                <strong>Ámbito:</strong> {item.academicField}
            </p>
        </Card>
    );
};

export default TitleMemoryCard;
