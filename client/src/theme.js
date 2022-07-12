import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    margin: 0,
                    padding: 0,
                    boxSizing: 'border-box'
                },
                a: {
                    textDecoration: 'none'
                },
            }
        }
    },
    palette: {
        primary: {
            main: '#ed3434',
            contrastText: '#fff',
            hover: '#cc2d2d',
        },
        secondary: {
            main: '#2c37c9'
        },
        tertiary: {
            main: '#ededed',
            contrastText: '#403a3a',
            hover: '#cfcccc'
        },
        error: {
            main: '#c62828',
            contrastText: 'white',
        },
        warning: {
            main: '#e65100',
            contrastText: 'white',
        },
        info: {
            main: '#23ba3a',
            contrastText: 'white',
            hover: '#1e9e31'
        },
        success: {
            main: '#24962d',
            contrastText: 'white',
        },
        openTitle: '#031b36',
    }
})

export default theme