import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Using the Pages Router format which NextAuth fully supports
// This file is required for NextAuth to work properly
export default NextAuth(authOptions); 