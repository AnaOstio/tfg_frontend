import { useNavigate } from "react-router-dom";
import { transformSubject } from "../helper/tranformSubject";
import { useMutation } from "@tanstack/react-query";
import { titleSubjectsCreate, titleSubjectsDelete, titleSubjectsGetById, titleSubjectsGetByTitleMemoryId, titleSubjectsUpdate } from "../api/subjects";
import { toast } from "react-toastify";

export const useSubjectsCreate = () => {
    const navigate = useNavigate();
    return useMutation<any, Error, any>({
        mutationFn: (data) => {
            const transformed = transformSubject(data.generalInfo, data.skills, data.outcomes, data.skillHours, data.titleMemoryId);
            return titleSubjectsCreate(transformed);
        },
        onSuccess: (data) => {
            navigate('/title-memory/details/' + data.titleMemoryId);
            console.log('Memoria de título creada:', data);
            toast.success('Memoria de título creada con éxito');
        },
        onError: (error) => {
            toast.error('Error al crear la memoria de título');
            console.error('Error:', error);
        },
    });
}

export const useGetSubjectsByTitleMemoryId = (titleMemoryId: string) => {
    const navigate = useNavigate();
    return useMutation<any, Error, any>({
        mutationFn: () => {
            return titleSubjectsGetByTitleMemoryId(titleMemoryId);
        },
        onSuccess: (data) => {
            console.log('Materias obtenidas:', data);
        },
        onError: (error) => {
            navigate('/not-found');
            toast.error('Error al obtener las materias');
            console.error('Error:', error);
        },
    });
}

export const useGetSubjectById = (subjectId: string) => {
    const navigate = useNavigate();
    return useMutation<any, Error, any>({
        mutationFn: () => {
            return titleSubjectsGetById(subjectId);
        },
        onSuccess: (data) => {
            console.log('Materia obtenida:', data);
        },
        onError: (error) => {
            navigate('/not-found');
            toast.error('Error al obtener la materia');
            console.error('Error:', error);
        },
    });
}

export const useSubjectsUpdate = () => {
    const navigate = useNavigate();
    return useMutation<any, Error, any>({
        mutationFn: (data) => {
            const transformed = transformSubject(data.generalInfo, data.skills, data.outcomes, data.skillHours, data.titleMemoryId);
            return titleSubjectsUpdate(data.id, transformed);
        },
        onSuccess: (data) => {
            navigate('/title-memory/details/' + data.titleMemoryId);
            console.log('Materia actualizada:', data);
            toast.success('Materia actualizada con éxito');
        },
        onError: (error) => {
            toast.error('Error al actualizar la materia');
            console.error('Error:', error);
        },
    });
}

export const useSubjectsDelete = () => {
    return useMutation<any, Error, string>({
        mutationFn: (subjectId) => {
            return titleSubjectsDelete(subjectId);
        },
        onSuccess: (data) => {
            console.log('Materia eliminada:', data);
            toast.success('Materia eliminada con éxito');
        },
        onError: (error) => {
            toast.error('Error al eliminar la materia');
            console.error('Error:', error);
        },
    });
}