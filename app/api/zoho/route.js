import { NextResponse } from "next/server";
import axios from "axios";
import connectMongo from "../../../libs/mongo.mjs";
import Customer from "../../../models/Customer";

export async function POST(req) {
  await connectMongo();

  const { accessToken } = await req.json();

  if (!accessToken) {
    return NextResponse.json({ error: "Access token is required" }, { status: 400 });
  }

  try {
    const response = await axios.get("https://www.zohoapis.com/crm/v2/Leads", {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });

    const leads = response.data.data;

    for (const lead of leads) {
      await Customer.create({
        name: lead.Full_Name,
        email: lead.Email,
        phone: lead.Phone,
        company: lead.Company,
        leadSource: lead.Lead_Source,
      });
    }

    return NextResponse.json({ message: "Data ingested successfully" });
  } catch (error) {
    console.error("Error fetching data from Zoho CRM:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
