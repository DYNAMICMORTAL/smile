import { NextResponse } from "next/server";
import axios from "axios";
import connectMongo from "../../../libs/mongo.mjs";
import Customer from "../../../models/Customer";

export async function POST(req) {
  await connectMongo();

  const { customerId, enrichmentType } = await req.json();

  if (!customerId || !enrichmentType) {
    return NextResponse.json({ error: "Customer ID and enrichment type are required" }, { status: 400 });
  }

  try {
    let enrichmentData;

    switch (enrichmentType) {
      case "culturalEvents":
        enrichmentData = await fetchCulturalEventsData(customerId);
        break;
      case "languagePreferences":
        enrichmentData = await fetchLanguagePreferencesData(customerId);
        break;
      case "purchasingBehavior":
        enrichmentData = await fetchPurchasingBehaviorData(customerId);
        break;
      default:
        return NextResponse.json({ error: "Invalid enrichment type" }, { status: 400 });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    customer.enrichmentData = enrichmentData;
    await customer.save();

    return NextResponse.json({ message: "Customer profile enriched successfully" });
  } catch (error) {
    console.error("Error enriching customer profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function fetchCulturalEventsData(customerId) {
  // Fetch cultural events data from external dataset
  // Placeholder implementation
  return { events: ["Diwali", "Holi"] };
}

async function fetchLanguagePreferencesData(customerId) {
  // Fetch language preferences data from external dataset
  // Placeholder implementation
  return { preferredLanguages: ["Hindi", "English"] };
}

async function fetchPurchasingBehaviorData(customerId) {
  // Fetch purchasing behavior data from external dataset
  // Placeholder implementation
  return { purchasingPatterns: ["Electronics", "Clothing"] };
}
