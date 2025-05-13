import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Or: require('dotenv').config();


const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!; // Use service role for backend

export const supabase = createClient(supabaseUrl, supabaseKey);
