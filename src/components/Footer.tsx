
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Enhanced neon text with custom animation for each letter
const NeonText = ({ text }: { text: string }) => {
  const colors = ['blue', 'red', 'yellow', 'green', 'purple', 'orange', 'pink', 'cyan'];
  
  return (
    <span className="neon-text-wrapper">
      {text.split('').map((letter, index) => {
        const colorIndex = index % colors.length;
        const colorClass = `neon-letter-${colors[colorIndex]}`;
        
        return (
          <span 
            key={index} 
            className={`neon-letter ${colorClass}`}
            style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
          >
            {letter}
          </span>
        );
      })}
    </span>
  );
};

const ContactForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate email sending - in production, this would call a server endpoint
    setTimeout(() => {
      toast({
        title: t("message_sent"),
        description: t("message_sent_description"),
      });
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input 
        placeholder={t("your_name")} 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />
      <Input 
        type="email" 
        placeholder={t("your_email")} 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <Textarea 
        placeholder={t("your_message")} 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        required 
        rows={3} 
      />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? t("sending") : t("send_message")}
      </Button>
    </form>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 py-8 px-4 sm:px-6 theme-transition">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                <Link to="/donate" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("donate")}
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
            <h3 className="text-lg font-medium mb-4">{t("contact")}</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:szymek04sawicki@gmail.com" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </a>
              </li>
              <li>
                <a 
                  href="https://discord.com/users/824373663281053707" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-2" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M18 9V5a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v4"></path>
                    <polyline points="13 15 9 19 6 15"></polyline>
                    <path d="M9 19h10a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3H16"></path>
                  </svg>
                  Discord
                </a>
              </li>
              <li>
                <a 
                  href="https://t.me/szymixsiorek" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Telegram
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
                  alt="Pokeball"
                  className="h-6 w-6 mr-2" 
                />
                <span className="font-heading text-xl">
                  <NeonText text="Pokémon TCG Gallery" />
                </span>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-md font-medium">{t("contact_me")}</h3>
                <ContactForm />
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                &copy; {currentYear} {t("all_rights_reserved")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("fan_site_disclaimer")}
              </p>
              <div className="text-xs text-muted-foreground">
                <p>Powered by <a href="https://pokemontcg.io/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pokemontcg.io API</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
