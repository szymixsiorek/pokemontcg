
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
import { Menu, User, LogOut } from "lucide-react";

const Header = () => {
  const { user, displayName, signOut } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: t("home"), href: "/" },
    { label: t("sets"), href: "/sets" },
    ...(user ? [{ label: t("my_collection"), href: "/my-collection" }] : []),
  ];

  return (
    <header className="py-4 px-4 sm:px-6 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
              alt="Pokeball"
              className="h-7 w-7 sm:h-8 sm:w-8" 
            />
            <span className="font-heading text-xl sm:text-2xl hidden sm:inline-block">
              <span className="neon-text neon-blue">Poké</span>
              <span className="neon-text neon-yellow">mon</span>
              <span className="neon-text neon-red"> TCG</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
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
                <span className="font-heading text-xl">
                  <span className="neon-text neon-blue">Poké</span>
                  <span className="neon-text neon-yellow">mon</span>
                  <span className="neon-text neon-red"> TCG</span>
                </span>
              </div>
              <div className="flex flex-col space-y-4 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
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
