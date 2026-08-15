import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Programs from "@/pages/Programs";
import Projects from "@/pages/Projects";
import Impact from "@/pages/Impact";
import Governance from "@/pages/Governance";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Donate from "@/pages/Donate";

function Router() {
  return (
    <Switch>
      
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/programs"} component={Programs} />
      <Route path={"/projects"} component={Projects} />
      <Route path={"/impact"} component={Impact} />
      <Route path={"/governance"} component={Governance} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/donate"} component={Donate} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useScrollToTop();
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
