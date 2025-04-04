
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, Computer, LogOut, User, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import ThemeSelector from "@/components/ThemeSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import NeonTitle from "./NeonTitle";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container flex items-center justify-between py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="pokeball-button hidden md:block" />
            <div className="ml-2 flex items-center">
              <span className="text-xl md:text-2xl">
                <NeonTitle text="TCG Gallery" className="text-xl md:text-2xl" />
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
          <Link to="/sets" className="hover:text-foreground transition-colors duration-200">
            {t("card_sets")}
          </Link>
          {user && (
            <Link to="/my-collection" className="hover:text-foreground transition-colors duration-200">
              {t("my_collection")}
            </Link>
          )}
        </nav>

        {/* Theme & User Menu */}
        <div className="flex items-center gap-2">
          <ThemeSelector />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user.email}</p>
                    {user.user_metadata?.full_name && (
                      <p className="text-xs text-muted-foreground">
                        {user.user_metadata.full_name}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/my-collection" className="cursor-pointer">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    {t("my_collection")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("sign_out")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link to="/sign-in">
                {t("sign_in")}
              </Link>
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader className="text-left">
                <SheetTitle>{t("menu")}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col mt-8 space-y-4">
                <SheetClose asChild>
                  <Link to="/sets" className="py-2 text-lg">
                    {t("card_sets")}
                  </Link>
                </SheetClose>
                {user && (
                  <SheetClose asChild>
                    <Link to="/my-collection" className="py-2 text-lg">
                      {t("my_collection")}
                    </Link>
                  </SheetClose>
                )}
                <div className="py-2">
                  <p className="text-lg mb-4">{t("theme")}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                      className="justify-start"
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      {t("light")}
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                      className="justify-start"
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      {t("dark")}
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('system')}
                      className="justify-start"
                    >
                      <Computer className="h-4 w-4 mr-2" />
                      {t("system")}
                    </Button>
                  </div>
                </div>
                
                {user ? (
                  <Button onClick={handleSignOut} variant="ghost" className="justify-start">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("sign_out")}
                  </Button>
                ) : (
                  <SheetClose asChild>
                    <Button asChild className="mt-4">
                      <Link to="/sign-in">
                        {t("sign_in")}
                      </Link>
                    </Button>
                  </SheetClose>
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
