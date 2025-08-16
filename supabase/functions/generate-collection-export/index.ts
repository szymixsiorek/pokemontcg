
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const { userId, format, cards } = await req.json();
    
    if (!userId || !format || !cards) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Processing export request: ${format} format for ${cards.length} cards`);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}-collection.${format === 'pdf' ? 'pdf' : 'png'}`;
    const filePath = `${userId}/${filename}`;
    
    // For demo purposes, create a simple text file mimicking the format
    let fileContent = '';
    let contentType = '';
    
    if (format === 'pdf') {
      // This would be replaced with proper PDF generation in production
      contentType = 'application/pdf';
      fileContent = `Pokemon TCG Collection Export
Generated on: ${new Date().toISOString()}
Format: PDF
Cards: ${cards.length}

Card List:
${cards.map((card: any) => `- ${card.name} (Set: ${card.setName || 'Unknown'}, No: ${card.number})`).join('\n')}`;
    } else {
      // This would be replaced with proper image generation in production
      contentType = 'image/png';
      fileContent = `Pokemon TCG Collection Export
Generated on: ${new Date().toISOString()}
Format: Image Gallery
Cards: ${cards.length}

This would be an image gallery in production.
Card list:
${cards.map((card: any) => `- ${card.name} (Set: ${card.setName || 'Unknown'}, No: ${card.number})`).join('\n')}`;
    }
    
    const fileBuffer = new TextEncoder().encode(fileContent);
    
    console.log(`Uploading file to path: ${filePath}`);
    
    // Upload file to storage
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from('collection_exports')
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });
    
    if (uploadError) {
      console.error("Error uploading export:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to upload export", details: uploadError }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    console.log("File uploaded successfully");
    
    // Create database record
    const { error: dbError } = await supabaseAdmin
      .from('collection_exports')
      .insert({
        user_id: userId,
        file_path: filePath,
        file_type: format,
        name: `Collection Export (${format.toUpperCase()}) - ${new Date().toDateString()}`,
        card_count: cards.length
      });
      
    if (dbError) {
      console.error("Error creating export record:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to create export record", details: dbError }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    console.log("Database record created");
    
    // Generate a signed URL for download
    const { data: signedUrl, error: signedUrlError } = await supabaseAdmin
      .storage
      .from('collection_exports')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
    if (signedUrlError) {
      console.error("Error generating signed URL:", signedUrlError);
      return new Response(
        JSON.stringify({ error: "Failed to generate download link", details: signedUrlError }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    console.log("Signed URL generated");
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Export successfully created",
        downloadUrl: signedUrl,
        filePath
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error processing export:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process export request", details: String(error) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
