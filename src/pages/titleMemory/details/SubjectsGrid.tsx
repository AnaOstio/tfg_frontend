import React, { useEffect, useRef, useState } from 'react';
import { Card, Row, Col, Pagination, Typography, Spin, Empty, Dropdown, Button, MenuProps } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetSubjectsByTitleMemoryId, useSubjectsDelete } from '../../../hooks/useSubjects';
import useConfirmation from '../../../hooks/useConfirmation';

const { Text } = Typography;

interface Subject {
    _id: string;
    code: string;
    name: string;
    credits: number;
    nature: string;
    duration: string;
}

interface SubjectsGridProps {
    permissions?: any[];
}

const SubjectsGrid: React.FC<SubjectsGridProps> = ({ permissions = [] }) => {
    const { id: titleId } = useParams<{ id: string }>();
    const [currentPage, setCurrentPage] = useState(1);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(false);
    const pageSize = 8;
    const navigate = useNavigate();
    const fetchedRef = useRef(false);
    const { mutateAsync: getSubjectsByTitleMemoryId } = useGetSubjectsByTitleMemoryId(titleId || '');
    const { mutateAsync: deleteSubject } = useSubjectsDelete();
    const { showConfirmation, ConfirmationModal } = useConfirmation();

    type SubjectActionKey = 'edit' | 'delete';
    const REQUIRED_PERMISSIONS: Record<SubjectActionKey, string[]> = {
        edit: ['Propietario', 'Asignaturas'],
        delete: ['Propietario', 'Asignaturas'],
    };

    const hasAny = (userPerms: string[], needed: string[]) =>
        needed.length === 0 || needed.some(p => userPerms.includes(p));

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

    const handleDelete = async (subjectId: string) => {
        setLoading(true);
        try {
            await deleteSubject(subjectId);
            setSubjects(prev => prev.filter(subject => subject._id !== subjectId));
        } catch (error) {
            console.error('Error deleting subject:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (titleId && !fetchedRef.current) {
            fetchSubjects(titleId);
            fetchedRef.current = true;
        }
    }, [titleId]);

    const getSubjectActions = (subjectId: string): MenuProps['items'] => [
        {
            key: 'edit',
            disabled: !hasAny(permissions, REQUIRED_PERMISSIONS.edit),
            label: (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-subject/${titleId}/${subjectId}`);
                    }}
                >
                    Editar
                </div>
            ),
        },
        {
            key: 'delete',
            disabled: !hasAny(permissions, REQUIRED_PERMISSIONS.delete),
            label: (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        showConfirmation(
                            '¿Desea eliminar esta memoria de asignatura?',
                            () => handleDelete(subjectId),
                        );
                    }}
                >
                    Eliminar
                </div>
            ),
        },
    ];

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedSubjects = subjects?.slice(startIndex, startIndex + pageSize) || [];

    if (!loading && subjects.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '80px' }}>
                <Empty description={<Text>No hay asignaturas para esta memoria de título</Text>} />
            </div>
        );
    }

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
                                    extra={
                                        <Dropdown
                                            menu={{ items: getSubjectActions(subject._id) }}
                                            trigger={['click']}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                size="small"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Acciones
                                            </Button>
                                        </Dropdown>
                                    }
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
            <ConfirmationModal />
        </>
    );
};

export default SubjectsGrid;