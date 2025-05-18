import React from 'react';
import { Button, Table, Select } from 'antd';
import { Skill } from '../../../utils/skill';
import { InfiniteSearchSelectInput } from '../../../components/inputs/InfiniteSearchSelectInput';

type LearningOutcome = {
    id: string;
    name: string;
    associatedSkills: string[];
};

type Props = {
    learningOutcomes: LearningOutcome[]; // ya no un objeto, solo el array
    newOutcomeText: string; // nuevo prop
    skills: Record<string, Skill[]>;
    onAddOutcome: () => void;
    onRemoveOutcome: (id: string) => void;
    onOutcomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOutcomeInputChange: (val: string) => void;
    onOutcomeSelected: (item: { id: string; name: string }) => void;
    onSkillRelationChange: (outcomeId: string, skillIds: string[]) => void;
    onPrev: () => void;
    onNext: () => void;
    fetchOutcomes: (
        search: string,
        page: number
    ) => Promise<{ data: { id: string; name: string }[]; hasMore: boolean }>;
    selectedItem: { id: string; name: string } | null;
};

export const LearningOutcomesStep: React.FC<Props> = ({
    learningOutcomes,
    newOutcomeText,
    skills,
    onAddOutcome,
    onRemoveOutcome,
    onOutcomeInputChange,
    onOutcomeSelected,
    onSkillRelationChange,
    onPrev,
    onNext,
    fetchOutcomes,
    selectedItem
}) => {
    const skillOptions = [
        ...(skills.basic || []).map(skill => ({
            label: `${skill.name} (Básica)`,
            value: skill.id
        })),
        ...(skills.general || []).map(skill => ({
            label: `${skill.name} (General)`,
            value: skill.id
        })),
        ...(skills.transversal || []).map(skill => ({
            label: `${skill.name} (Transversal)`,
            value: skill.id
        })),
        ...(skills.specific || []).map(skill => ({
            label: `${skill.name} (Específica)`,
            value: skill.id
        }))
    ];

    return (
        <div>
            <div style={{ display: 'flex', marginBottom: 16 }}>
                <InfiniteSearchSelectInput
                    placeholder="Buscar o ingresar resultado de aprendizaje"
                    fetchData={fetchOutcomes}
                    renderItem={(item) => item.name}
                    onSelect={onOutcomeSelected}
                    value={newOutcomeText}
                    onChange={onOutcomeInputChange}
                    selectedItem={selectedItem}
                    onAddItem={onAddOutcome}
                />
            </div>

            <Table
                dataSource={learningOutcomes}
                rowKey="id"
                pagination={false}
                columns={[
                    {
                        title: 'Resultado de Aprendizaje',
                        dataIndex: 'name',
                        key: 'name',
                        width: '50%'
                    },
                    {
                        title: 'Competencias Relacionadas',
                        key: 'associatedCompetencies',
                        render: (_, record) => (
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="Seleccione competencias"
                                value={record.associatedSkills}
                                onChange={(value) =>
                                    onSkillRelationChange(record.id, value)
                                }
                                options={skillOptions}
                            />
                        )
                    },
                    {
                        title: 'Acciones',
                        key: 'actions',
                        render: (_, record) => (
                            <Button danger onClick={() => onRemoveOutcome(record.id)}>
                                Eliminar
                            </Button>
                        )
                    }
                ]}
            />

            <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Button onClick={onPrev} style={{ marginRight: 8 }}>Atrás</Button>
                <Button
                    type="primary"
                    onClick={onNext}
                    disabled={Object.values(skills).flat().length === 0}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
};