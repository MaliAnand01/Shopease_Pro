
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// Load environment variables manually since we don't have the context here easily without a runner
// But for this script I'll just use the values from the .env.local file I read earlier or assume the user runs it with env
// Actually, I can just hardcode the URL/Key for this temporary script or read them. 
// Let's rely on node --env-file which I've been using successfully.

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const checkCategories = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('category');

    if (error) {
        console.error(error);
        return;
    }

    // Get unique categories
    const categories = [...new Set(data.map(d => d.category))];
    console.log("Distinct Categories in DB:", categories);
};

checkCategories();
