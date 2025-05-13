
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

type ProfilePicture = {
  id: string;
  url: string;
  alt: string;
};

const predefinedPictures: ProfilePicture[] = [
  { id: "1", url: "/lovable-uploads/ef03190e-c12d-4797-8bff-9bb3a256aa24.png", alt: "Anime character with angry expression" },
  { id: "2", url: "/lovable-uploads/5a5540c8-338a-493f-b87e-10147c18d7ea.png", alt: "Anime character with goggles" },
  { id: "3", url: "/lovable-uploads/fb217e0b-3ff0-4925-82a9-6e9c9891ac6d.png", alt: "Eevee Pokemon" },
  { id: "4", url: "/lovable-uploads/a5f8dc87-2084-4fa1-9607-7fe2ce91a0f0.png", alt: "Detective Pikachu" },
  { id: "5", url: "/lovable-uploads/611c21aa-d447-452a-94cc-e88e2143b5ef.png", alt: "Anime character with red hat" },
  { id: "6", url: "/lovable-uploads/4b93384c-5a6a-429b-bcc6-cfde85876c50.png", alt: "Ash Ketchum" },
  { id: "7", url: "/lovable-uploads/2da0c75d-c9de-4e95-a98f-94245e140a9b.png", alt: "Anime character with blonde hair" },
  { id: "8", url: "/lovable-uploads/7b5d6b50-db10-49ed-b69a-7ba27e3d48a6.png", alt: "Anime character with green hair" },
  { id: "9", url: "/lovable-uploads/d5258abf-ca0e-45b2-8d97-8235f42118c6.png", alt: "Anime character with side glance" },
  { id: "10", url: "/lovable-uploads/618abaa9-a034-48dc-a320-398152c7f5eb.png", alt: "Brock from Pokemon" },
  { id: "11", url: "/lovable-uploads/49b36c21-0417-425f-adfd-04fde67c4081.png", alt: "Misty from Pokemon" },
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
            Select one of these anime-style pictures as your profile avatar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 max-h-[60vh] overflow-y-auto p-2">
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
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
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
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Select
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
