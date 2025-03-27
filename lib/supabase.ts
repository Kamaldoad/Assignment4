import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://txlpbqzjlwqmxoteijiy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bHBicXpqbHdxbXhvdGVpaml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDU4MjksImV4cCI6MjA1ODU4MTgyOX0.fFjP3AXgj3g_24Y54juQr3rABcNTR4SEuMReTlPu6UU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { storage: AsyncStorage }
});
