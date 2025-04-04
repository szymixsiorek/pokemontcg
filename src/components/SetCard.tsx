
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import type { CardSet } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface SetCardProps {
  set: CardSet;
}

const SetCard = ({ set }: SetCardProps) => {
  const { t } = useLanguage();
  const { getSeriesColors, theme } = useTheme();
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    setLogoError(true);
  };

  const { primary, secondary } = getSeriesColors(set.series);
  
  // Special handling for Black & White series in light mode
  const badgeStyle = set.series === "Black & White" && theme === "light" 
    ? { borderColor: primary, color: "#000000", backgroundColor: "#ffffff", border: "1px solid #000000" }
    : { borderColor: primary, color: secondary };

  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-center h-24 items-center">
          {!logoError ? (
            <img 
              src={set.logo} 
              alt={set.name} 
              className="max-h-full object-contain"
              onError={handleLogoError}
            />
          ) : (
            <div className="text-muted-foreground text-sm text-center">
              {t("logo_not_available")}
            </div>
          )}
        </div>
        <div className="text-center">
          <h3 className="font-medium text-lg">
            {set.name}
          </h3>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <img 
              src={set.symbol} 
              alt="Set Symbol" 
              className="w-4 h-4 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span>{set.cardCount} {t("cards_in_set")}</span>
          </div>
          <p className="text-sm mt-1 text-muted-foreground">
            {t("release_date")}: {set.releaseDate}
          </p>
          <div className="mt-2">
            <Badge 
              variant="outline" 
              className="text-xs"
              style={badgeStyle}
            >
              {set.series}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-center">
        <Button asChild size="sm">
          <Link to={`/sets/${set.id}`}>
            {t("view_set")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SetCard;
