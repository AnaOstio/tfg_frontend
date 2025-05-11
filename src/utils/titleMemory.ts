// features/titleMemory/types.ts

// Niveles académicos permitidos
export type AcademicLevel = 'Grado' | 'Máster' | 'Doctorado';

// Ramas académicas permitidas
export type AcademicReign = 'Artes' | 'Ciencias' | 'Ingeniería' | 'Humanidades';

// Estructura de una Competencia
export interface Competency {
    id: string;
    code: string;
    description: string;
}

// Estructura de un Resultado de Aprendizaje
export interface LearningOutcome {
    id: string;
    code: string;
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
    competencies: {
        basic: Competency[];
        general: Competency[];
        transversal: Competency[];
        specific: Competency[];
    };
    learningOutcomes: LearningOutcome[];
}
