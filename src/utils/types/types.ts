export interface UniversityData {
    universidad: string;
    cantidad_centros: number;
    centros: string[];
}

export type UniversitiesState = UniversityData[];