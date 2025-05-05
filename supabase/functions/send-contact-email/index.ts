
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactEmailRequest = await req.json();

    if (!name || !email || !message) {
      throw new Error("Name, email, and message are required");
    }

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Send notification email to the site owner
    const emailResponse = await resend.emails.send({
      from: "Pokemon TCG Gallery <no-reply@resend.dev>",
      to: ["szymek04sawicki@gmail.com"],
      reply_to: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.postimg.cc/xjWWBNCG/Projekt-bez-nazwy-1.png" alt="Pokémon TCG Gallery" style="max-width: 200px; height: auto;">
          </div>
          <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">New Message from Contact Form</h2>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${currentDate} at ${currentTime}</p>
          </div>
          <div style="background-color: #ffffff; border-left: 4px solid #4a86e8; padding: 15px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="white-space: pre-line;">${message}</p>
          </div>
          <div style="color: #666; font-size: 14px; text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
            <p>This email was sent from the contact form on Pokémon TCG Gallery.</p>
            <p>Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to the user who submitted the form
    console.log("Sending confirmation email to:", email);
    await resend.emails.send({
      from: "Pokemon TCG Gallery <no-reply@resend.dev>",
      to: [email],
      subject: "Thank you for contacting Pokemon TCG Gallery",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.postimg.cc/xjWWBNCG/Projekt-bez-nazwy-1.png" alt="Pokémon TCG Gallery" style="max-width: 200px; height: auto;">
          </div>
          <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Thank you for your message!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for reaching out to the Pokémon TCG Gallery team. We have received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <p style="white-space: pre-line;">${message}</p>
          </div>
          <p>If you have any additional questions or information to provide, feel free to reply directly to this email.</p>
          <p>Best regards,<br>The Pokémon TCG Gallery Team</p>
          <div style="color: #666; font-size: 14px; text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
            <p>&copy; ${new Date().getFullYear()} Pokémon TCG Gallery. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
