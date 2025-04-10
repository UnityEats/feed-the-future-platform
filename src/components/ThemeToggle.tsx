
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Toggle } from "@/components/ui/toggle";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Toggle 
      variant="outline"
      aria-label="Toggle dark mode" 
      className="px-2"
      pressed={theme === "dark"}
      onPressedChange={toggleTheme}
    >
      {theme === "dark" ? (
        <Moon className="h-4 w-4 text-purple" />
      ) : (
        <Sun className="h-4 w-4 text-purple" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Toggle>
  );
}
