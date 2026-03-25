async function verify() {
  const url = 'http://localhost:5000/api/students?batch_id=1&limit=1000';
  console.log('Fetching:', url);
  try {
    const res = await fetch(url);
    console.log('Status:', res.status);
    const data = await res.json();
    if (res.ok) {
        console.log('Success! Count:', data.data?.length);
        console.log('Meta:', data.meta);
    } else {
        console.log('Failed:', JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}
verify();
