import { useCallback, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Loader from "./components/Loader";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  const finishLoading = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          setHeroReady(true);
        }}
      >
        {loading && (
          <Loader
            key="waad-loader"
            onDone={finishLoading}
          />
        )}
      </AnimatePresence>

      <Routes>
        {/* Public website */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Home heroReady={heroReady} />}
          />

          <Route
            path="/collections"
            element={<Portfolio />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />
        </Route>

        {/* Admin login */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Protected admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </>
  );
}