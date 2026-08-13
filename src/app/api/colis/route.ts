import { NextResponse } from "next/server";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { getServerSession } from "next-auth";
import { eq, desc } from "drizzle-orm";

// Générateur de code VEX aléatoire à chiffres uniquement (Ex: VEX-839204)
function generateTrackingCode(): string {
  const digits = "0123456789";
  let randomStr = "";
  for (let i = 0; i < 6; i++) {
    randomStr += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return `VEX-${randomStr}`;
}

// 1. CREER UN COLIS (POST)
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const {
      packageName,
      recipient,
      originCountry,
      originCity,
      destinationCountry,
      destinationCity,
      status,
    } = body;

    if (
      !packageName ||
      !recipient ||
      !originCountry ||
      !originCity ||
      !destinationCountry ||
      !destinationCity
    ) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const trackingCode = generateTrackingCode();

    const [newPackage] = await db
      .insert(packages)
      .values({
        trackingCode,
        packageName,
        recipient,
        originCountry,
        originCity,
        destinationCountry,
        destinationCity,
        status: status || "Étiquette créée",
      })
      .returning();

    return NextResponse.json(
      { message: "Colis enregistré avec succès", package: newPackage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur création colis:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du colis." },
      { status: 500 }
    );
  }
}

// 2. OBTENIR TOUS LES COLIS OU UN SEUL PAR CODE (GET)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (code) {
      const result = await db
        .select()
        .from(packages)
        .where(eq(packages.trackingCode, code.trim().toUpperCase()))
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json(
          { error: "Aucun colis trouvé avec ce numéro de suivi." },
          { status: 404 }
        );
      }
      return NextResponse.json({ package: result[0] }, { status: 200 });
    }

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const allPackages = await db
      .select()
      .from(packages)
      .orderBy(desc(packages.createdAt));

    return NextResponse.json({ packages: allPackages }, { status: 200 });
  } catch (error) {
    console.error("Erreur récupération colis:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des colis." },
      { status: 500 }
    );
  }
}

// 3. MODIFIER LE STATUT D'UN COLIS (PATCH)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "L'identifiant du colis et le nouveau statut sont requis." },
        { status: 400 }
      );
    }

    const [updatedPackage] = await db
      .update(packages)
      .set({ status })
      .where(eq(packages.id, id))
      .returning();

    if (!updatedPackage) {
      return NextResponse.json(
        { error: "Colis non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Estado actualizado correctamente.", package: updatedPackage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur modification statut:", error);
    return NextResponse.json(
      { error: "Error del servidor al actualizar el estado." },
      { status: 500 }
    );
  }
}

// 4. SUPPRIMER UN COLIS PAR SON ID (DELETE)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "El identificador de la parcela es obligatorio." },
        { status: 400 }
      );
    }

    await db.delete(packages).where(eq(packages.id, id));

    return NextResponse.json(
      { message: "Parcela eliminada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el paquete:", error);
    return NextResponse.json(
      { error: "Error del servidor durante la eliminación." },
      { status: 500 }
    );
  }
}