// lib/client-auth.ts
"use client";
import { signIn, signOut } from "next-auth/react";

export const login = async () => signIn("github", { callbackUrl: "/" });
export const logout = async () => signOut({ callbackUrl: "/" });