import React, { useState } from 'react';
import { Card, Row, Col, Pagination, Typography } from 'antd';

const { Text } = Typography;

interface Subject {
    _id: string;
    code: string;
    name: string;
    credits: number;
    nature: string;
    duration: string;
}

const mockSubjects: Subject[] = Array.from({ length: 20 }, (_, i) => ({
    _id: `${i}`,
    code: `SUBJ${100 + i}`,
    name: `Asignatura ${i + 1}`,
    credits: 6 + (i % 3),
    nature: i % 2 === 0 ? 'Obligatoria' : 'Optativa',
    duration: i % 3 === 0 ? 'Anual' : 'Cuatrimestral',
}));

const SubjectsGrid: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    const start = (currentPage - 1) * pageSize;
    const paginatedSubjects = mockSubjects.slice(start, start + pageSize);

    return (
        <>
            <Row gutter={[16, 16]}>
                {paginatedSubjects.map(subject => (
                    <Col key={subject._id} xs={24} sm={12} md={12} lg={6}>
                        <Card title={subject.name} hoverable>
                            <Text strong>Código:</Text> <div>{subject.code}</div>
                            <Text strong>Créditos:</Text> <div>{subject.credits}</div>
                            <Text strong>Naturaleza:</Text> <div>{subject.nature}</div>
                            <Text strong>Duración:</Text> <div>{subject.duration}</div>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={mockSubjects.length}
                onChange={page => setCurrentPage(page)}
                style={{ marginTop: 24, textAlign: 'center' }}
            />
        </>
    );
};

export default SubjectsGrid;
