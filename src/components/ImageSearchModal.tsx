
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { searchCardsByImage } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchResults: (results: any[]) => void;
}

const ImageSearchModal = ({ isOpen, onClose, onSearchResults }: ImageSearchModalProps) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const resetState = () => {
    setPreviewImage(null);
    setIsLoading(false);
  };
  
  const handleClose = () => {
    resetState();
    onClose();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Process the search
      processImageSearch(file);
    }
  };
  
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      
      // Setup video
      video.srcObject = stream;
      video.play();
      
      // Take photo after a short delay
      setTimeout(() => {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          
          // Convert to file and process
          canvas.toBlob((blob) => {
            if (blob) {
              // Stop the video stream
              stream.getTracks().forEach(track => track.stop());
              
              // Create a File from the Blob
              const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
              
              // Preview the image
              setPreviewImage(canvas.toDataURL());
              
              // Process the search
              processImageSearch(file);
            }
          }, 'image/jpeg');
        }
      }, 300);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check your permissions.");
    }
  };
  
  const processImageSearch = async (file: File) => {
    setIsLoading(true);
    try {
      const results = await searchCardsByImage(file);
      onSearchResults(results);
      handleClose();
    } catch (error) {
      console.error("Error processing image search:", error);
      toast.error("Failed to process image search");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("search_by_image")}</DialogTitle>
          <DialogDescription>{t("search_by_image_desc")}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {previewImage ? (
            <div className="flex justify-center">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="max-h-[300px] object-contain rounded-md"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-32 flex flex-col gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="h-6 w-6" />
                <span>{t("upload_image")}</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-32 flex flex-col gap-2"
                onClick={handleCameraCapture}
                disabled={isLoading}
              >
                <Camera className="h-6 w-6" />
                <span>{t("take_photo")}</span>
              </Button>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          
          {isLoading && (
            <div className="text-center py-4">
              <div className="pokeball-loader mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t("processing_image")}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSearchModal;
