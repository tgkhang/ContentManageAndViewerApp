import { BrowserRouter } from "react-router";
import { AuthProvider } from "./contexts/JWTContext";
import Router from "./routes/mainRouter";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
