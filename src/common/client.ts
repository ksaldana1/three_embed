import { createClient } from "@supabase/supabase-js";
import { Database } from "../generated/database.types";

console.log(import.meta.env.VITE_SUPABASE_KEY);

export const client = createClient<Database>(
  "https://ndxvdeqzmhnxzagdxytn.supabase.co",
  import.meta.env.VITE_SUPABASE_KEY
);
