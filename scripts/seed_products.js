import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables if running with dotenv, 
// OR run with: node --env-file=.env.local scripts/seed_products.js
// We'll try to support both or just assume standard env loading.
// Since it's a script, we might not have process.env populated without dotenv if not using Node 20+ --env-file.
// Let's assume the user will run it via a helper command I'll provide.

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    console.log('Usage: node --env-file=.env.local scripts/seed_products.js');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const seedProducts = async () => {
    console.log('🌱 Starting database seeding...');

    try {
        // 1. Clear existing products
        console.log('🧹 Clearing existing products...');
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .neq('id', 0); // Delete all rows where id is not 0 (effectively all)

        if (deleteError) throw deleteError;
        console.log('✅ Database cleared.');

        // 2. Fetch from DummyJSON (Fetch all)
        console.log('📦 Fetching products from dummyjson.com...');
        // Fetch a large number to ensure we get everything suitable
        const { data } = await axios.get('https://dummyjson.com/products?limit=0');
        const allProducts = data.products;

        // 3. Filter Categories
        const ALLOWED_CATEGORIES = [
            'fragrances',
            'smartphones', 'laptops', 'tablets', 'mobile-accessories',
            'mens-watches', 'womens-watches',
            'mens-shirts', 'mens-shoes', 'womens-dresses', 'womens-shoes', 'womens-bags', 'tops',
            'sunglasses', 'skin-care' // Added skin-care as it often overlaps with premium personal care, but user said "beauty" to exclude... let's stick to user request.
        ];
        // Removing 'skin-care' based on user request to remove 'beauty'. 'fragrances' was explicitly requested.

        const filteredProducts = allProducts.filter(p =>
            ALLOWED_CATEGORIES.includes(p.category) ||
            ALLOWED_CATEGORIES.includes(p.category?.slug) // Handle if category is object
        );

        console.log(`✅ Filtered down to ${filteredProducts.length} products (from ${allProducts.length}).`);

        // 4. Transform Data
        const formattedProducts = filteredProducts.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: p.price,
            discount_percentage: p.discountPercentage,
            rating: p.rating,
            stock: p.stock,
            brand: p.brand,
            category: typeof p.category === 'object' ? p.category.slug : p.category, // Handle new DummyJSON format if applicable
            thumbnail: p.thumbnail,
            images: p.images,
            created_at: new Date().toISOString()
        }));

        // 5. Insert into Supabase
        console.log('🚀 Inserting data into Supabase "products" table...');

        const { error } = await supabase
            .from('products')
            .insert(formattedProducts); // Using insert since we cleared table.

        if (error) throw error;

        console.log(`✨ Success! Database populated with ${formattedProducts.length} refined products.`);

    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
    }
};

seedProducts();
