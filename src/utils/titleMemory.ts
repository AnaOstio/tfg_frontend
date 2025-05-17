// features/titleMemory/types.ts

import { Filters } from "../components/filters/types/types";
import { Skill } from "./skill";

// Niveles académicos permitidos
export type AcademicLevel = 'Grado' | 'Máster' | 'Doctorado';

// Ramas académicas permitidas
export type AcademicReign = 'Artes' | 'Ciencias' | 'Ingeniería' | 'Humanidades';

// Estructura de un Resultado de Aprendizaje
export interface LearningOutcome {
    id: string;
    name: string;
    description: string;
    associatedCompetencies: string[];
}

// Información general del Título
export interface GeneralInfo {
    titleCode: string;
    centers: string;
    university: string;
    academicLevel: AcademicLevel;
    academicReign: AcademicReign;
    year: number;
    academicScope: string;
}

// Distribución de créditos
export interface Credits {
    basic: number;
    mandatory: number;
    optional: number;
    practices: number;
    finalWork: number;
}

// Estado completo de la memoria de título
export interface TitleMemoryState {
    generalInfo: GeneralInfo;
    credits: Credits;
    skills: {
        basic: Skill[];
        general: Skill[];
        transversal: Skill[];
        specific: Skill[];
    };
    learningOutcomes: LearningOutcome[];
}

export interface TitleMemoriesSearchParams {
    filters: Filters;
    page: number;
    limit: number;
    fromUser?: boolean;
}
