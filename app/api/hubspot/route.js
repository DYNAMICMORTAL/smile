import { NextResponse } from "next/server";
import axios from "axios";
import connectMongo from "../../libs/mongoose";
import Customer from "../../models/Customer";

export async function POST(req) {
  await connectMongo();

  const { accessToken } = await req.json();

  if (!accessToken) {
    return NextResponse.json({ error: "Access token is required" }, { status: 400 });
  }

  try {
    const response = await axios.get("https://api.hubapi.com/crm/v3/objects/contacts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const contacts = response.data.results;

    for (const contact of contacts) {
      await Customer.create({
        name: contact.properties.firstname + " " + contact.properties.lastname,
        email: contact.properties.email,
        phone: contact.properties.phone,
        company: contact.properties.company,
        leadSource: "HubSpot",
      });
    }

    return NextResponse.json({ message: "Data ingested successfully" });
  } catch (error) {
    console.error("Error fetching data from HubSpot:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
