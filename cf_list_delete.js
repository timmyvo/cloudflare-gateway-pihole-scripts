require("dotenv").config();
const axios = require('axios');

const API_TOKEN = process.env.CLOUDFLARE_API_KEY;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const ACCOUNT_EMAIL = process.env.CLOUDFLARE_ACCOUNT_EMAIL;

// Function to read Cloudflare Zero Trust lists
async function getZeroTrustLists() {
  try {
    const response = await axios.get(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/gateway/lists`,
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Auth-Email': ACCOUNT_EMAIL,
          'X-Auth-Key': API_TOKEN,
        },
      }
    );

    return response.data.result;
  } catch (error) {
    console.error('Error fetching lists:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

async function deleteList(listId, listName) {
  try {
    const response = await axios.request({
      method: 'DELETE',
      url: `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/gateway/lists/${listId}`,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Auth-Email': ACCOUNT_EMAIL,
        'X-Auth-Key': API_TOKEN,
      },
    });
    console.log('Success:', response.data.success, `Deleted list ${listName} with ID ${listId}`);
  } catch (error) {
    console.error(`Error deleting list ${listName} with ID ${listId}:`, error);
  }
}

async function main() {
  try {
    const lists = await getZeroTrustLists();
    if (!lists) {
      return console.warn("\nNo file lists found - this is not an issue if it's your first time running this script. Exiting.");
    }
    console.log(`\nFound total ${lists.length} lists are currently in effect`);
    
    const cgps_lists = lists.filter(list => list.name.startsWith('CGPS List'));
    if (!cgps_lists.length) {
      return console.warn("\nNo lists with matching name found - this is not an issue if you haven't created any filter lists before. Exiting.");
    }
    console.log(`\nFound ${cgps_lists.length} CGPS lists that will be deleted.`);

    for (const list of cgps_lists) {
      console.log(`Deleting list ${list.name} with ID ${list.id}`);
      await deleteList(list.id, list.name);
      await sleep(1500); // Cloudflare API rate limit is 1200 requests per 5 minutes, so we sleep for 3000ms to be safe
    }
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main();

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
