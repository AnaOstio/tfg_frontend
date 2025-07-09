import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'

beforeAll(() => {
    if (!window.matchMedia) {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: (query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => { },
                removeListener: () => { },
                addEventListener: () => { },
                removeEventListener: () => { },
                dispatchEvent: () => false,
            }),
        })
    }
})

import { CenterSelector } from '../CenterSelector'

describe('CenterSelector', () => {
    const centers = ['Cen1', 'Cen2', 'Cen3']
    let onSelect: ReturnType<typeof vi.fn>
    let onRemove: ReturnType<typeof vi.fn>

    beforeEach(() => {
        onSelect = vi.fn()
        onRemove = vi.fn()
    })

    it('muestra placeholder deshabilitado cuando disabled=true', () => {
        render(
            <CenterSelector
                centers={centers}
                selected={[]}
                disabled={true}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        expect(
            screen.getByText('Seleccione universidades primero')
        ).toBeInTheDocument()
    })

    it('muestra placeholder de búsqueda cuando disabled=false', () => {
        render(
            <CenterSelector
                centers={centers}
                selected={[]}
                disabled={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        expect(screen.getByText('Buscar centro...')).toBeInTheDocument()
    })

    it('abre dropdown y muestra opciones disponibles', () => {
        render(
            <CenterSelector
                centers={centers}
                selected={[]}
                disabled={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        const selector = screen.getByRole('combobox')
        fireEvent.mouseDown(selector)
        const options = screen.getAllByRole('option')
        expect(options).toHaveLength(2)
    })

    it('filtra opciones en función del input', async () => {
        render(
            <CenterSelector
                centers={centers}
                selected={[]}
                disabled={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        const selector = screen.getByRole('combobox')
        fireEvent.mouseDown(selector)
        const input = document.querySelector(
            'input.ant-select-selection-search-input'
        ) as HTMLInputElement
        fireEvent.change(input, { target: { value: '2' } })

        await waitFor(() => {
            const options = screen.getAllByRole('option')
            expect(options).toHaveLength(1)
            expect(options[0].textContent).toBe('Cen2')
        })
    })

    it('llama onSelect al elegir una opción', async () => {
        render(
            <CenterSelector
                centers={centers}
                selected={[]}
                disabled={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        const selector = screen.getByRole('combobox')
        fireEvent.mouseDown(selector)
        const option = await screen.findByText('Cen3')
        fireEvent.click(option)
        expect(onSelect).toHaveBeenCalled()
        const call = onSelect.mock.calls[0]
        expect(call[0]).toBe('Cen3')
    })

    it('muestra mensaje de error y ayuda cuando no hay centros seleccionados', () => {
        const { container } = render(
            <CenterSelector
                centers={centers}
                selected={[]}
                disabled={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        expect(screen.getByText('Seleccione al menos un centro')).toBeInTheDocument()
        expect(container.querySelector('.ant-form-item-has-error')).toBeInTheDocument()
    })

    it('no muestra error ni ayuda cuando hay centros seleccionados', () => {
        const { container } = render(
            <CenterSelector
                centers={centers}
                selected={['Cen1']}
                disabled={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        expect(screen.queryByText('Seleccione al menos un centro')).not.toBeInTheDocument()
        expect(container.querySelector('.ant-form-item-has-error')).not.toBeInTheDocument()
        expect(screen.getByText('Cen1')).toBeInTheDocument()
    })

    it('llama onRemove al cerrar un Tag', () => {
        render(
            <CenterSelector
                centers={centers}
                selected={['CenA', 'CenB']}
                disabled={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        const closeIcons = screen.getAllByLabelText('close')
        fireEvent.click(closeIcons[0])
        expect(onRemove).toHaveBeenCalledWith('CenA')
        fireEvent.click(closeIcons[1])
        expect(onRemove).toHaveBeenCalledWith('CenB')
    })
})
