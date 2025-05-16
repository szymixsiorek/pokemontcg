import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, History, Trash2, LoaderCircle } from "lucide-react";
import { format } from "date-fns";

interface Export {
  id: string;
  name: string;
  file_type: string;
  created_at: string;
  card_count: number;
  file_path: string;
}

interface CollectionExportsProps {
  onExport: (format: 'pdf' | 'image') => Promise<void>;
  isExporting: boolean;
}

const CollectionExports = ({ onExport, isExporting }: CollectionExportsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [exports, setExports] = useState<Export[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchExports = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('collection_exports')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setExports(data || []);
    } catch (error) {
      console.error("Error fetching exports:", error);
      toast({
        variant: "destructive",
        title: "Failed to load exports",
        description: "There was an error loading your export history."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = async (filePath: string) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('collection_exports')
        .createSignedUrl(filePath, 60 * 10); // 10-minute expiry
        
      if (error) throw error;
      
      // Open the signed URL in a new tab for download
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error("Error generating download link:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Unable to generate download link."
      });
    }
  };
  
  const handleDelete = async (id: string, filePath: string) => {
    if (!user) return;
    
    setIsDeleting(id);
    try {
      // Delete the file from storage
      const { error: storageError } = await supabase
        .storage
        .from('collection_exports')
        .remove([filePath]);
        
      if (storageError) throw storageError;
      
      // Delete the record from the database
      const { error: dbError } = await supabase
        .from('collection_exports')
        .delete()
        .eq('id', id);
        
      if (dbError) throw dbError;
      
      // Refresh the list
      await fetchExports();
      
      toast({
        title: "Export deleted",
        description: "The export has been removed."
      });
    } catch (error) {
      console.error("Error deleting export:", error);
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "Unable to delete the export. Please try again."
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Fetch exports when the dialog opens
  useEffect(() => {
    if (isOpen && user) {
      fetchExports();
    }
  }, [isOpen, user]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="sm" 
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <History className="h-4 w-4" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Collection Exports</DialogTitle>
          <DialogDescription>
            Generate PDF or image exports of your collection and manage your export history.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="history">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="create">Create Export</TabsTrigger>
            <TabsTrigger value="history">Export History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4">
            <div className="text-center">
              <p className="mb-6">Choose an export format to generate a snapshot of your collection:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-6 text-center hover:bg-accent transition-colors">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-medium mb-2">PDF Export</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate a document with all your cards, organized by set.
                  </p>
                  <Button 
                    onClick={() => onExport('pdf')} 
                    disabled={isExporting}
                    className="w-full"
                  >
                    {isExporting ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Generate PDF
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="border rounded-lg p-6 text-center hover:bg-accent transition-colors">
                  <FileImage className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-medium mb-2">Image Export</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create an image gallery of your collection.
                  </p>
                  <Button 
                    onClick={() => onExport('image')} 
                    disabled={isExporting}
                    className="w-full"
                  >
                    {isExporting ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <p className="mt-6 text-sm text-muted-foreground">
                Note: The export process may take a few moments depending on the size of your collection.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            {isLoading ? (
              <div className="text-center py-8">
                <LoaderCircle className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
                <p>Loading your exports...</p>
              </div>
            ) : exports.length === 0 ? (
              <div className="text-center py-8">
                <p>You haven't created any exports yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Go to the "Create Export" tab to generate your first export.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-lg divide-y">
                  {exports.map((exportItem) => (
                    <div key={exportItem.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{exportItem.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="mr-4">
                            {format(new Date(exportItem.created_at), "PPp")}
                          </span>
                          <span className="mr-4">
                            {exportItem.file_type.toUpperCase()}
                          </span>
                          <span>
                            {exportItem.card_count} cards
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => handleDownload(exportItem.file_path)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          onClick={() => handleDelete(exportItem.id, exportItem.file_path)}
                          disabled={isDeleting === exportItem.id}
                        >
                          {isDeleting === exportItem.id ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionExports;
