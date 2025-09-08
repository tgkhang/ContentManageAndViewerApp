import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Router from "./routes/mainRouter";
import { AuthProvider } from "./contexts/JWTContext";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
