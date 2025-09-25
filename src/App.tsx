import { ThemeProvider } from "@/components/theme-provider";
import { QuizEntry } from "./components/questions/QuizEntry";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-svh w-full bg-background font-sans antialiased flex items-center justify-center">
        <QuizEntry />
      </div>
    </ThemeProvider>
  );
}

export default App;
