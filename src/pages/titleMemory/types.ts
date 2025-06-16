export interface Skill {
    _id: string;
    code: string;
    description: string;
    type: string;
    name?: string; // Optional for compatibility with other parts of the app
}

export interface LearningOutcome {
    id: string;
    name: string;
    description: string;
    associatedSkills?: string[];
    skills_id?: string[];
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
