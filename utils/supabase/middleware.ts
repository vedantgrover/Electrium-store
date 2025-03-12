import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase configuration');
    return NextResponse.redirect(new URL('/error', request.url));
  }

  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // If the cookie is updated, update the cookies for the request and response
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          } catch (cookieError) {
            console.error(`Failed to set cookie ${name}:`, cookieError);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // If the cookie is removed, update the cookies for the request and response
            request.cookies.set({
              name,
              value: "",
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          } catch (cookieError) {
            console.error(`Failed to remove cookie ${name}:`, cookieError);
          }
        },
      },
    });

    // Attempt to refresh the session
    try {
      await supabase.auth.getUser();
    } catch (sessionError) {
      console.error('Session refresh failed:', sessionError);
      // Optionally redirect to login or handle session expiration
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  } catch (error) {
    console.error('Middleware session update failed:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }

    // Redirect to an error page or login
    return NextResponse.redirect(new URL('/error', request.url));
  }
};
