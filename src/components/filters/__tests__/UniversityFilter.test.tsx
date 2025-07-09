import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('react-redux', () => ({
    useSelector: vi.fn(),
}))

import { useSelector } from 'react-redux'
import UniversityFilter from '../UniversityFilter'

const universitiesDataMock = [
    { universidad: 'UniA', centros: ['CenA1', 'CenA2', 'CenA3', 'CenA4'] },
    { universidad: 'UniB', centros: ['CenB1'] },
    { universidad: 'UniC', centros: [] },
    { universidad: 'UniD', centros: [] },
    { universidad: 'UniE', centros: [] },
    { universidad: 'UniF', centros: [] },
]

describe('UniversityFilter', () => {
    const onUniversityChange = vi.fn()
    const onCenterChange = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
            // Hacemos que cualquier selector devuelva nuestro array
            ; (useSelector as vi.Mock).mockReturnValue(universitiesDataMock)
    })

    it('renderiza las primeras 5 universidades inicialmente', async () => {
        render(
            <UniversityFilter
                selectedUniversities={[]}
                selectedCenters={[]}
                onUniversityChange={onUniversityChange}
                onCenterChange={onCenterChange}
            />
        )
        await waitFor(() => {
            ['UniA', 'UniB', 'UniC', 'UniD', 'UniE'].forEach(uni => {
                expect(screen.getByLabelText(uni)).toBeInTheDocument()
            })
            expect(screen.queryByLabelText('UniF')).not.toBeInTheDocument()
        })
    })

    it('llama onUniversityChange al hacer click en una universidad', async () => {
        render(
            <UniversityFilter
                selectedUniversities={[]}
                selectedCenters={[]}
                onUniversityChange={onUniversityChange}
                onCenterChange={onCenterChange}
            />
        )
        const uniACheck = await screen.findByLabelText('UniA')
        fireEvent.click(uniACheck)
        expect(onUniversityChange).toHaveBeenCalledWith(['UniA'])
    })

    it('filtra universidades según término de búsqueda', async () => {
        render(
            <UniversityFilter
                selectedUniversities={[]}
                selectedCenters={[]}
                onUniversityChange={onUniversityChange}
                onCenterChange={onCenterChange}
            />
        )
        const searchInput = screen.getByPlaceholderText('Buscar universidad o centro...')
        fireEvent.change(searchInput, { target: { value: 'UniB' } })
        await waitFor(() => {
            expect(screen.getByLabelText('UniB')).toBeInTheDocument()
            expect(screen.queryByLabelText('UniA')).not.toBeInTheDocument()
        })
    })

    it('muestra los 3 primeros centros y toggle "Ver más"/"Ver menos"', async () => {
        render(
            <UniversityFilter
                selectedUniversities={['UniA']}
                selectedCenters={[]}
                onUniversityChange={onUniversityChange}
                onCenterChange={onCenterChange}
            />
        )

        // Comprobamos los 3 primeros y el botón "Ver más..."
        await waitFor(() => {
            ['CenA1', 'CenA2', 'CenA3'].forEach(c =>
                expect(screen.getByLabelText(c)).toBeInTheDocument()
            )
            expect(screen.queryByLabelText('CenA4')).not.toBeInTheDocument()
            expect(screen.getByText('Ver más...')).toBeInTheDocument()
        })

        // Hacemos click y añadimos el punto y coma para separar la sentencia
        fireEvent.click(screen.getByText('Ver más...'));

        // Ahora esperamos a que aparezca el cuarto centro y el texto cambie
        await waitFor(() => {
            expect(screen.getByLabelText('CenA4')).toBeInTheDocument()
            expect(screen.getByText('Ver menos')).toBeInTheDocument()
        })
    })


    it('llama onCenterChange al clickear un centro', async () => {
        render(
            <UniversityFilter
                selectedUniversities={['UniA']}
                selectedCenters={[]}
                onUniversityChange={onUniversityChange}
                onCenterChange={onCenterChange}
            />
        )
        const cenA1 = await screen.findByLabelText('CenA1')
        fireEvent.click(cenA1)
        expect(onCenterChange).toHaveBeenCalledWith(['CenA1'])
    })

    it('togglea "Ver más universidades..." mostrando todos los ítems', async () => {
        const { container } = render(
            <UniversityFilter
                selectedUniversities={[]}
                selectedCenters={[]}
                onUniversityChange={onUniversityChange}
                onCenterChange={onCenterChange}
            />
        )
        await waitFor(() => {
            expect(screen.queryByLabelText('UniF')).not.toBeInTheDocument()
        })
        fireEvent.click(screen.getByText('Ver más universidades...'))
        await waitFor(() => {
            expect(screen.getByLabelText('UniF')).toBeInTheDocument()
            expect(screen.getByText('Ver menos universidades')).toBeInTheDocument()
        })
    })
})
