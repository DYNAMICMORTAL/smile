import axios from 'axios';

const fetchZohoData = async (accessToken) => {
  try {
    const response = await axios.get("https://www.zohoapis.com/crm/v2/Leads", {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Zoho CRM:", error);
    throw new Error("Failed to fetch data from Zoho CRM");
  }
};

export default fetchZohoData;
