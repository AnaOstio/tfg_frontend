import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Tag,
    Button,
    Modal,
    Typography,
    Divider,
    message,
    Popconfirm
} from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { useSimilarLOsGet, useSimilarsGet, useUpdateSimilars, useUpdateSimilarsOutcomes } from '../../hooks/useSimilars';
import { normalizeSkills, NormalizedSimilarity } from '../../utils/normalizeSimilarities';

const { Text } = Typography;

interface SimilarityReviewProps {
    type?: 'skills' | 'los';
}
const SimilarityReview: React.FC<SimilarityReviewProps> = ({ type }) => {
    const [raw, setRaw] = useState<any[]>([]);
    const [data, setData] = useState<NormalizedSimilarity[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;
    const [selected, setSelected] = useState<NormalizedSimilarity | null>(null);
    const { mutateAsync: getSimilars } = useSimilarsGet();
    const { mutateAsync: getSimilarsLO } = useSimilarLOsGet();
    const { mutateAsync: updateSimilars } = useUpdateSimilars();
    const { mutateAsync: updateSimilarsOutcomes } = useUpdateSimilarsOutcomes();


    const fetchsimilars = async () => {
        try {
            const res = await getSimilars({ page, limit });
            setRaw(res.data);
            setTotal(res.total);
        } catch {
            message.error('Error cargando similitudes');
        }
    };

    const fetchsimilarsLO = async () => {
        try {
            const res = await getSimilarsLO({ page, limit });
            setRaw(res.data);
            setTotal(res.total);
        } catch {
            message.error('Error cargando similitudes');
        }
    };

    useEffect(() => {
        if (type === 'los') {
            fetchsimilarsLO();
        } else {
            fetchsimilars();
        }
    }, [page, type]);

    useEffect(() => {
        if (type === 'los') {
            setData(normalizeSkills(raw));
        } else {
            setData(normalizeSkills(raw));
        }
    }, [raw, type]);

    const handleGlobalAction = async (key: string, action: boolean) => {
        console.log(key);
        const doc = data.find(item => item.key === key);

        if (type === 'los') {
            updateSimilarsOutcomes({ id: key, value: { action }, similars: doc?.similars.map(s => s.other_id) });
        } else if (type === 'skills') {
            updateSimilars({ id: key, value: { action }, similars: doc?.similars.map(s => s.other_id) });
        }
        setData(d => d.filter(item => item.key !== key));
    };

    const columns = [
        {
            title: 'Principal',
            dataIndex: ['main', 'name'],
            key: 'mainName'
        },
        {
            title: 'Descripción',
            dataIndex: ['main', 'description'],
            key: 'mainDesc'
        },
        {
            title: 'Similitudes',
            dataIndex: 'similars',
            key: 'count',
            render: (list: any[]) => (
                <Tag color={list.length > 0 ? 'blue' : 'green'}>
                    {list.length} similar{list.length !== 1 ? 'es' : ''}
                </Tag>
            )
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_: any, record: NormalizedSimilarity) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => setSelected(record)}
                    >
                        Detalles
                    </Button>
                    <Popconfirm
                        title={`¿Aprobar todas para "${record.main.name}"?`}
                        onConfirm={() => handleGlobalAction(record.key, true)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button type="primary" icon={<CheckOutlined />} disabled={record.similars.length === 0}>
                            Aprobar
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        title={`¿Rechazar todas para "${record.main.name}"?`}
                        onConfirm={() => handleGlobalAction(record.key, false)}
                        okText="Sí"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<CloseOutlined />} disabled={record.similars.length === 0}>
                            Rechazar
                        </Button>
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <div style={{ padding: 24, width: '80%', margin: '0 auto' }}>
            <Card title="Revisión de Similitudes" bordered={false}>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="key"
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total,
                        onChange: newPage => setPage(newPage)
                    }}
                />
            </Card>

            <Modal
                title={`Detalles para: ${selected?.main.name}`}
                visible={!!selected}
                onCancel={() => setSelected(null)}
                footer={null}
                width={800}
            >
                {selected && (
                    <>
                        <Text strong>Principal:</Text>
                        <p>{selected.main.description}</p>
                        <Divider orientation="left">Similares</Divider>
                        <Table
                            dataSource={selected.similars}
                            pagination={false}
                            rowKey="other_id"
                            columns={[
                                { title: 'Nombre', dataIndex: 'name', key: 'name' },
                                { title: 'Descripción', dataIndex: 'description', key: 'description' },
                                {
                                    title: 'Similitud',
                                    dataIndex: 'similarity',
                                    key: 'similarity',
                                    render: (v: number) => `${(v * 100).toFixed(1)}%`
                                }
                            ]}
                        />
                    </>
                )}
            </Modal>
        </div>
    );
};

export default SimilarityReview;
