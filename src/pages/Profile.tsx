
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
import { User, Link as LinkIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProfilePictureSelector } from "@/components/ProfilePictureSelector";
import { Profile } from "@/types/database.types";

const ProfilePage = () => {
  const { user, displayName, updateDisplayName } = useAuth();
  const [name, setName] = useState(displayName);
  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [joinDate, setJoinDate] = useState<string>("");
  const [collectionCount, setCollectionCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [publicProfileUrl, setPublicProfileUrl] = useState<string>("");
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
      
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, username')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      console.log("Profile data received:", data);

      // If profile has an avatar_url, set it
      if (data?.avatar_url) {
        console.log("Avatar URL from database:", data.avatar_url);
        setAvatarUrl(data.avatar_url);
      }
      
      // If profile has a username, set it
      if (data?.username) {
        setUsername(data.username);
        setPublicProfileUrl(`${window.location.origin}/user/${data.username}`);
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
      
      // Update or insert profile with avatar URL
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          avatar_url: imageUrl,
          updated_at: new Date().toISOString()
        });
        
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

  const checkUsernameAvailability = async (value: string) => {
    if (!value) {
      setUsernameError(null);
      setUsernameAvailable(null);
      return;
    }
    
    // Check username format (letters, numbers, underscores only)
    if (!value.match(/^[a-zA-Z0-9_]+$/)) {
      setUsernameError("Username can only contain letters, numbers and underscores");
      setUsernameAvailable(false);
      return;
    }
    
    try {
      const { data } = await supabase
        .from('public_profiles')
        .select('id')
        .eq('username', value)
        .single();
        
      // If we found a profile with this username and it's not the current user
      if (data && data.id !== user?.id) {
        setUsernameError("Username already taken");
        setUsernameAvailable(false);
      } else {
        setUsernameError(null);
        setUsernameAvailable(true);
      }
    } catch (error) {
      // If no rows were returned, the username is available
      setUsernameError(null);
      setUsernameAvailable(true);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameAvailable(null);
  };

  const handleUsernameBlur = () => {
    if (username) {
      checkUsernameAvailability(username);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      let updateSuccess = true;
      
      // Update display name if changed
      if (name !== displayName) {
        updateSuccess = await updateDisplayName(name);
      }
      
      // Update username if changed and available
      if (username && usernameAvailable) {
        const { error: usernameError } = await supabase
          .from('profiles')
          .update({ 
            username: username,
            updated_at: new Date().toISOString()
          })
          .eq('id', user?.id);
          
        if (usernameError) {
          throw new Error("Failed to update username");
        }
        
        // Update the public profile URL
        setPublicProfileUrl(`${window.location.origin}/user/${username}`);
      }
      
      if (updateSuccess) {
        toast({
          title: "Profile updated!",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyProfileLink = () => {
    if (publicProfileUrl) {
      navigator.clipboard.writeText(publicProfileUrl);
      toast({
        title: "Link copied!",
        description: "Your public profile link has been copied to clipboard.",
      });
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
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={handleUsernameChange}
                    onBlur={handleUsernameBlur}
                    placeholder="Choose a unique username"
                    className={usernameError ? "border-red-500" : usernameAvailable ? "border-green-500" : ""}
                  />
                  {usernameAvailable === true && !usernameError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">
                      Available
                    </div>
                  )}
                </div>
                {usernameError && (
                  <p className="text-destructive text-sm">{usernameError}</p>
                )}
                <p className="text-muted-foreground text-sm">
                  Your username will be used for your public profile URL and must be unique.
                </p>
              </div>

              {username && !usernameError && (
                <div className="p-3 bg-muted rounded-md flex items-center justify-between">
                  <div className="text-sm text-muted-foreground truncate mr-2">
                    {publicProfileUrl}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyProfileLink}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateProfile} disabled={loading || (usernameError !== null && username !== "")}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
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
