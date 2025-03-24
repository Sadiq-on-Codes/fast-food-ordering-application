export default async (request, context) => {
  // Handle CORS
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const { customer_name, total_amount } = await request.json();

    // Get environment variables
    const accountSid = Deno.env.get("VITE_TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("VITE_TWILIO_AUTH_TOKEN");
    const fromNumber = Deno.env.get("VITE_TWILIO_WHATSAPP_NUMBER");
    const toNumber = Deno.env.get("VITE_WHATSAPP_RECIPIENT_NUMBER");

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const bodyParams = new URLSearchParams();
    bodyParams.append("From", fromNumber);
    bodyParams.append("To", toNumber);
    bodyParams.append("Body", `New order placed by ${customer_name}. Total amount: ₵${Number(total_amount).toFixed(2)}`);

    const twilioResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(`${accountSid}:${authToken}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
    });

    if (!twilioResponse.ok) {
      throw new Error(await twilioResponse.text());
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};