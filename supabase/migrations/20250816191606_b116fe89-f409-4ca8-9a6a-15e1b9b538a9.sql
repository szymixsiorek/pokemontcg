-- Create table for mapping between different API card IDs
CREATE TABLE public.card_id_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pokemontcg_id TEXT NOT NULL,
  tcgdx_id TEXT,
  set_id TEXT NOT NULL,
  card_number TEXT NOT NULL,
  card_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.card_id_mappings ENABLE ROW LEVEL SECURITY;

-- Create policies for card ID mappings (read-only for all users)
CREATE POLICY "Card ID mappings are viewable by everyone" 
ON public.card_id_mappings 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_card_mappings_pokemontcg_id ON public.card_id_mappings(pokemontcg_id);
CREATE INDEX idx_card_mappings_tcgdx_id ON public.card_id_mappings(tcgdx_id);
CREATE INDEX idx_card_mappings_set_id ON public.card_id_mappings(set_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_card_mappings_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_card_mappings_updated_at
BEFORE UPDATE ON public.card_id_mappings
FOR EACH ROW
EXECUTE FUNCTION public.update_card_mappings_updated_at_column();