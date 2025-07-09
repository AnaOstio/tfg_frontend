import '@testing-library/jest-dom'
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('../AcademicField', () => ({
    __esModule: true,
    default: ({ onChange }: any) => (
        <button
            data-testid="academic-field"
            onClick={() => onChange(['campo'])}
        >
            AcademicFieldFilter Stub
        </button>
    ),
}))

vi.mock('../UniversityFilter', () => ({
    __esModule: true,
    default: ({ onUniversityChange, onCenterChange }: any) => (
        <div>
            <button
                data-testid="uni-btn"
                onClick={() => onUniversityChange(['UniX'])}
            >
                UniversityFilter Stub
            </button>
            <button
                data-testid="center-btn"
                onClick={() => onCenterChange(['CentroY'])}
            >
                CenterFilter Stub
            </button>
        </div>
    ),
}))

vi.mock('../YearFilter', () => ({
    __esModule: true,
    default: ({ onChange }: any) => (
        <button
            data-testid="year-slider"
            onClick={() => onChange([1990, 2025])}
        >
            YearSlider Stub
        </button>
    ),
}))

// 2) Ahora sí importamos el componente bajo test
import GeneralFilters from '../GeneralFilters'
import { ACADEMIC_BRANCHES, ACADEMIC_LEVEL } from '../../../utils/const'

describe('GeneralFilters', () => {
    let onFilterChange: ReturnType<typeof vi.fn>
    const defaultFilters = {
        titleName: [''],
        academicLevel: [] as string[],
        branchAcademic: [] as string[],
        academicFields: [] as string[],
        universities: [] as string[],
        centers: [] as string[],
        year: [0, 0] as [number, number],
    }

    beforeEach(() => {
        onFilterChange = vi.fn()
        render(
            <GeneralFilters
                filters={defaultFilters}
                onFilterChange={onFilterChange}
            />
        )
    })

    it('renderiza el input de búsqueda con placeholder correcto', () => {
        expect(
            screen.getByPlaceholderText('Buscar universidad o centro...')
        ).toBeInTheDocument()
    })

    it('llama onFilterChange al cambiar el input de título', () => {
        const input = screen.getByPlaceholderText(
            'Buscar universidad o centro...'
        ) as HTMLInputElement
        fireEvent.change(input, { target: { value: 'Mi tesis' } })
        expect(onFilterChange).toHaveBeenCalledWith('titleName', ['Mi tesis'])
    })

    it('renderiza y llama onFilterChange para Nivel Académico', () => {
        const label = ACADEMIC_LEVEL[0]
        const checkbox = screen.getByLabelText(label)
        fireEvent.click(checkbox)
        expect(onFilterChange).toHaveBeenCalledWith('academicLevel', [label])
    })

    it('renderiza y llama onFilterChange para Rama Académica', () => {
        const label = ACADEMIC_BRANCHES[0]
        const checkbox = screen.getByLabelText(label)
        fireEvent.click(checkbox)
        expect(onFilterChange).toHaveBeenCalledWith('branchAcademic', [label])
    })

    it('renderiza el AcademicFieldFilter y llama onFilterChange', () => {
        fireEvent.click(screen.getByTestId('academic-field'))
        expect(onFilterChange).toHaveBeenCalledWith('academicFields', ['campo'])
    })

    it('renderiza UniversityFilter y llama onFilterChange para universidades y centros', () => {
        fireEvent.click(screen.getByTestId('uni-btn'))
        expect(onFilterChange).toHaveBeenCalledWith('universities', ['UniX'])

        fireEvent.click(screen.getByTestId('center-btn'))
        expect(onFilterChange).toHaveBeenCalledWith('centers', ['CentroY'])
    })

    it('renderiza YearSlider y llama onFilterChange al cambiar año', () => {
        fireEvent.click(screen.getByTestId('year-slider'))
        expect(onFilterChange).toHaveBeenCalledWith('year', [1990, 2025])
    })
})
