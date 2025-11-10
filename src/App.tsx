import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate} from "react-router-dom";
import Navbar from "./Components/Navbar_temp";
import Board from "./Components/Boards";
import Profile from "./Components/Profile";
import Preferences from "./Components/Preferences";
import Sidebar from "./Components/Sidebar";
import Bookmarks from "./Components/Bookmarks";
import './index.css'
import Login from "./Components/Login";
import ResetPassword from "./Components/ResetPasword";
import React from "react";
import Gallery from "./Components/Gallery/Gallery";
import CreateAccount from "./Components/CreateAccount";
import PostDetails from "./Components/PostDetails";
import PostDetailPage from "./pages/PostDetailPage";
import SearchResults from "./Components/SearchResults"; 

export interface SearchResult {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
}

let currentDashboardPage: "boards" | "profile" | "preferences" | "bookmarks" = "boards";
let isAuthenticated = false;

// Componente para la página principal con búsqueda
const MainPageWithSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearch, setCurrentSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = (results: SearchResult[], searchTerm: string) => {
    setSearchResults(results);
    setCurrentSearch(searchTerm);
    setIsSearching(true);
  };

  const handleGoToMain = () => {
    setIsSearching(false);
    setSearchResults([]);
    setCurrentSearch('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-red-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar 
          onGoToMain={() => {
            handleGoToMain();
            navigate('/');
          }}
          onSearchResults={handleSearchResults}
        />
      </header>

      <main className="flex flex-1">
        <aside className="w-16 bg-white border-r hidden md:block">
          <Sidebar 
            setPage={(page) => {
              currentDashboardPage = page;
              navigate('/dashboard');
            }} 
            onGoToMain={() => {
              handleGoToMain();
              navigate('/');
            }} 
          />
        </aside>

        <section className="flex-1 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
          {isSearching ? (
            <SearchResults 
              results={searchResults} 
              searchTerm={currentSearch} 
            />
          ) : (
            <Gallery />
          )}
        </section>
      </main>

      <div className="md:hidden">
        <Sidebar 
          setPage={(page) => {
            currentDashboardPage = page;
            navigate('/dashboard');
          }} 
          onGoToMain={() => {
            handleGoToMain();
            navigate('/');
          }} 
        />
      </div>
    </div>
  );
};

// Dashboard con funcionalidad de búsqueda
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardPage, setDashboardPage] = useState<"boards" | "profile" | "preferences" | "bookmarks">(currentDashboardPage);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearch, setCurrentSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = (results: SearchResult[], searchTerm: string) => {
    setSearchResults(results);
    setCurrentSearch(searchTerm);
    setIsSearching(true);
  };

  const handleGoToMain = () => {
    setIsSearching(false);
    setSearchResults([]);
    setCurrentSearch('');
  };

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
        onGoToMain={() => {
          handleGoToMain();
          navigate('/');
        }} 
      />

      <div className="flex-1 flex flex-col">
        <Navbar 
          onGoToMain={() => {
            handleGoToMain();
            navigate('/');
          }}
          onSearchResults={handleSearchResults}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          {isSearching ? (
            <SearchResults 
              results={searchResults} 
              searchTerm={currentSearch} 
            />
          ) : (
            <>
              {dashboardPage === "boards" && <Board />}
              {dashboardPage === "profile" && <Profile />}
              {dashboardPage === "preferences" && <Preferences onContinue={() => {}} />}
              {dashboardPage === "bookmarks" && <Bookmarks />}
            </>
          )}
        </main>
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
                <Preferences onContinue={handleLogin} />
              </PublicRoute>
            } 
          />

          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainPageWithSearch />
              </ProtectedRoute>
            } 
          />
          {/* Main gallery post detail (local artworks) */}
          <Route
            path="/post/:id"
            element={
              <ProtectedRoute>
                <PostDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Profile post detail (json-server posts) */}
          <Route
            path="/post/profile/:postId"
            element={
              <ProtectedRoute>
                <PostDetails />
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