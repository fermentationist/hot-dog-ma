import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import {lightTheme, darkTheme} from "./config/themes";
import Alerts from "./components/Alerts";
import ClientRouter from "./components/ClientRouter";
import AlertStateProvider from "./context/AlertStateProvider";
import "./App.css";

const DEFAULT_THEME = "dark";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={DEFAULT_THEME === "dark" ? darkTheme : lightTheme}>
        <AlertStateProvider>
          <Router>
            <ClientRouter />
          </Router>
          <Alerts />
        </AlertStateProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
