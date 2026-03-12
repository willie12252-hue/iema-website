import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Router, Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";

// Pages
import About from "@/pages/About";
import Faculty from "@/pages/Faculty";
import Courses from "@/pages/Courses";
import Activities from "@/pages/Activities";
import Academy from "@/pages/Academy";
import Home from "@/pages/Home";

// Admin Pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";

function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppRouter() {
  const [location] = useHashLocation();
  // Check if current route is admin route
 // Check if current route is admin route - Fix for hash routing
const isAdminRoute = location.startsWith('/admin') || window.location.hash.startsWith('#/admin');

  return (
    <Router hook={useHashLocation}>
      <ScrollToTop />
      {isAdminRoute ? (
        // Admin Layout: No Navbar, No Footer, No HeroBanner
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/*" component={AdminDashboard} />
        </Switch>
      ) : (
        // Public Layout
        <div className="flex flex-col min-h-screen font-sans bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary">
          <Navbar />
          <main className="flex-grow pt-20">
            {/* Show HeroBanner only on Home page or maybe exclude from specific pages? 
                Original code showed HeroBanner on ALL pages inside main.
                Let's keep it consistent with original design.
            */}
            <HeroBanner />
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/faculty" component={Faculty} />
              <Route path="/courses" component={Courses} />
              <Route path="/activities" component={Activities} />
              <Route path="/academy" component={Academy} />
              <Route path="/:rest*">{() => <Home />}</Route>
            </Switch>
          </main>
          <Footer />
        </div>
      )}
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
