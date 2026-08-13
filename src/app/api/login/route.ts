import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (email === envEmail && password === envPassword) {
      // Authentification réussie
      const response = NextResponse.json({ success: true });
      
      // Cookie de session simple
      response.cookies.set("admin_session", "authenticated", {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 1 jour
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "E-mail ou mot de passe incorrect." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}