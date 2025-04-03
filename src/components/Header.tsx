
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import ThemeSelector from "@/components/ThemeSelector";
import LanguageSelector from "@/components/LanguageSelector";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();
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
            <div className="pokeball-button mr-2" />
            <span className="font-heading text-xl sm:text-2xl text-pokemon-red">
              Pokémon TCG Gallery
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
                {user.displayName}
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
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
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
                <div className="py-2">
                  <ThemeSelector />
                </div>
                {user ? (
                  <>
                    <div className="flex items-center py-2">
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm">{user.displayName}</span>
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
