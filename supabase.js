const SUPABASE_URL =
    "https://efurdctmrvrufedhgnkz.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_fxOQAfn6kTzG4jJeqfmj_A_CZkiwkuH";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );