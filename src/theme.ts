import { createTheme } from '@mui/material/styles'

const lightTheme = createTheme({
    palette: {
        primary: {
            main: '#232CBE', 
        },
        secondary: {
            main: '#33365A', 
        },
        background: {
            default: '#DEDEDE',  
        },
        text: {
            primary: '#EDEFF2',  
            secondary: '#EDEFF2',  
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.MuiButton-primary': {
                        color: '#EDEFF2', 
                        backgroundColor: '#232CBE',  
                    },
                    '&.MuiButton-secondary': {
                        color: '#EDEFF2',
                        backgroundColor: '#33365A',
                    },
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        primary: {
            main: '#69B6D7',  
        },
        secondary: {
            main: '#95B1BE',
        },
        background: {
            default: '#000000',
        },
        text: {
            primary: '#69B6D7',  
            secondary: '#95B1BE',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.MuiButton-primary': {
                        color: '#69B6D7',  
                        backgroundColor: '#69B6D7',  
                    },
                    '&.MuiButton-secondary': {
                        color: '#95B1BE',  
                        backgroundColor: '#95B1BE',  
                    },
                },
            },
        },
    },
});

export {lightTheme, darkTheme}
