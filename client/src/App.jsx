import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import SavedPostsPage from "./pages/SavedPostsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
// import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        {/* <Navbar /> */}
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute> 
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedPostsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;