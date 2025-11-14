import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/theme-context";
import LoadingScreen from "@/components/loading-screen";
import InstallPrompt from "@/components/install-prompt";
import { handlePWAShortcuts, showPWAElements, handleShareTarget } from "@/lib/pwa-utils";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // Handle PWA specific functionality after app loads
    if (!isLoading) {
      handlePWAShortcuts();
      showPWAElements();
      handleShareTarget();
    }
  }, [isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="foodtracker-theme">
        <TooltipProvider>
          <Toaster />
          {isLoading ? (
            <LoadingScreen onLoadingComplete={handleLoadingComplete} />
          ) : (
            <div className="animate-fade-in">
              <Router />
              <InstallPrompt />
            </div>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
