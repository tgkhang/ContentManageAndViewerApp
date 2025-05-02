import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Router from "./routes/mainRouter";
import { AuthProvider } from "./contexts/JWTContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
