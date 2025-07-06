export interface NormalizedSimilarity {
    key: string;
    main: {
        _id: string;
        name: string;
        description: string;
        [k: string]: any;
    };
    similars: Array<{
        other_id: string;
        name: string;
        description: string;
        similarity: number;
        seen_at: string;
        [k: string]: any;
    }>;
}

/** Normaliza la respuesta del endpoint de Skills */
export function normalizeSkills(raw: any[]): NormalizedSimilarity[] {
    return raw.map(item => ({
        key: item._id,
        main: {
            _id: item.document_id?._id || '',
            name: item.document_id?.name || '',
            description: item.document_id?.description || ''
        },
        similars: Array.isArray(item.similars)
            ? item.similars.map((s: any) => ({
                other_id: s.other_id?._id || '',
                name: s.other_id?.name || '',
                description: s.other_id?.description || '',
                similarity: s.description_similarity,
                seen_at: s.seen_at
            }))
            : []
    }));
}

/** Normaliza la respuesta del endpoint de Learning Outcomes */
export function normalizeLOs(raw: any[]): NormalizedSimilarity[] {
    return raw.map(item => {
        const arr = Array.isArray(item.similars) ? item.similars : [];
        // Si no hay similars, devolvemos main vacío y array vacío
        if (arr.length === 0) {
            const mainId = item.document_id?._id || '';
            return {
                key: item._id,
                main: { _id: mainId, name: '', description: '' },
                similars: []
            };
        }
        // Determinamos el ID principal a partir del primer lo_id
        const mainId = arr[0].lo_id;
        // Buscamos si existe una entrada cuyo other_id coincide con mainId
        const mainEntry = arr.find((s: any) => s.other_id?._id === mainId);
        const main = mainEntry?.other_id || { _id: mainId, name: '', description: '' };
        // El resto de entradas son los similars
        const similars = arr
            .filter((s: any) => s.other_id?._id !== mainId)
            .map((s: any) => ({
                other_id: s.other_id?._id || '',
                name: s.other_id?.name || '',
                description: s.other_id?.description || '',
                similarity: s.description_similarity,
                seen_at: s.seen_at
            }));
        return { key: item._id, main, similars };
    });
}