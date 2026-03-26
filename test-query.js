import { supabaseAdmin } from './src/config/supabase.js';

async function testQuery() {
  try {
    console.log("Testing query with camelCase names...");
    const { data: d1, error: e1 } = await supabaseAdmin.from('users').select('id, email, firstName, lastName, createdAt').limit(1);
    if (e1) console.error("Query 1 failed:", e1.message);
    else console.log("Query 1 success!");

    console.log("Testing query with snake_case names...");
    const { data: d2, error: e2 } = await supabaseAdmin.from('users').select('id, email, first_name, last_name, created_at').limit(1);
    if (e2) console.error("Query 2 failed:", e2.message);
    else console.log("Query 2 success!");

    console.log("Testing query with lowercase names...");
    const { data: d3, error: e3 } = await supabaseAdmin.from('users').select('id, email, firstname, lastname, createdat').limit(1);
    if (e3) console.error("Query 3 failed:", e3.message);
    else console.log("Query 3 success!");

  } catch (error) {
    console.error("Script error:", error);
  }
}

testQuery();
