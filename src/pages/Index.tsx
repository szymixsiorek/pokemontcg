
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CirclePlus, CircleCheckBig } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import NeonTitle from "@/components/NeonTitle";

// Sample set data for the featured section
const featuredSets = [
  {
    id: "sv3pt5",
    name: "Paldean Fates",
    image: "https://images.pokemontcg.io/sv3pt5/symbol.png",
    cards: 229,
    releaseDate: "2024-01-26",
  },
  {
    id: "sv4",
    name: "Scarlet & Violet—Paradox Rift",
    image: "https://images.pokemontcg.io/sv4/symbol.png",
    cards: 182,
    releaseDate: "2023-11-03",
  },
  {
    id: "sv3",
    name: "Scarlet & Violet—Obsidian Flames",
    image: "https://images.pokemontcg.io/sv3/symbol.png",
    cards: 196,
    releaseDate: "2023-08-11",
  }
];

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Set the document title
  useEffect(() => {
    document.title = "Pokémon TCG Gallery";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero section */}
        <section className="py-16 px-4 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <NeonTitle 
              text="Pokémon TCG Gallery" 
              className="text-4xl sm:text-5xl md:text-6xl mb-6" 
            />
            
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              {t("explore_all_pokemon_cards")}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/sets">{t("browse_sets")}</Link>
              </Button>
              
              {user ? (
                <Button asChild variant="outline" size="lg">
                  <Link to="/my-collection">
                    <CircleCheckBig className="mr-2 h-5 w-5" />
                    {t("my_collection")}
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="lg">
                  <Link to="/sign-in">
                    <CirclePlus className="mr-2 h-5 w-5" />
                    {t("start_collecting")}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Featured sets section */}
        <section className="py-12 px-4 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">{t("featured_sets")}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredSets.map((set) => (
                <div 
                  key={set.id}
                  className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img src={set.image} alt={set.name} className="w-8 h-8 mr-3" />
                      <h3 className="font-bold text-xl">{set.name}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {set.cards} {t("cards")} • {t("released")}: {set.releaseDate}
                    </p>
                    <Button 
                      asChild 
                      variant="outline" 
                      className="w-full"
                    >
                      <Link to={`/sets/${set.id}`}>{t("view_set")}</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild variant="default">
                <Link to="/sets">{t("view_all_sets")}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Collection CTA section */}
        {!user && (
          <section className="py-16 px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">{t("start_your_collection")}</h2>
              <p className="text-lg mb-8 text-muted-foreground">
                {t("create_account_to_collect")}
              </p>
              <Button asChild size="lg">
                <Link to="/sign-up">{t("sign_up_now")}</Link>
              </Button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
