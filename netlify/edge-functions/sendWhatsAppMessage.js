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

    const accountSid = context.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = context.env.VITE_TWILIO_AUTH_TOKEN;
    const fromNumber = context.env.VITE_TWILIO_WHATSAPP_NUMBER;
    const toNumber = context.env.VITE_TWILIO_RECIPIENT_NUMBER;

    if (!accountSid || !authToken || !fromNumber || !toNumber) {
      return new Response(
        JSON.stringify({ error: "Missing Twilio configuration" }), 
        { 
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

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
      const errText = await twilioResponse.text();
      return new Response(
        JSON.stringify({ error: errText }), 
        { 
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }), 
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};