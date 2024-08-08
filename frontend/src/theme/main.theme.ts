import { createTheme } from "@mui/material/styles";

export const mainTheme = createTheme({
	palette: {
		primary: {
			main: "#41785D",
			light: "#D3E3D5",
			dark: "#1E3E3D",
			contrastText: "#AFCDB3",
		},
		secondary: {
			main: "#424856",
			light: "#DEE1E6",
			contrastText: "#EEEBE3",
		},
		background: {
			default: "#EEEBE3",
			paper: "#FFFFFF",
		},
		warning: {
			main: "#FFE9B2",
		},
		success: {
			main: "#A3E2B5",
		},
		error: {
			main: "#fe6363",
		},
	},
	typography: {
		fontFamily: ["Manrope", "sans-serif"].join(","),
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		fontWeightBold: 700,
		fontSize: 16,
		h1: {
			fontFamily: "Lexend, sans-serif",
			fontSize: "90px",
			fontWeight: 500,
		},
		h2: {
			fontFamily: "Lexend, sans-serif",
			fontSize: "40px",
			fontWeight: 500,
		},
		h3: {
			fontFamily: "Lexend, sans-serif",
			fontSize: "34px",
			fontWeight: 500,
		},
		h4: {
			fontFamily: "Lexend, sans-serif",
			fontSize: "20px",
			fontWeight: 500,
		},
		h5: {
			fontSize: "16px",
			fontWeight: 300,
		},
		h6: {
			fontSize: "14px",
			fontWeight: 300,
		},
	},
	spacing: [0, 4, 8, 12, 16, 20, 24, 30, 38, 48, 56],
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 1024,
			lg: 1280,
			xl: 1536,
		},
	},
});
