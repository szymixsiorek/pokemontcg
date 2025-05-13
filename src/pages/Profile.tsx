import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProfilePictureSelector } from "@/components/ProfilePictureSelector";
import { Profile } from "@/types/database.types";

const ProfilePage = () => {
  const { user, displayName, updateDisplayName } = useAuth();
  const [name, setName] = useState(displayName);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [joinDate, setJoinDate] = useState<string>("");
  const [collectionCount, setCollectionCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
      return;
    }

    // Load avatar if exists
    getProfile();
    
    // Get user stats
    getUserStats();
  }, [user, navigate]);

  const getProfile = async () => {
    try {
      if (!user) return;
      
      console.log("Fetching profile for user ID:", user.id);
      
      // Use proper typing for the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      console.log("Profile data received:", data);

      // If profile has an avatar_url, set it directly
      if (data && data.avatar_url) {
        console.log("Avatar URL from database:", data.avatar_url);
        setAvatarUrl(data.avatar_url);
      } else {
        console.log("No avatar URL found in profile data");
      }
    } catch (error) {
      console.error("Error in getProfile function:", error);
      setError("Error loading profile. Please try again later.");
    }
  };

  const getUserStats = async () => {
    try {
      if (!user) return;
      
      // Get join date from user metadata
      if (user.created_at) {
        const date = new Date(user.created_at);
        setJoinDate(date.toLocaleDateString());
      }
      
      // Get collection count
      const { count, error } = await supabase
        .from('user_collections')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      if (count !== null) {
        setCollectionCount(count);
      }
    } catch (error) {
      console.log("Error fetching user stats: ", error);
    }
  };

  const selectPredefinedAvatar = async (imageUrl: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error("User must be logged in to select an avatar.");
      }

      console.log("Selected predefined avatar:", imageUrl);
      
      // Update or insert profile with avatar URL using proper typing
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          avatar_url: imageUrl,
          updated_at: new Date().toISOString()
        }, { returning: 'minimal' });
        
      if (upsertError) {
        console.error("Profile update error:", upsertError);
        console.error("Error details:", JSON.stringify(upsertError, null, 2));
        throw upsertError;
      }
      
      console.log("Profile updated with new avatar URL");
      
      // Set the avatar URL in the UI
      setAvatarUrl(imageUrl);
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error in selectPredefinedAvatar:", error);
      console.error("Error stack:", error.stack);
      setError(error.message || "Selection failed for unknown reason");
      
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (name !== displayName) {
      const success = await updateDisplayName(name);
      if (success) {
        toast({
          title: "Profile updated!",
          description: "Your display name has been updated successfully.",
        });
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information and how others see you on the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="text-3xl">
                      {displayName ? displayName.charAt(0).toUpperCase() : <User />}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-medium">{displayName || user?.email}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  {loading && <p className="text-sm text-muted-foreground mt-2">Processing...</p>}
                  <ProfilePictureSelector 
                    onSelectPicture={selectPredefinedAvatar}
                    currentAvatarUrl={avatarUrl} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                  id="displayName" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
              <CardDescription>Your activity on Pokémon TCG Gallery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Member since</div>
                <div className="font-medium">{joinDate}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Cards in collection</div>
                <div className="font-medium">{collectionCount}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
