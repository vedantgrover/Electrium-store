import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CookieOptions } from "@supabase/ssr";
import { Session, User } from "@supabase/supabase-js";

export const createClient = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase configuration');
    throw new Error('Supabase configuration is incomplete');
  }

  try {
    const cookieStore = await cookies();

    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{name: string, value: string, options?: CookieOptions}>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                cookieStore.set(name, value, options);
              } catch (setCookieError) {
                console.error(`Failed to set cookie ${name}:`, setCookieError);
              }
            });
          } catch (allCookiesError) {
            console.error('Error setting cookies:', allCookiesError);
          }
        }
      },
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        autoRefreshToken: true
      }
    });
  } catch (clientCreationError) {
    console.error('Failed to create Supabase server client:', clientCreationError);
    throw clientCreationError;
  }
};

// Helper function to safely get the current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error fetching current user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Unexpected error in getCurrentUser:', error);
    return null;
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};

// Helper function to get current session
export const getCurrentSession = async (): Promise<Session | null> => {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error fetching current session:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Unexpected error in getCurrentSession:', error);
    return null;
  }
};
