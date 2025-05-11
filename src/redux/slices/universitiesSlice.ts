import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface UniversityData {
    universidad: string;
    cantidad_centros: number;
    centros: string[];
}

interface UniversitiesState {
    data: UniversityData[];
    loading: boolean;
    error: string | null;
}

const initialState: UniversitiesState = {
    data: [],
    loading: false,
    error: null,
};

// Thunk para cargar el JSON al iniciar la app
export const fetchUniversities = createAsyncThunk<
    UniversityData[],
    void,
    { rejectValue: string }
>('universities/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch('/universidades.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = (await response.json()) as UniversityData[];
        return json;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

const universitiesSlice = createSlice({
    name: 'universities',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUniversities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchUniversities.fulfilled,
                (state, action: PayloadAction<UniversityData[]>) => {
                    state.loading = false;
                    state.data = action.payload;
                }
            )
            .addCase(fetchUniversities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Error desconocido';
            });
    },
});

export default universitiesSlice.reducer;

export const selectUniversitiesData = (state: RootState) => state.universities.data;
export const selectUniversitiesLoading = (state: RootState) => state.universities.loading;
export const selectUniversitiesError = (state: RootState) => state.universities.error;