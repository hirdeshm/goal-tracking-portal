import { supabase } from "./supabase";

export async function signUp(
  email: string,
  password: string
) {
  const response = await supabase.auth.signUp({
    email,
    password,
  });

  const user = response.data.user;

  if (user) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: user.email?.split("@")[0],
      role: "employee",
    });
  }

  return response;
}

export async function signIn(
  email: string,
  password: string
) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}