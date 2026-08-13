// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Protège /dashboard et toutes ses sous-routes
  matcher: ["/dashboard/:path*"],
};