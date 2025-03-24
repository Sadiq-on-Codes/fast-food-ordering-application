/// <reference lib="deno.ns" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

console.log("Hello from Functions!");

export default async function (req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { customer_name, total_amount } = await req.json();

    const accountSid = Deno.env.get("VITE_TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("VITE_TWILIO_AUTH_TOKEN");
    const fromNumber = Deno.env.get("VITE_TWILIO_WHATSAPP_NUMBER");
    const toNumber = Deno.env.get("VITE_TWILIO_RECIPIENT_NUMBER");

    if (!accountSid || !authToken || !fromNumber || !toNumber) {
      return new Response(JSON.stringify({ error: "Missing Twilio configuration" }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const bodyParams = new URLSearchParams();
    bodyParams.append("From", fromNumber);
    bodyParams.append("To", toNumber);
    bodyParams.append("Body", `New order placed by ${customer_name}. Total amount: ₵${Number(total_amount).toFixed(2)}`);

    const authHeader = "Basic " + btoa(`${accountSid}:${authToken}`);

    const twilioResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
    });

    if (!twilioResponse.ok) {
      const errText = await twilioResponse.text();
      return new Response(JSON.stringify({ error: errText }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Make sure to include CORS headers in all responses
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sendWhatsAppMessage' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
