import { useNavigate } from "react-router-dom";
import { transformSubject } from "../helper/tranformSubject";
import { useMutation } from "@tanstack/react-query";
import message from "antd/es/message";
import { titleSubjectsCreate, titleSubjectsGetByTitleMemoryId } from "../api/subjects";

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
            message.success('Memoria de título creada con éxito');
        },
        onError: (error) => {
            message.error('Error al crear la memoria de título');
            console.error('Error:', error);
        },
    });
}

export const useGetSubjectsByTitleMemoryId = (titleMemoryId: string) => {
    return useMutation<any, Error, any>({
        mutationFn: () => {
            return titleSubjectsGetByTitleMemoryId(titleMemoryId);
        },
        onSuccess: (data) => {
            console.log('Materias obtenidas:', data);
        },
        onError: (error) => {
            message.error('Error al obtener las materias');
            console.error('Error:', error);
        },
    });
}