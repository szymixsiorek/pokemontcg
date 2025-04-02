
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import type { CardSet } from "@/lib/api";

interface SetCardProps {
  set: CardSet;
}

const SetCard = ({ set }: SetCardProps) => {
  const { language, t } = useLanguage();
  
  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-center">
          <img 
            src={set.logo} 
            alt={language === "en" ? set.name : set.nameJp} 
            className="h-24 object-contain"
          />
        </div>
        <div className="text-center">
          <h3 className="font-medium text-lg">
            {language === "en" ? set.name : set.nameJp}
          </h3>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <img src={set.symbol} alt="Set Symbol" className="w-4 h-4" />
            <span>{set.cardCount} {t("cards_in_set")}</span>
          </div>
          <p className="text-sm mt-1 text-muted-foreground">
            {t("release_date")}: {set.releaseDate}
          </p>
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
