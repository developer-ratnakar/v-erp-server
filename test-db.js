import { supabaseAdmin } from "./src/config/supabase.js";

async function testConnection() {
  try {
    console.log("Testing Supabase connection...");
    const { data, error } = await supabaseAdmin.from("academic_sessions").select("*").limit(1);
    
    if (error) {
      console.error("Supabase Error:", error.message);
      if (error.message.includes("fetch failed")) {
        console.error("HINT: It seems like the connection to Supabase failed. Check your internet or if the instance is paused.");
      }
    } else {
      console.log("Connection successful!");
      console.log("Data:", data);
    }
  } catch (err) {
    console.error("Unexpected Error:", err.message);
  }
}

testConnection();
