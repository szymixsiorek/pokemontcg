import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Calendar, LayoutGrid } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PokemonCard from "@/components/PokemonCard";

type PublicProfile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  collection_count: number;
};

type CollectionItem = {
  id: string;
  card_id: string;
  set_id: string;
};

type Pokemon = {
  id: string;
  setId: string;
  name: string;
  image: string;
  number: string;
  rarity: string;
  type: string;
};

const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loadingCollection, setLoadingCollection] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      try {
        setLoading(true);
        
        // Fetch the public profile by username using type casting to avoid deep type instantiation
        const { data: profileData, error: profileError } = await (supabase as any)
          .from('profiles')  
          .select('id, username, display_name, avatar_url, updated_at')
          .eq('username', username)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setError("Profile not found");
          return;
        }

        if (!profileData) {
          setError("Profile not found");
          return;
        }

        // Get collection count
        const { count: collectionCount } = await supabase
          .from('user_collections')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profileData.id);

        // Create a profile object with proper type safety
        const profileWithCount: PublicProfile = {
          id: profileData.id,
          username: profileData.username || username, // Fallback to URL parameter
          display_name: profileData.display_name,
          avatar_url: profileData.avatar_url,
          updated_at: profileData.updated_at,
          collection_count: collectionCount || 0
        };

        setProfile(profileWithCount);
        
        // Fetch the user's collection
        if (profileData.id) {
          await fetchUserCollection(profileData.id);
        }
        
      } catch (error) {
        console.error("Error in fetchProfile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const fetchUserCollection = async (userId: string) => {
    try {
      setLoadingCollection(true);
      
      // Fetch the user's collection (limited to 12 items for display)
      const { data, error } = await supabase
        .from('user_collections')
        .select('id, card_id, set_id')
        .eq('user_id', userId)
        .order('added_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error("Error fetching collection:", error);
        return;
      }

      setCollection(data as CollectionItem[]);
      
    } catch (error) {
      console.error("Error in fetchUserCollection:", error);
    } finally {
      setLoadingCollection(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-96" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center py-10">
              <User className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The user profile you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/" className="text-primary hover:underline">
                Return to Home
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-3xl">
                    {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : profile?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profile?.display_name || profile?.username}</CardTitle>
                  <CardDescription className="text-lg">@{profile?.username}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <LayoutGrid className="h-4 w-4" />
                  <span>{profile?.collection_count} cards in collection</span>
                </div>
                {profile?.updated_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Last seen {new Date(profile.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Collection Highlights</CardTitle>
                {profile?.collection_count > 0 && (
                  <Link to={`/collection/${profile.username}`} className="text-sm text-primary hover:underline">
                    View full collection
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loadingCollection ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="aspect-[3/4] w-full rounded-md" />
                  ))}
                </div>
              ) : collection.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {collection.map((item) => (
                    <PokemonCard 
                      key={item.id} 
                      card={{
                        id: item.card_id,
                        setId: item.set_id,
                        name: "",
                        image: "",
                        number: "",
                        rarity: "",
                        type: "pokemon" // Adding required type property
                      }}
                      inCollection={false}
                      onCollectionUpdate={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>This user hasn't added any cards to their collection yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
