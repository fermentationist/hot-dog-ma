import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    componentStyles?: {
      [componentName: string]: {
        desktop?: {
          [key: string]: string;
        };
        mobile?: {
          [key: string]: string;
        };
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    componentStyles?: {
      [componentName: string]: {
        desktop?: {
          [key: string]: string;
        };
        mobile?: {
          [key: string]: string;
        };
      };
    };
  }
}

const sharedStyles = {
  componentStyles: {
    Header: {
      desktop: {
        height: "100px"
      },
      mobile: {
        height: "50px"
      }
    }
  }
};

export const lightTheme = createTheme({
  palette: { mode: "light" },
  ...sharedStyles
});

export const darkTheme = createTheme({
  palette: { mode: "dark" },
  ...sharedStyles
});
