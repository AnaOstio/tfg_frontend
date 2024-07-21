import { createTheme } from '@mui/material/styles'

export const lightTheme = createTheme({
    palette: {
        primary: {
            main: '#232CBE', // Color principal para el fondo #DEDEDE
        },
        secondary: {
            main: '#33365A', // Color secundario para el fondo #DEDEDE
        },
        background: {
            default: '#DEDEDE', // Color de fondo
        },
        text: {
            primary: '#EDEFF2', // Color del texto de los botones principales
            secondary: '#EDEFF2', // Color del texto de los botones secundarios
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.MuiButton-primary': {
                        color: '#EDEFF2', // Color del texto en botones principales
                        backgroundColor: '#232CBE', // Color del botón principal
                    },
                    '&.MuiButton-secondary': {
                        color: '#EDEFF2', // Color del texto en botones secundarios
                        backgroundColor: '#33365A', // Color del botón secundario
                    },
                },
            },
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        primary: {
            main: '#69B6D7', // Color principal para el fondo negro
        },
        secondary: {
            main: '#95B1BE', // Color secundario para el fondo negro
        },
        background: {
            default: '#000000', // Color de fondo
        },
        text: {
            primary: '#69B6D7', // Color del texto de los botones principales
            secondary: '#95B1BE', // Color del texto de los botones secundarios
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.MuiButton-primary': {
                        color: '#69B6D7', // Color del texto en botones principales
                        backgroundColor: '#69B6D7', // Color del botón principal
                    },
                    '&.MuiButton-secondary': {
                        color: '#95B1BE', // Color del texto en botones secundarios
                        backgroundColor: '#95B1BE', // Color del botón secundario
                    },
                },
            },
        },
    },
});
