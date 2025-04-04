
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sun, Moon } from "lucide-react";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Select 
      value={theme} 
      onValueChange={(value) => setTheme(value as any)}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder={t("choose_theme")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center">
            <Sun className="w-4 h-4 mr-2" />
            <span>{t("theme_light")}</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center">
            <Moon className="w-4 h-4 mr-2" />
            <span>{t("theme_dark")}</span>
          </div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 flex">
              <Sun className="w-2 h-4" />
              <Moon className="w-2 h-4" />
            </div>
            <span>{t("theme_system")}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ThemeSelector;
