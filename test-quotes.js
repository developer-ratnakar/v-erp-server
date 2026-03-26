import { supabaseAdmin } from './src/config/supabase.js';

async function testQuotes() {
  try {
    console.log("Testing query with double quotes for camelCase...");
    const { data, error } = await supabaseAdmin.from('users').select('id, email, "firstName", "lastName", "createdAt"').limit(1);
    
    if (error) {
       console.error("Query failed:", error.message);
    } else {
       console.log("Query success!");
       console.log("Data:", data[0]);
    }
  } catch (error) {
    console.error("Script error:", error);
  }
}

testQuotes();
