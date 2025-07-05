type InputSkill = {
    id: string;
    name: string;
    description: string;
    type: string;
};

type InputLearningOutcome = {
    id: string;
    name: string;
    description: string;
    associatedSkills: string[];
};

type InputData = {
    generalInfo: {
        titleCode: string;
        centers: string;
        university: string;
        academicLevel: string;
        academicReign: string;
        year: number;
        academicScope: string;
        memoryName: string;
    };
    credits: {
        basic: number;
        mandatory: number;
        optional: number;
        practices: number;
        finalWork: number;
    };
    skills: {
        basic: InputSkill[];
        general: InputSkill[];
        transversal: InputSkill[];
        specific: InputSkill[];
    };
    learningOutcomes: InputLearningOutcome[];
};

type OutputData = {
    titleCode: string;
    universities: string[];
    centers: string[];
    name: string;
    academicLevel: string;
    branch: string;
    academicField: string;
    status: string;
    yearDelivery: number;
    totalCredits: number;
    distributedCredits: {
        [key: string]: number;
    };
    existingSkills: string[];
    skills: {
        name: string;
        description: string;
        type: string;
        generated_id: string;
    }[];
    existinglearningOutcomes: { [key: string]: string[] }[];
    learningOutcomes: {
        name: string;
        description: string;
        skills_id: string[];
    }[];
};

export function transformData(input: InputData): OutputData {
    const { generalInfo, credits, skills, learningOutcomes } = input;

    const allSkills = [...skills.basic, ...skills.general, ...skills.transversal, ...skills.specific];

    const existingSkills: string[] = [];
    const newSkills: OutputData['skills'] = [];

    for (const skill of allSkills) {
        if (skill.id.includes('-')) {
            newSkills.push({
                name: skill.name,
                description: skill.description,
                type: skill.type,
                generated_id: skill.id
            });
        } else {
            existingSkills.push(skill.id);
        }
    }

    const existingOutcomes: OutputData['existinglearningOutcomes'] = [];
    const newOutcomes: OutputData['learningOutcomes'] = [];

    for (const outcome of learningOutcomes) {
        const isNew = outcome.id.includes('-');
        const allSkillIds = outcome.associatedSkills;

        const skillIds = allSkillIds.map(id => id);

        if (isNew) {
            newOutcomes.push({
                name: outcome.name,
                description: outcome.description,
                skills_id: skillIds
            });
        } else {
            existingOutcomes.push({
                [outcome.id]: skillIds
            });
        }
    }

    return {
        titleCode: generalInfo.titleCode,
        universities: Array.isArray(generalInfo.university) ? generalInfo.university : [generalInfo.university],
        centers: Array.isArray(generalInfo.centers) ? generalInfo.centers : [generalInfo.centers],
        name: generalInfo.memoryName,
        academicLevel: generalInfo.academicLevel,
        branch: generalInfo.academicReign,
        academicField: generalInfo.academicScope,
        status: 'Activo',
        yearDelivery: generalInfo.year,
        totalCredits:
            Number(
                Number(credits.basic).toFixed(0) +
                Number(credits.mandatory).toFixed(0) +
                Number(credits.optional).toFixed(0) +
                Number(credits.finalWork).toFixed(0)
            ),
        distributedCredits: {
            'Básicos': credits.basic,
            'Obligatoria': credits.mandatory,
            'Optativa': credits.optional,
            'Trabajo Fin de Carrera': credits.finalWork
        },
        existingSkills,
        skills: newSkills,
        existinglearningOutcomes: existingOutcomes,
        learningOutcomes: newOutcomes
    };
}

function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
