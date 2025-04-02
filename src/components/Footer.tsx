
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted py-8 px-4 sm:px-6 mt-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-lg mb-4">JP Pokémon TCG Gallery</h3>
            <p className="text-muted-foreground text-sm">
              A fan site dedicated to Japanese Pokémon Trading Card Game collectibles.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
              {t("site_links")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-foreground hover:text-primary transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link to="/sets" className="text-foreground hover:text-primary transition-colors">
                  {t("sets")}
                </Link>
              </li>
              <li>
                <Link to="/my-collection" className="text-foreground hover:text-primary transition-colors">
                  {t("my_collection")}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
              {t("account")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sign-in" className="text-foreground hover:text-primary transition-colors">
                  {t("sign_in")}
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="text-foreground hover:text-primary transition-colors">
                  {t("sign_up")}
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="text-foreground hover:text-primary transition-colors">
                  {t("forgot_password")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} JP Pokémon TCG Gallery. {t("all_rights_reserved")}</p>
          <p className="mt-2">{t("fan_site_disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
