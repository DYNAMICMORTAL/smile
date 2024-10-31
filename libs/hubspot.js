import axios from 'axios';

const fetchHubSpotData = async (accessToken) => {
  try {
    const response = await axios.get("https://api.hubapi.com/crm/v3/objects/contacts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching data from HubSpot:", error);
    throw new Error("Failed to fetch data from HubSpot");
  }
};

export default fetchHubSpotData;
