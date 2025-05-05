import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import ThemeSelector from "@/components/ThemeSelector";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, User, LogOut, Heart, Home, MessageSquare, Info, Library } from "lucide-react";

const Header = () => {
  const { user, displayName, signOut } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: t("home"), href: "/", icon: <Home className="h-4 w-4" /> },
    { label: t("sets"), href: "/sets", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg> },
    ...(user ? [{ label: t("my_collection"), href: "/my-collection", icon: <Library className="h-4 w-4" /> }] : []),
    { label: t("about_us"), href: "/about", icon: <Info className="h-4 w-4" /> },
    { label: t("contact"), href: "/contact", icon: <MessageSquare className="h-4 w-4" /> },
  ];

  return (
    <header className="py-4 px-4 sm:px-6 border-b theme-transition">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
              alt="Pokeball"
              className="h-7 w-7 sm:h-8 sm:w-8" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Pok%C3%A9mon_Trading_Card_Game_logo.svg/2560px-Pok%C3%A9mon_Trading_Card_Game_logo.svg.png" 
              alt="Pokémon Trading Card Game"
              className="h-8 sm:h-10 object-contain" 
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-3">
          {menuItems.map((item) => (
            <Button key={item.href} variant="outline" size="sm" className="gap-1" asChild>
              <Link to={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <Link to="/donate">
              <Heart className="h-4 w-4 text-red-500" />
              {t("donate")}
            </Link>
          </Button>
          <ThemeSelector />
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {displayName || user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("sign_out")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sign-in">{t("sign_in")}</Link>
              </Button>
              <Button asChild>
                <Link to="/sign-up">{t("sign_up")}</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          {user && (
            <Button variant="outline" size="icon" className="mr-2" asChild>
              <Link to="/my-collection">
                <Library className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button variant="outline" size="icon" className="mr-2" asChild>
            <Link to="/donate">
              <Heart className="h-4 w-4 text-red-500" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="mr-2" asChild>
            <Link to="/contact">
              <MessageSquare className="h-4 w-4" />
            </Link>
          </Button>
          <ThemeSelector />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex items-center mb-6">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
                  alt="Pokeball"
                  className="h-7 w-7 mr-2" 
                />
                <div className="flex flex-col items-start">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Pok%C3%A9mon_Trading_Card_Game_logo.svg/2560px-Pok%C3%A9mon_Trading_Card_Game_logo.svg.png" 
                    alt="Pokémon Trading Card Game"
                    className="h-6 object-contain" 
                  />
                  <span className="text-xs font-mono tracking-wide uppercase">Gallery</span>
                </div>
              </div>
              <div className="flex flex-col space-y-4 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/donate"
                  className="text-foreground hover:text-primary transition-colors py-2 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  {t("donate")}
                </Link>
                {user ? (
                  <>
                    <div className="flex items-center py-2">
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm">{displayName || user.email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="justify-start px-0"
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("sign_out")}
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button asChild onClick={() => setIsOpen(false)}>
                      <Link to="/sign-in">{t("sign_in")}</Link>
                    </Button>
                    <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                      <Link to="/sign-up">{t("sign_up")}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
