// features/titleMemory/titleMemorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    AcademicLevel,
    AcademicReign,
    LearningOutcome,
    TitleMemoryState,
} from '../../utils/titleMemory';
import { Skill } from '../../utils/skill';

const initialState: TitleMemoryState = {
    generalInfo: {
        titleCode: '',
        centers: '',
        university: '',
        academicLevel: '' as AcademicLevel,
        academicReign: '' as AcademicReign,
        year: 2026,
        academicScope: '',
        memoryName: '',
    },
    credits: {
        basic: 0,
        mandatory: 0,
        optional: 0,
        practices: 0,
        finalWork: 0,
    },
    skills: {
        basic: [],
        general: [],
        transversal: [],
        specific: [],
    },
    learningOutcomes: [],
};

const titleMemorySlice = createSlice({
    name: 'titleMemory',
    initialState,
    reducers: {
        updateGeneralInfo(
            state,
            action: PayloadAction<Partial<TitleMemoryState['generalInfo']>>
        ) {
            state.generalInfo = { ...state.generalInfo, ...action.payload };
        },
        updateCredits(
            state,
            action: PayloadAction<Partial<TitleMemoryState['credits']>>
        ) {
            state.credits = { ...state.credits, ...action.payload };
        },
        addSkill(
            state,
            action: PayloadAction<{
                type: keyof TitleMemoryState['skills'];
                skill: Skill;
            }>
        ) {
            const { type, skill } = action.payload;
            state.skills[type].push(skill);
        },
        removeSkill(
            state,
            action: PayloadAction<{
                type: keyof TitleMemoryState['skills'];
                id: string;
            }>
        ) {
            const { type, id } = action.payload;
            state.skills[type] = state.skills[type].filter(
                (comp) => comp.id !== id
            );
        },
        updateSkill(
            state,
            action: PayloadAction<{
                type: keyof TitleMemoryState['skills'];
                id: string;
                field: keyof Skill;
                value: string;
            }>
        ) {
            const { type, id, field, value } = action.payload;
            const comp = state.skills[type].find((c) => c.id === id);
            if (comp) comp[field] = value;
        },
        saveTitleMemory(_, action: PayloadAction<TitleMemoryState>) {
            return action.payload;
        },
        // --- Nuevos reducers para Resultados de Aprendizaje ---
        addLearningOutcome(
            state,
            action: PayloadAction<{ outcome: LearningOutcome }>
        ) {
            state.learningOutcomes.push(action.payload.outcome);
        },
        removeLearningOutcome(
            state,
            action: PayloadAction<{ id: string }>
        ) {
            state.learningOutcomes = state.learningOutcomes.filter(
                (o) => o.id !== action.payload.id
            );
        },
        updateLearningOutcome(
            state,
            action: PayloadAction<{
                id: string;
                field: 'name' | 'description';
                value: string;
            }>
        ) {
            const { id, field, value } = action.payload;
            const outcome = state.learningOutcomes.find((o) => o.id === id);
            if (outcome) (outcome as any)[field] = value;
        },
        addOutcomeSkill(
            state,
            action: PayloadAction<{
                outcomeId: string;
                skillCode: string;
            }>
        ) {
            const { outcomeId, skillCode } = action.payload;
            const outcome = state.learningOutcomes.find(
                (o) => o.id === outcomeId
            );
            if (outcome && !outcome.associatedSkills.includes(skillCode)) {
                outcome.associatedSkills.push(skillCode);
            }
        },
        removeOutcomeSkill(
            state,
            action: PayloadAction<{
                outcomeId: string;
                skillCode: string;
            }>
        ) {
            const { outcomeId, skillCode } = action.payload;
            const outcome = state.learningOutcomes.find(
                (o) => o.id === outcomeId
            );
            if (outcome) {
                outcome.associatedSkills = outcome.associatedSkills.filter(
                    (c) => c !== skillCode
                );
            }
        },
        // --- NUEVO: Cargar toda la memoria de título directamente ---
        loadFullTitleMemory(
            _,
            action: PayloadAction<any> // El tipo real que devuelve el backend
        ) {
            return action.payload;
        }
    },
});

export const {
    updateGeneralInfo,
    updateCredits,
    addSkill,
    removeSkill,
    updateSkill,
    saveTitleMemory,
    addLearningOutcome,
    removeLearningOutcome,
    updateLearningOutcome,
    addOutcomeSkill,
    removeOutcomeSkill,
    loadFullTitleMemory, // <- ¡Nuevo export!
} = titleMemorySlice.actions;

export default titleMemorySlice.reducer;
