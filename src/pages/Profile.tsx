
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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
import { Camera, User } from "lucide-react";

// Define types for profile data until Supabase types are regenerated
type Profile = {
  id: string;
  avatar_url?: string | null;
  display_name?: string | null;
  updated_at?: string;
};

// Define type for Supabase data response to help with type assertions
type ProfileResponse = {
  data: Profile | null;
  error: Error | null;
};

const Profile = () => {
  const { user, displayName, updateDisplayName } = useAuth();
  const [name, setName] = useState(displayName);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [joinDate, setJoinDate] = useState<string>("");
  const [collectionCount, setCollectionCount] = useState<number>(0);
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
      
      // Fetch the profile data from the new profiles table
      // Use type assertion to work around TypeScript error until types are regenerated
      const { data, error } = await supabase
        .from('profiles' as any)
        .select('avatar_url')
        .eq('id', user.id)
        .single() as unknown as ProfileResponse;

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      // If profile has an avatar_url, get the public URL
      if (data && data.avatar_url) {
        const { data: publicUrlData } = await supabase.storage
          .from('avatars')
          .getPublicUrl(data.avatar_url);
          
        setAvatarUrl(publicUrlData.publicUrl);
      }
    } catch (error) {
      console.log("Error loading avatar: ", error);
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

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}.${fileExt}`;
      const filePath = fileName;
      
      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update profile with avatar URL
      // Use type assertion to work around TypeScript error until types are regenerated
      const { error: updateError } = await supabase
        .from('profiles' as any)
        .upsert({ 
          id: user?.id, 
          avatar_url: filePath 
        } as any);
        
      if (updateError) {
        throw updateError;
      }
      
      setAvatarUrl(data.publicUrl);
      
      toast({
        title: "Avatar updated!",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="text-3xl">
                      {displayName ? displayName.charAt(0).toUpperCase() : <User />}
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatarUpload" 
                    className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white p-2 rounded-full cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Upload avatar</span>
                  </label>
                  <Input
                    id="avatarUpload"
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{displayName || user?.email}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
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

export default Profile;
