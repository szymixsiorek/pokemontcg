
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 py-8 px-4 sm:px-6 theme-transition">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">{t("site_links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link to="/sets" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("sets")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("about_us")}
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("donate")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">{t("account")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sign-in" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("sign_in")}
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("sign_up")}
                </Link>
              </li>
              <li>
                <Link to="/my-collection" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("my_collection")}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Pok%C3%A9mon_Trading_Card_Game_logo.svg/2560px-Pok%C3%A9mon_Trading_Card_Game_logo.svg.png" 
                  alt="Pokémon Trading Card Game"
                  className="h-10 object-contain" 
                />
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                &copy; {currentYear} {t("all_rights_reserved")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("fan_site_disclaimer")}
              </p>
              <div className="text-xs text-muted-foreground">
                <p>Powered by <a href="https://pokemontcg.io/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pokemontcg.io API</a> and <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pokeapi.co</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
