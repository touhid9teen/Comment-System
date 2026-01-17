import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { AuthProvider } from "./context/AuthContext";
import { Home } from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
