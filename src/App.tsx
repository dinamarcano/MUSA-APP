import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate} from "react-router-dom";
import Navbar from "./Components/Navbar_temp";
import Board from "./Components/Boards";
import Profile from "./Components/Profile";
import Preferences from "./Components/Preferences";
import Sidebar from "./Components/Sidebar";
import Bookmarks from "./Components/Bookmarks";
import PostDetail from "./pages/PostDetails";
import './index.css'
import Login from "./Components/Login";
import ResetPassword from "./Components/ResetPasword";
import React from "react";
import Gallery from "./Components/Gallery/Gallery";
import Preferencias from "./Components/Preferences";
import CreateAccount from "./Components/CreateAccount";

let currentDashboardPage: "boards" | "profile" | "preferences" | "bookmarks" = "boards";

let isAuthenticated = false;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardPage, setDashboardPage] = useState<"boards" | "profile" | "preferences" | "bookmarks">(currentDashboardPage);

  React.useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      setDashboardPage(event.detail);
      currentDashboardPage = event.detail;
    };

    window.addEventListener('dashboard-navigate', handleNavigation as EventListener);
    return () => window.removeEventListener('dashboard-navigate', handleNavigation as EventListener);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        setPage={(page) => {
          setDashboardPage(page);
          currentDashboardPage = page;
        }} 
        onGoToMain={() => navigate('/')} 
      />

      <div className="flex-1 flex flex-col">
        <Navbar onGoToMain={() => navigate('/')} />
        <main className="flex-1 p-6 overflow-y-auto">
          {dashboardPage === "boards" && <Board />}
          {dashboardPage === "profile" && <Profile />}
          {dashboardPage === "preferences" && <Preferences onContinue={function (): void {
            throw new Error("Function not implemented.");
          } } />}
          {dashboardPage === "bookmarks" && <Bookmarks />}
        </main>
      </div>
    </div>
  );
};

const MainPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-red-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar onGoToMain={() => navigate('/')} />
      </header>

      <main className="flex flex-1">
        <aside className="w-16 bg-white border-r hidden md:block">
          <Sidebar 
            setPage={(page) => {
              currentDashboardPage = page;
              navigate('/dashboard');
            }} 
            onGoToMain={() => navigate('/')} 
          />
        </aside>

        <section className="flex-1 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
          <Gallery />
        </section>
      </main>

      <div className="md:hidden">
        <Sidebar 
          setPage={(page) => {
            currentDashboardPage = page;
            navigate('/dashboard');
          }} 
          onGoToMain={() => navigate('/')} 
        />
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export default function App() {
  const handleLogin = () => {
    isAuthenticated = true;
  };

  const handleCreateAccount = () => {
    // Lógica para crear cuenta
    console.log('Cuenta creada exitosamente');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login onLogin={handleLogin} />
              </PublicRoute>
            } 
          />
          <Route 
            path="/create-account" 
            element={
              <PublicRoute>
                <CreateAccount onContinue={handleCreateAccount} />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/preferencias" 
            element={
              <PublicRoute>
                <Preferencias onContinue={handleLogin} />
              </PublicRoute>
            } 
          />

          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainPageWrapper />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/post/:id" 
            element={
              <ProtectedRoute>
                <PostDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}