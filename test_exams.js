import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
// We need an admin token to test. 
// For this scratch script, we can either hardcode one from a previous session or assume the server allows local testing.
// However, I'll just check if the endpoints are registered and returning proper 401/403 (which means they exist).

async function testExams() {
  console.log('--- Testing Exams Endpoints ---');
  try {
    const res = await axios.get(`${BASE_URL}/exams`);
    console.log('GET /exams:', res.status);
  } catch (error) {
    console.log('GET /exams (expected 401 if unauthorized):', error.response?.status);
  }

  try {
    const res = await axios.post(`${BASE_URL}/exams/1/marks/bulk`, []);
    console.log('POST /exams/1/marks/bulk:', res.status);
  } catch (error) {
    console.log('POST /exams/1/marks/bulk (expected 401 if unauthorized):', error.response?.status);
  }

  try {
    const res = await axios.post(`${BASE_URL}/exams/1/results/generate`);
    console.log('POST /exams/1/results/generate:', res.status);
  } catch (error) {
    console.log('POST /exams/1/results/generate (expected 401 if unauthorized):', error.response?.status);
  }
}

testExams();
