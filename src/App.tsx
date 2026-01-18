import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { AuthProvider } from "./context/AuthContext";
import { CommentProvider } from "./context/CommentContext";
import { SocketProvider } from "./context/SocketContext";
import { Home } from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CommentProvider>
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
        </CommentProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
