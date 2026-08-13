import { NextResponse } from "next/server";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { getServerSession } from "next-auth";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupération de tous les colis
    const allPackages = await db
      .select()
      .from(packages)
      .orderBy(desc(packages.createdAt));

    const total = allPackages.length;

    // Calcul des statistiques
    const enMouvement = allPackages.filter((p) =>
      ["Pris en charge", "En transit", "En cours de livraison"].includes(p.status)
    ).length;

    const livres = allPackages.filter((p) => p.status === "Livré").length;

    const etiquettesCrees = allPackages.filter(
      (p) => p.status === "Étiquette créée"
    ).length;

    // Les 5 derniers colis
    const recentPackages = allPackages.slice(0, 5);

    return NextResponse.json(
      {
        stats: {
          total,
          enMouvement,
          livres,
          etiquettesCrees,
        },
        recentPackages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur récupération stats:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des statistiques." },
      { status: 500 }
    );
  }
}