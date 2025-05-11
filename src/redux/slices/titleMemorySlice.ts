// features/titleMemory/titleMemorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AcademicLevel, AcademicReign, Competency, LearningOutcome, TitleMemoryState } from '../../utils/titleMemory';

const initialState: TitleMemoryState = {
    generalInfo: {
        titleCode: '',
        centers: '',
        university: '',
        academicLevel: '' as AcademicLevel,
        academicReign: '' as AcademicReign,
        year: 2026,
        academicScope: '',
    },
    credits: {
        basic: 0,
        mandatory: 0,
        optional: 0,
        practices: 0,
        finalWork: 0,
    },
    competencies: {
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
        // --- Reducers existentes ---
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
        addCompetency(
            state,
            action: PayloadAction<{
                type: keyof TitleMemoryState['competencies'];
                competency: Competency;
            }>
        ) {
            const { type, competency } = action.payload;
            state.competencies[type].push(competency);
        },
        removeCompetency(
            state,
            action: PayloadAction<{
                type: keyof TitleMemoryState['competencies'];
                id: string;
            }>
        ) {
            const { type, id } = action.payload;
            state.competencies[type] = state.competencies[type].filter(
                (comp) => comp.id !== id
            );
        },
        updateCompetency(
            state,
            action: PayloadAction<{
                type: keyof TitleMemoryState['competencies'];
                id: string;
                field: keyof Competency;
                value: string;
            }>
        ) {
            const { type, id, field, value } = action.payload;
            const comp = state.competencies[type].find((c) => c.id === id);
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
                field: 'code' | 'description';
                value: string;
            }>
        ) {
            const { id, field, value } = action.payload;
            const outcome = state.learningOutcomes.find((o) => o.id === id);
            if (outcome) (outcome as any)[field] = value;
        },
        addOutcomeCompetency(
            state,
            action: PayloadAction<{
                outcomeId: string;
                competencyCode: string;
            }>
        ) {
            const { outcomeId, competencyCode } = action.payload;
            const outcome = state.learningOutcomes.find((o) => o.id === outcomeId);
            if (
                outcome &&
                !outcome.associatedCompetencies.includes(competencyCode)
            ) {
                outcome.associatedCompetencies.push(competencyCode);
            }
        },
        removeOutcomeCompetency(
            state,
            action: PayloadAction<{
                outcomeId: string;
                competencyCode: string;
            }>
        ) {
            const { outcomeId, competencyCode } = action.payload;
            const outcome = state.learningOutcomes.find((o) => o.id === outcomeId);
            if (outcome) {
                outcome.associatedCompetencies = outcome.associatedCompetencies.filter(
                    (c) => c !== competencyCode
                );
            }
        },
    },
});

export const {
    updateGeneralInfo,
    updateCredits,
    addCompetency,
    removeCompetency,
    updateCompetency,
    saveTitleMemory,
    addLearningOutcome,
    removeLearningOutcome,
    updateLearningOutcome,
    addOutcomeCompetency,
    removeOutcomeCompetency,
} = titleMemorySlice.actions;

export default titleMemorySlice.reducer;
