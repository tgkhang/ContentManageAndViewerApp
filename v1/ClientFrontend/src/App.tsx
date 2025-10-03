import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/JWTContext";
import { HelmetProvider } from "react-helmet-async";
import Router from "./routes/MainRouter";

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
