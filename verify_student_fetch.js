import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function verifyStudentFetch() {
  console.log('--- Verifying Student Fetch with Batch Filter & High Limit ---');
  try {
    // We assume batch_id=1 exists or at least we check for status 200 vs 400
    const res = await axios.get(`${BASE_URL}/students?batch_id=1&limit=1000`);
    console.log('GET /students?batch_id=1&limit=1000:', res.status);
    console.log('Data count:', res.data.data?.length);
    console.log('Meta:', res.data.meta);
  } catch (error) {
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

verifyStudentFetch();
