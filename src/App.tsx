import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./Components/Navbar_temp";
import Board from "./Components/Boards";
import Profile from "./Components/Profile";
import Preferences from "./Components/Preferences";
import Sidebar from "./Components/Sidebar";
import Bookmarks from "./Components/Bookmarks";
import "./index.css";
import Login from "./Components/Login";
import ResetPassword from "./Components/ResetPasword";
import Gallery from "./Components/Gallery/GlobalGallery";
import CreateAccount from "./Components/CreateAccount";
import PostDetails from "./Components/PostDetails";
import PostDetailPage from "./pages/PostDetailPage";
import SearchResults from "./Components/SearchResults";
import SearchPostDetailPage from "./Components/SearchPostDetailPage";
import PostsList from "./Components/PostsList";

export interface SearchResult {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
}

let currentDashboardPage: "boards" | "profile" | "preferences" | "bookmarks" =
  "boards";

// Página principal con búsqueda
const MainPageWithSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearch, setCurrentSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = (
    results: SearchResult[],
    searchTerm: string
  ) => {
    setSearchResults(results);
    setCurrentSearch(searchTerm);
    setIsSearching(true);
  };

  const handleGoToMain = () => {
    setIsSearching(false);
    setSearchResults([]);
    setCurrentSearch("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-red-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar
          onGoToMain={() => {
            handleGoToMain();
            navigate("/");
          }}
          onSearchResults={handleSearchResults}
        />
      </header>

      <main className="flex flex-1">
        <aside className="w-16 bg-white border-r hidden md:block">
          <Sidebar
            setPage={(page) => {
              currentDashboardPage = page;
              navigate("/dashboard", { state: { page } });
            }}
            onGoToMain={() => {
              handleGoToMain();
              navigate("/");
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
            navigate("/dashboard", { state: { page } });
          }}
          onGoToMain={() => {
            handleGoToMain();
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};

// Dashboard con búsqueda y navegación interna
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as {
    state?: { page?: "boards" | "profile" | "preferences" | "bookmarks" };
  };

  const initialPage =
    location.state?.page ?? currentDashboardPage ?? "boards";

  const [dashboardPage, setDashboardPage] = useState<
    "boards" | "profile" | "preferences" | "bookmarks"
  >(initialPage);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearch, setCurrentSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = (
    results: SearchResult[],
    searchTerm: string
  ) => {
    setSearchResults(results);
    setCurrentSearch(searchTerm);
    setIsSearching(true);
  };

  const handleGoToMain = () => {
    setIsSearching(false);
    setSearchResults([]);
    setCurrentSearch("");
  };

  // Escucha de navegación interna (evento dashboard-navigate desde Sidebar)
  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      setDashboardPage(event.detail);
      currentDashboardPage = event.detail;
    };

    window.addEventListener(
      "dashboard-navigate",
      handleNavigation as EventListener
    );
    return () =>
      window.removeEventListener(
        "dashboard-navigate",
        handleNavigation as EventListener
      );
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
          navigate("/");
        }}
      />

      <div className="flex-1 flex flex-col">
        <Navbar
          onGoToMain={() => {
            handleGoToMain();
            navigate("/");
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
              {dashboardPage === "preferences" && (
                <Preferences onContinue={() => {}} />
              )}
              {dashboardPage === "bookmarks" && <Bookmarks />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// Rutas protegidas con Supabase AuthContext
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando sesión...
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando sesión...
      </div>
    );
  }

  return !user ? <>{children}</> : <Navigate to="/" replace />;
};

export default function App() {
  const handleLogin = () => {};
  const handleCreateAccount = () => {};

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

          <Route
            path="/post/:id"
            element={
              <ProtectedRoute>
                <PostDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search-post/:id"
            element={
              <ProtectedRoute>
                <SearchPostDetailPage />
              </ProtectedRoute>
            }
          />

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
