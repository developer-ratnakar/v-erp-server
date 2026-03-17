async function syncProductionRBAC() {
  const url = 'https://v-erp-server.onrender.com/api/rbac/bootstrap-admin';
  const data = {
    email: 'panigrahiratnakar61@gmail.com',
    secret: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9I4NjAxMzAsImV4cCI6MjA4ODQzNjEzMH0'
  };

  console.log(`Sending sync request to: ${url}...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('SUCCESS! Production sync complete.');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.error('FAILED! Server returned an error.');
      console.error('Status:', response.status);
      console.error('Error Details:', JSON.stringify(result, null, 2));
      
      if (response.status === 500) {
        console.log('\n--- Troubleshooting ---');
        console.log('If you see 500 Internal Server Error, please make sure you have PUSHED the latest code to GitHub and Render has finished deploying.');
      }
    }
  } catch (error) {
    console.error('Network Error:', error.message);
  }
}

syncProductionRBAC();
