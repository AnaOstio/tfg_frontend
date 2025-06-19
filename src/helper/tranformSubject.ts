export function transformSubject(
    generalInfo: any,
    skills: any[],
    outcomes: any[],
    skillHours: Record<string, number>,
    titleMemoryId: string
): any {
    return {
        code: generalInfo.subjectCode,
        name: generalInfo.subjectName,
        credits: generalInfo.credits,
        type: generalInfo.type,
        titleMemoryId,
        // Reducimos el array de skills a un objeto { [skillId]: horas }
        skills: skills.reduce<Record<string, number>>((acc, { _id }) => {
            acc[_id] = skillHours[_id] ?? 0;
            return acc;
        }, {}),
        learningsOutcomes: outcomes.map(o => o._id),
        nature: generalInfo.type,
        year: parseInt(generalInfo.academicYear, 10),
        duration: generalInfo.temporality,
        isKey: generalInfo.isKey,
        parentSubject: generalInfo.materia,
        activities: {
            theoryHours: generalInfo.theoryHours,
            practiceHours: generalInfo.practiceHours,
            labHours: generalInfo.labHours,
            tutorialHours: generalInfo.tutorialHours,
        },
    };
}
