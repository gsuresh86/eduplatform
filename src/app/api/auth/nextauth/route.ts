import NextAuth from "next-auth/next";
import { authOptions } from "./options";

// Create a handler for the nextauth route that can be used as a catch-all route
const handler = NextAuth(authOptions);

// Handle both GET and POST methods
export { handler as GET, handler as POST }; 