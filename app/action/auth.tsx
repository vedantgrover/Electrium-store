"use server";

import { createClient } from "@/utils/supabase/server";
import { 
  SignUpSchema, 
  LoginSchema, 
  ForgotPasswordSchema, 
  ResetPasswordSchema 
} from "../lib/definitions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { encodedRedirect } from "@/utils/encodedRedirect";

export async function signup(formData: FormData) {
  const validatedFields = SignUpSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");
  const first_name = formData.get("first_name");
  const last_name = formData.get("last_name");

  if (!email || !password || !first_name || !last_name) {
    return {
      errors: { form: ["All fields are required"] }
    };
  }

  const { error } = await supabase.auth.signUp({
    email: email.toString(),
    password: password.toString(),
    options: {
      data: {
        first_name: first_name.toString(),
        last_name: last_name.toString(),
      }
    }
  });

  if (error) {
    return {
      errors: { form: [error.message] }
    };
  }

  revalidatePath("/", "layout");
  return redirect(`/email-verification?email=${encodeURIComponent(email.toString())}`);
}

export async function login(formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      errors: { form: ["Email and password are required"] }
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.toString(),
    password: password.toString(),
  });

  if (error) {
    return {
      errors: { form: [error.message] }
    };
  }

  revalidatePath("/", "layout");
  return redirect("/checkout");
}

export const forgotPasswordAction = async (formData: FormData) => {
  const validatedFields = ForgotPasswordSchema.safeParse({
    email: formData.get("email")
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const validatedFields = ResetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password.toString(),
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/reset-password",
      `Password update failed (Code: ${error.code ?? 'unknown'})`
    );
  }

  return encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};