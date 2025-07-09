// src/components/filters/__tests__/UniversitySelector.test.tsx
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { UniversitySelector } from '../UniveristySelector'

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


describe('UniversitySelector', () => {
    const universities = ['UniA', 'UniB', 'UniC']
    let onSelect: ReturnType<typeof vi.fn>
    let onRemove: ReturnType<typeof vi.fn>

    beforeEach(() => {
        onSelect = vi.fn()
        onRemove = vi.fn()
    })

    it('muestra placeholder y está deshabilitado mientras carga', () => {
        render(
            <UniversitySelector
                universities={universities}
                selected={[]}
                loading={true}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        const selector = screen.getByRole('combobox')
        expect(selector).toBeDisabled()
        expect(screen.getByText('Buscar universidad...')).toBeInTheDocument()
    })

    it('abre dropdown y muestra opciones cuando no carga', () => {
        render(
            <UniversitySelector
                universities={universities}
                selected={[]}
                loading={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        const selector = screen.getByRole('combobox')
        fireEvent.mouseDown(selector)
        const options = screen.getAllByRole('option')
        expect(options).toHaveLength(2)
    })

    it('filtra opciones según término de búsqueda', async () => {
        render(
            <UniversitySelector
                universities={universities}
                selected={[]}
                loading={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        const selector = screen.getByRole('combobox')
        fireEvent.mouseDown(selector)
        const input = document.querySelector(
            'input.ant-select-selection-search-input'
        ) as HTMLInputElement
        fireEvent.change(input, { target: { value: 'UniB' } })

        await waitFor(() => {
            const options = screen.getAllByRole('option')
            expect(options).toHaveLength(1)
            expect(options[0].textContent).toBe('UniB')
        })
    })

    it('llama onSelect al elegir una opción', async () => {
        render(
            <UniversitySelector
                universities={universities}
                selected={[]}
                loading={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        const selector = screen.getByRole('combobox')
        fireEvent.mouseDown(selector)
        const option = await screen.findByText('UniC')
        fireEvent.click(option)
        expect(onSelect).toHaveBeenCalled()
        const call = onSelect.mock.calls[0]
        expect(call[0]).toBe('UniC')
    })

    it('muestra mensaje de error y ayuda cuando no hay universidades seleccionadas', () => {
        const { container } = render(
            <UniversitySelector
                universities={universities}
                selected={[]}
                loading={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        expect(
            screen.getByText('Seleccione al menos una universidad')
        ).toBeInTheDocument()
        expect(container.querySelector('.ant-form-item-has-error')).toBeInTheDocument()
    })

    it('no muestra error cuando hay universidades seleccionadas', () => {
        const { container } = render(
            <UniversitySelector
                universities={universities}
                selected={['UniA']}
                loading={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        expect(
            screen.queryByText('Seleccione al menos una universidad')
        ).not.toBeInTheDocument()
        expect(container.querySelector('.ant-form-item-has-error')).not.toBeInTheDocument()
        expect(screen.getByText('UniA')).toBeInTheDocument()
    })

    it('llama onRemove al cerrar un Tag', () => {
        render(
            <UniversitySelector
                universities={universities}
                selected={['UniX', 'UniY']}
                loading={false}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        )
        const closeIcons = screen.getAllByLabelText('close')
        fireEvent.click(closeIcons[0])
        expect(onRemove).toHaveBeenCalledWith('UniX')
        fireEvent.click(closeIcons[1])
        expect(onRemove).toHaveBeenCalledWith('UniY')
    })
})
