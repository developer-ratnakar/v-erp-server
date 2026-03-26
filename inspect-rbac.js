import { supabaseAdmin } from './src/config/supabase.js';

async function checkRBAC() {
  try {
    console.log("Checking roles table...");
    const { data: r, error: re } = await supabaseAdmin.from('roles').select('*').limit(1);
    if (r && r.length > 0) console.log("Roles columns:", Object.keys(r[0]));

    console.log("Checking permissions table...");
    const { data: p, error: pe } = await supabaseAdmin.from('permissions').select('*').limit(1);
    if (p && p.length > 0) console.log("Permissions columns:", Object.keys(p[0]));
    
  } catch (error) {
    console.error("Script error:", error);
  }
}

checkRBAC();
