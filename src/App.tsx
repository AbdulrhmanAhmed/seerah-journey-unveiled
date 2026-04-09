import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import JourneyPage from "./pages/JourneyPage";
import CharacterPage from "./pages/CharacterPage";
import MapPage from "./pages/MapPage";
import LibraryPage from "./pages/LibraryPage";
import NotFound from "./pages/NotFound";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPathsPage from "./pages/AdminPathsPage";
import AdminLocationsPage from "./pages/AdminLocationsPage";
import AdminShamailPage from "./pages/AdminShamailPage";
import AdminTimelinePage from "./pages/AdminTimelinePage";
import AdminFeedbackPage from "./pages/AdminFeedbackPage";
import AdminQuizPage from "./pages/AdminQuizPage";
import InteractiveJourneyPage from "./pages/InteractiveJourneyPage";
import BattleOfBadrPage from "./pages/BattleOfBadrPage";
import EventDetailPage from "./pages/EventDetailPage";
import EventGraphPage from "./pages/EventGraphPage";
import QuizPage from "./pages/QuizPage";
import FamilyTreePage from "./pages/FamilyTreePage";
import CompanionsPage from "./pages/CompanionsPage";
import FeedbackPage from "./pages/FeedbackPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/journey" element={<Layout><JourneyPage /></Layout>} />
              <Route path="/character" element={<Layout><CharacterPage /></Layout>} />
              <Route path="/map" element={<Layout><MapPage /></Layout>} />
              <Route path="/library" element={<Layout><LibraryPage /></Layout>} />
              <Route path="/interactive-journey" element={<Layout><InteractiveJourneyPage /></Layout>} />
              <Route path="/battle-of-badr" element={<Layout><BattleOfBadrPage /></Layout>} />
              <Route path="/event/:id" element={<Layout><EventDetailPage /></Layout>} />
              <Route path="/event-graph" element={<Layout><EventGraphPage /></Layout>} />
              <Route path="/quiz" element={<Layout><QuizPage /></Layout>} />
              <Route path="/family-tree" element={<Layout><FamilyTreePage /></Layout>} />
              <Route path="/companions" element={<Layout><CompanionsPage /></Layout>} />
              <Route path="/feedback" element={<Layout><FeedbackPage /></Layout>} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/paths" element={<AdminProtectedRoute><AdminPathsPage /></AdminProtectedRoute>} />
              <Route path="/admin/locations" element={<AdminProtectedRoute><AdminLocationsPage /></AdminProtectedRoute>} />
              <Route path="/admin/shamail" element={<AdminProtectedRoute><AdminShamailPage /></AdminProtectedRoute>} />
              <Route path="/admin/timeline" element={<AdminProtectedRoute><AdminTimelinePage /></AdminProtectedRoute>} />
              <Route path="/admin/feedback" element={<AdminProtectedRoute><AdminFeedbackPage /></AdminProtectedRoute>} />
              <Route path="/admin/quiz" element={<AdminProtectedRoute><AdminQuizPage /></AdminProtectedRoute>} />

              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
