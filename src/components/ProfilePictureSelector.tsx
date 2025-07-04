import { useState } from "react";
import { Images } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

type ProfilePicture = {
  id: string;
  url: string;
  alt: string;
};

const predefinedPictures: ProfilePicture[] = [
  { id: "1", url: "/lovable-uploads/ef03190e-c12d-4797-8bff-9bb3a256aa24.png", alt: "Sigma rage mode activated" },
  { id: "2", url: "/lovable-uploads/5a5540c8-338a-493f-b87e-10147c18d7ea.png", alt: "No cap, these goggles are fire" },
  { id: "3", url: "/lovable-uploads/fb217e0b-3ff0-4925-82a9-6e9c9891ac6d.png", alt: "Eevee got that drip frfr" },
  { id: "4", url: "/lovable-uploads/a5f8dc87-2084-4fa1-9607-7fe2ce91a0f0.png", alt: "Detective Rizz-achu on the case" },
  { id: "5", url: "/lovable-uploads/611c21aa-d447-452a-94cc-e88e2143b5ef.png", alt: "Lowkey bussin' with the red hat" },
  { id: "6", url: "/lovable-uploads/4b93384c-5a6a-429b-bcc6-cfde85876c50.png", alt: "Ash caught these hands in Ohio" },
  { id: "7", url: "/lovable-uploads/2da0c75d-c9de-4e95-a98f-94245e140a9b.png", alt: "Blonde hair, don't care, kinda sus" },
  { id: "8", url: "/lovable-uploads/7b5d6b50-db10-49ed-b69a-7ba27e3d48a6.png", alt: "Green hair energy, no cap" },
  { id: "9", url: "/lovable-uploads/d5258abf-ca0e-45b2-8d97-8235f42118c6.png", alt: "Side-eye serving main character vibes" },
  { id: "10", url: "/lovable-uploads/618abaa9-a034-48dc-a320-398152c7f5eb.png", alt: "Brock's rizz level is over 9000" },
  { id: "11", url: "/lovable-uploads/49b36c21-0417-425f-adfd-04fde67c4081.png", alt: "Misty be throwing shade, sheesh" },
  // Adding new AniPoke profile pictures with slang names
  { id: "12", url: "/lovable-uploads/1d9aac1a-187e-40e8-9675-1149e9c5442c.png", alt: "Bro is absolutely tweakin'" },
  { id: "13", url: "/lovable-uploads/b9595a2f-cf16-4427-b8a8-748ccdd5b9ea.png", alt: "That's the Ohio face frfr" },
  { id: "14", url: "/lovable-uploads/52a4ed14-ce42-4f0a-824d-9607199187ab.png", alt: "Giving main character energy, no cap" },
  { id: "15", url: "/lovable-uploads/34205626-71c6-4dae-a1df-82bb22c43e3a.png", alt: "Big rizz energy, type beat" },
  { id: "16", url: "/lovable-uploads/5e195504-d96c-4331-8581-b8a1214686b8.png", alt: "Devious ahh laugh, so based" },
  { id: "17", url: "/lovable-uploads/6bd8fc5c-d6e4-4e0f-8124-d2a75b67398c.png", alt: "Bro chose violence, yeet" },
  { id: "18", url: "/lovable-uploads/2dafbd96-54ed-4f13-bf00-574446cc746a.png", alt: "Nerd ahh glasses, but still bussin'" },
  { id: "19", url: "/lovable-uploads/e1c437e2-056a-4c2f-ab3b-0ed2bb9249be.png", alt: "W smile, kinda slay ngl" },
  { id: "20", url: "/lovable-uploads/97cc4dab-4e82-445c-9987-4ecf8391c736.png", alt: "Down bad, no rizz, core memory damaged" },
  { id: "21", url: "/lovable-uploads/d5e0e421-38ef-450b-8f28-372a6e08e7f8.png", alt: "Dragonite boutta throw hands frfr" },
  { id: "22", url: "/lovable-uploads/e3e08fcb-47ce-4cee-8228-f0c9a140ea3e.png", alt: "Lucario with that sigma stare" },
  { id: "23", url: "/lovable-uploads/2ad64464-6cd0-4780-befa-8ff2bbd4e69a.png", alt: "Bro caught in 4K, straight bussin'" },
  { id: "24", url: "/lovable-uploads/2e709463-e958-4aca-8e5c-5f026043d9aa.png", alt: "Lucario's villain arc, respectfully" },
];

interface ProfilePictureSelectorProps {
  onSelectPicture: (url: string) => Promise<void>;
  currentAvatarUrl?: string | null;
}

export const ProfilePictureSelector = ({ onSelectPicture, currentAvatarUrl }: ProfilePictureSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelect = async (picture: ProfilePicture) => {
    if (isLoading) return; // Prevent multiple selections while processing
    
    setIsLoading(picture.id);
    try {
      await onSelectPicture(picture.url);
      setIsOpen(false);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully."
      });
    } catch (error) {
      console.error("Error selecting avatar:", error);
      toast({
        title: "Failed to update avatar",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 text-sm w-full"
          type="button"
        >
          <Images className="h-4 w-4" />
          Choose Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose a Profile Picture</DialogTitle>
          <DialogDescription>
            Select one of these AniPoke pictures as your profile avatar.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
            {predefinedPictures.map((picture) => (
              <div 
                key={picture.id} 
                className={`group relative cursor-pointer rounded-md overflow-hidden border transition-all ${
                  currentAvatarUrl === picture.url ? 'ring-2 ring-primary border-primary' : 'hover:border-primary hover:shadow-md'
                }`}
                onClick={() => handleSelect(picture)}
              >
                <AspectRatio ratio={1/1} className="bg-muted">
                  <img
                    src={picture.url}
                    alt={picture.alt}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </AspectRatio>
                {isLoading === picture.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  </div>
                )}
                {currentAvatarUrl === picture.url && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {picture.alt}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
