
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageCircle, Send } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the Supabase Edge Function to send email
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: { name, email, message }
      });
      
      if (error) throw error;
      
      toast({
        title: t("message_sent"),
        description: t("message_sent_description"),
      });
      
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">{t("contact_me")}</h1>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t("get_in_touch")}</h2>
            <p className="text-muted-foreground">
              Have questions about Pokémon TCG Gallery? Want to report a bug or suggest a feature?
              Feel free to reach out through any of these channels:
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <a 
                  href="mailto:szymek04sawicki@gmail.com" 
                  className="hover:text-primary transition-colors"
                >
                  szymek04sawicki@gmail.com
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-primary" 
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
                <a 
                  href="https://discord.com/users/824373663281053707" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  szymixsiorek
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Send className="h-5 w-5 text-primary" />
                <a 
                  href="https://t.me/szymixsiorek" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  @szymixsiorek
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">{t("send_message")}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  {t("your_name")}
                </label>
                <Input 
                  id="name"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  {t("your_email")}
                </label>
                <Input 
                  id="email"
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  {t("your_message")}
                </label>
                <Textarea 
                  id="message"
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  required 
                  rows={5} 
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("sending")}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t("send_message")}
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
