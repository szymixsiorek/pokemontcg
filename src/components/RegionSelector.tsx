
import { useRegion } from "@/context/RegionContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RegionSelectorProps {
  variant?: "default" | "icon";
}

const RegionSelector = ({ variant = "default" }: RegionSelectorProps) => {
  const { region, setRegion } = useRegion();
  const { t } = useLanguage();

  const regions = [
    { code: "jp", name: t("japanese_sets") },
    { code: "en", name: t("english_sets") }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" className="rounded-full">
            <Globe className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>{region === "jp" ? t("japanese_sets") : t("english_sets")}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {regions.map((reg) => (
          <DropdownMenuItem
            key={reg.code}
            onClick={() => setRegion(reg.code as "jp" | "en")}
            className={region === reg.code ? "bg-muted" : ""}
          >
            {reg.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RegionSelector;
