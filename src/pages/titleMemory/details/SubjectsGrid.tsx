import React, { useEffect, useRef, useState } from 'react';
import { Card, Row, Col, Pagination, Typography, Spin } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetSubjectsByTitleMemoryId } from '../../../hooks/useSubjects';

const { Text } = Typography;

interface Subject {
    _id: string;
    code: string;
    name: string;
    credits: number;
    nature: string;
    duration: string;
}

const SubjectsGrid: React.FC = () => {
    const { id: titleId } = useParams<{ id: string }>();
    const [currentPage, setCurrentPage] = useState(1);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(false);
    const pageSize = 8;
    const navigate = useNavigate();
    const fetchedRef = useRef(false);
    const { mutateAsync: getSubjectsByTitleMemoryId } = useGetSubjectsByTitleMemoryId(titleId || '');

    const fetchSubjects = async (titleMemoryId: string) => {
        setLoading(true);
        try {
            const response = await getSubjectsByTitleMemoryId(titleMemoryId);
            setSubjects(response);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (titleId && !fetchedRef.current) {
            fetchSubjects(titleId);
            fetchedRef.current = true;
        }
    }, [titleId]);

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedSubjects = subjects?.slice(startIndex, startIndex + pageSize) || [];

    return (
        <>
            {loading ? (
                <Spin tip="Cargando asignaturas..." />
            ) : (
                <>
                    <Row gutter={[16, 16]}>
                        {paginatedSubjects.map(subject => (
                            <Col key={subject._id} xs={24} sm={12} md={12} lg={6}>
                                <Card
                                    title={subject.name}
                                    hoverable
                                    onClick={() => navigate(
                                        `/title-memory/details/${titleId}/subjects/${subject._id}`
                                    )}
                                >
                                    <Link to={`/title-memory/details/${titleId}/subjects/${subject._id}`} />
                                    <Text strong>Código:</Text> <div style={{ textTransform: 'capitalize' }}>{subject.code}</div>
                                    <Text strong>Créditos:</Text> <div>{subject.credits}</div>
                                    <Text strong>Naturaleza:</Text> <div style={{ textTransform: 'capitalize' }}>{subject.nature}</div>
                                    <Text strong>Duración:</Text> <div style={{ textTransform: 'capitalize' }}>{subject.duration}</div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={subjects?.length || 0}
                        onChange={(page) => setCurrentPage(page)}
                        style={{ marginTop: 24, textAlign: 'center' }}
                    />
                </>
            )}
        </>
    );
};

export default SubjectsGrid;
