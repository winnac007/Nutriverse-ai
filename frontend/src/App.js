import React from "react";
import "@/index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./lib/auth";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Category from "./pages/Category";
import RecipeDetail from "./pages/RecipeDetail";
import MealPlan from "./pages/MealPlan";
import Track from "./pages/Track";
import Profile from "./pages/Profile";
import StoryMap from "./pages/StoryMap";
import Healthcare from "./pages/Healthcare";

function OnboardingGuard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<OnboardingGuard><Onboarding /></OnboardingGuard>} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="category/:cat" element={<Category />} />
              <Route path="recipe/:id" element={<RecipeDetail />} />
              <Route path="meal-plan" element={<MealPlan />} />
              <Route path="track" element={<Track />} />
              <Route path="profile" element={<Profile />} />
              <Route path="storymap" element={<StoryMap />} />
              <Route path="healthcare" element={<Healthcare />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
