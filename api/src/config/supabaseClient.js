// src/config/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL dan Key harus diset di file .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;