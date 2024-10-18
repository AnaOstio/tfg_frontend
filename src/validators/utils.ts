
/**
 * Metodo que valida si un campo esta vacio
 * @param value 
 * @returns 
 */
export function isFieldEmpty(value: string | null | undefined): boolean {
    return value === null || value === undefined || value.trim() === '';
}

/**
 * Metodo que valida si un email es valido
 * @param email 
 * @returns 
 */
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
