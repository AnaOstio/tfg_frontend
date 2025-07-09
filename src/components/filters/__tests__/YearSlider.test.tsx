// src/components/filters/__tests__/YearSlider.test.tsx
import '@testing-library/jest-dom'
import React from 'react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import YearSlider from '../YearFilter'

beforeAll(() => {
    if (!window.matchMedia) {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: (query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => { },      // deprecated
                removeListener: () => { },   // deprecated
                addEventListener: () => { },
                removeEventListener: () => { },
                dispatchEvent: () => false,
            }),
        })
    }
})


// Año actual para los marks
const currentYear = new Date().getFullYear()

describe('YearSlider', () => {
    it('muestra las marcas de 2000 y el año actual', () => {
        render(<YearSlider value={[2005, 2020]} onChange={vi.fn()} />)

        expect(screen.getByText('2000')).toBeInTheDocument()
        expect(screen.getByText(currentYear.toString())).toBeInTheDocument()
    })

    it('muestra el rango inicial en los textos de Año mínimo y Año máximo', () => {
        render(<YearSlider value={[2005, 2020]} onChange={vi.fn()} />)

        expect(screen.getByText('Año mínimo: 2005')).toBeInTheDocument()
        expect(screen.getByText('Año máximo: 2020')).toBeInTheDocument()
    })
})
