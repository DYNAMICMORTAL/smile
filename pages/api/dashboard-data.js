import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import axios from 'axios';
import connectMongo from '../../libs/mongoose';
import Customer from '../../models/Customer';

export default async function handler(req, res) {
  try {
    await connectMongo();
    console.log('Connected to MongoDB Atlas');
    const filePath = path.join(process.cwd(), 'uploads', 'uploaded_data.csv');
    console.log('Processing data from:', filePath);
    
    try {
      await fs.access(filePath);
    } catch (error) {
      // If uploaded file doesn't exist, use sample data
      const samplePath = path.join(process.cwd(), 'crm_synthetic_data.csv');
      console.log('Uploaded file not found, using sample data:', samplePath);
      const sampleData = await fs.readFile(samplePath, 'utf-8');
      const parsedData = Papa.parse(sampleData, { header: true }).data;
      return res.status(200).json(parsedData);
    }

    // If we reach here, the uploaded file exists
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const parsedData = Papa.parse(fileContent, { 
      header: true,
      skipEmptyLines: true 
    }).data;

    if (!parsedData || parsedData.length === 0) {
      throw new Error('No data found in file');
    }

    // Custom filters based on Indian demographics, regional preferences, and socio-economic data
    const filteredData = parsedData.filter(item => {
      return (
        // (item.Region === 'India') &&
        (item.Tier || item.PreferredFestival || item.PreferredLanguage)
      );
    });
    // console.log('Filtered data:', filteredData);

    // Enrich customer profiles with external datasets
    for (const customer of filteredData) {
      const enrichmentData = await fetchEnrichmentData(customer);
      // console.log('Enrichment data:', enrichmentData);
      customer.enrichmentData = enrichmentData;
    }

    console.log(`Successfully processed ${filteredData.length} records`);
    res.status(200).json(filteredData);

  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ 
      message: 'Error processing data',
      error: error.message 
    });
  }
}

async function fetchEnrichmentData(customer) {
  // Placeholder implementation for fetching enrichment data
  return JSON.stringify({
    culturalEvents: ["Diwali", "Holi"],
    languagePreferences: ["Hindi", "English"],
    purchasingBehavior: ["Electronics", "Clothing"]
  });
}
