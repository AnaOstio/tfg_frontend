export interface Skill {
    _id: string;
    code: string;
    description: string;
    type: string;
}

export interface LearningOutcome {
    id: string;
    name: string;
    description: string;
    associatedSkills: string[];
}

export interface TitleMemory {
    _id: string;
    titleCode: number;
    universities: string[];
    centers: string[];
    name: string;
    academicLevel: string;
    branch: string;
    academicField: string;
    status: string;
    yearDelivery: number;
    totalCredits: number;
    distributedCredits: { [key: string]: number };
    skills: Skill[];
    learningOutcomes: LearningOutcome[];
}
