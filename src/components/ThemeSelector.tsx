
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const themes = [
  { value: "original", label: "theme_original", color: "bg-pokemon-red" },
  { value: "gold-silver", label: "theme_gold_silver", color: "bg-series-gold" },
  { value: "ruby-sapphire", label: "theme_ruby_sapphire", color: "bg-series-ruby" },
  { value: "diamond-pearl", label: "theme_diamond_pearl", color: "bg-series-diamond" },
  { value: "black-white", label: "theme_black_white", color: "bg-series-black" },
  { value: "xy", label: "theme_xy", color: "bg-series-xy" },
  { value: "sun-moon", label: "theme_sun_moon", color: "bg-series-sunmoon" },
  { value: "sword-shield", label: "theme_sword_shield", color: "bg-series-sword" },
  { value: "scarlet-violet", label: "theme_scarlet_violet", color: "bg-series-scarlet" },
];

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Select 
      value={theme} 
      onValueChange={(value) => setTheme(value as any)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("choose_theme")} />
      </SelectTrigger>
      <SelectContent>
        {themes.map((themeOption) => (
          <SelectItem key={themeOption.value} value={themeOption.value}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${themeOption.color}`} />
              <span>{t(themeOption.label)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ThemeSelector;
