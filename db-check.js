import { supabaseAdmin } from './src/config/supabase.js';

const checkDb = async () => {
  try {
    const { data: students, count: sCount } = await supabaseAdmin.from('students').select('*', { count: 'exact' });
    const { data: parents, count: pCount } = await supabaseAdmin.from('student_parents').select('*', { count: 'exact' });
    const { data: addresses, count: aCount } = await supabaseAdmin.from('student_addresses').select('*', { count: 'exact' });

    console.log('--- DB Audit ---');
    console.log('Students:', sCount, students?.length);
    console.log('Parents:', pCount, parents?.length);
    console.log('Addresses:', aCount, addresses?.length);
    
    if (parents && parents.length > 0) {
      console.log('Sample Parent:', JSON.stringify(parents[0], null, 2));
    }
    if (addresses && addresses.length > 0) {
      console.log('Sample Address:', JSON.stringify(addresses[0], null, 2));
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDb();
