import { createTheme } from "@mui/material/styles";

const sharedStyles = {
  componentStyles: {
    // Header: {
    //   desktop: {
    //     height: "100px"
    //   },
    //   mobile: {
    //     height: "50px"
    //   }
    // }
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
