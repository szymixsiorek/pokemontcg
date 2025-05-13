
// Define types for Supabase interactions
export type Profile = {
  id: string;
  display_name?: string | null;
  avatar_url?: string | null;
  updated_at?: string;
};

// Extend the Database type to include our profiles table
declare module '@supabase/supabase-js' {
  interface Database {
    public: {
      Tables: {
        profiles: {
          Row: Profile;
          Insert: Partial<Profile>;
          Update: Partial<Profile>;
        };
        user_collections: {
          Row: {
            id: string;
            user_id: string;
            added_at: string | null;
            card_id: string;
            set_id: string;
          };
        };
      };
    };
  }
}
