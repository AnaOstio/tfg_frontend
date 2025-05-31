import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ACADEMIC_FIELDS } from '../../../utils/const'
import AcademicFieldFilter from '../AcademicField'

describe('AcademicFieldFilter', () => {
    const setup = (value: string[] = []) => {
        const handleChange = vi.fn()
        render(<AcademicFieldFilter value={value} onChange={handleChange} />)
        return { handleChange }
    }

    it('should render first 5 academic fields initially', () => {
        setup()
        ACADEMIC_FIELDS.slice(0, 5).forEach(field => {
            expect(screen.getByLabelText(field)).toBeInTheDocument()
        })
        expect(screen.queryByLabelText(ACADEMIC_FIELDS[5])).not.toBeInTheDocument()
    })

    it('should call onChange when a checkbox is clicked', () => {
        const { handleChange } = setup()
        const checkbox = screen.getByLabelText(ACADEMIC_FIELDS[0])
        fireEvent.click(checkbox)
        expect(handleChange).toHaveBeenCalled()
    })

    it('should show all fields when "Ver más..." is clicked', () => {
        setup()
        fireEvent.click(screen.getByText('Ver más...'))
        ACADEMIC_FIELDS.forEach(field => {
            expect(screen.getByLabelText(field)).toBeInTheDocument()
        })
    })

    it('should collapse fields when "Ver menos" is clicked', () => {
        setup()
        const toggleButton = screen.getByText('Ver más...')
        fireEvent.click(toggleButton)
        fireEvent.click(screen.getByText('Ver menos'))
        expect(screen.queryByLabelText(ACADEMIC_FIELDS[5])).not.toBeInTheDocument()
    })
})
