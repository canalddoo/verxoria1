import { NextResponse } from "next/server";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: "Por favor, introduzca un número de seguimiento." },
        { status: 400 }
      );
    }

    // Recherche insensible à la casse
    const result = await db
      .select()
      .from(packages)
      .where(eq(packages.trackingCode, code.trim().toUpperCase()))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "No se ha encontrado ningún paquete para este número de seguimiento." },
        { status: 404 }
      );
    }

    return NextResponse.json({ package: result[0] }, { status: 200 });
  } catch (error) {
    console.error("Error de seguimiento del paquete:", error);
    return NextResponse.json(
      { error: "Se produjo un error del servidor durante la búsqueda." },
      { status: 500 }
    );
  }
}