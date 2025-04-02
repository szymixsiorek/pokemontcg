
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import type { CardSet } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface SetCardProps {
  set: CardSet;
}

const SetCard = ({ set }: SetCardProps) => {
  const { language, t } = useLanguage();
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    setLogoError(true);
  };

  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-center h-24 items-center">
          {!logoError ? (
            <img 
              src={set.logo} 
              alt={language === "en" ? set.name : set.nameJp} 
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
            {language === "en" ? set.name : set.nameJp}
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
            <Badge variant="outline" className="text-xs">
              {set.region === "jp" ? t("japanese_sets") : t("english_sets")}
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

