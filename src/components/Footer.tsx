
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 py-8 px-4 sm:px-6">
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
            <div className="flex items-center mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
                alt="Pokeball"
                className="h-6 w-6 mr-2" 
              />
              <span className="font-heading">Pokémon TCG Gallery</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} {t("all_rights_reserved")}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t("fan_site_disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
