import { supabaseAdmin } from './src/config/supabase.js';

async function checkColumns() {
  try {
    console.log("Fetching first row from users table...");
    const { data, error } = await supabaseAdmin.from('users').select('*').limit(1);
    
    if (error) {
       console.error("Query error:", error);
       return;
    }
    
    if (data && data.length > 0) {
      console.log("Columns found:", Object.keys(data[0]));
    } else {
      console.log("No users found in table.");
    }
  } catch (error) {
    console.error("Script error:", error);
  }
}

checkColumns();
