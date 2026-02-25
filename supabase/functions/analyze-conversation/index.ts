import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, previousAnalyses } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context from previous analyses
    let contextBlock = "";
    if (previousAnalyses && previousAnalyses.length > 0) {
      contextBlock = `\n\nCONTEXTE DES ANALYSES PRÉCÉDENTES DE CET UTILISATEUR (pour cohérence du storyline) :\n`;
      for (const a of previousAnalyses.slice(0, 5)) {
        contextBlock += `- Mood précédent : ${a.mood_analysis || "N/A"}\n`;
        if (a.responses?.ndaanaan?.[0]) contextBlock += `  Dernière réponse suggérée : "${a.responses.ndaanaan[0]}"\n`;
      }
      contextBlock += `\nUtilise ce contexte pour que les nouvelles réponses soient cohérentes avec l'évolution de la conversation. Adapte le ton si la relation progresse.\n`;
    }

    const systemPrompt = `Tu es un expert en séduction urbaine et en communication sur les réseaux sociaux, spécialisé dans le contexte culturel sénégalais et africain francophone.

Analyse cette capture d'écran de conversation (WhatsApp ou Instagram) et génère des réponses de drague intelligentes.

Tu dois répondre UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "rizzScore": <nombre entre 0 et 100 représentant les chances de succès>,
  "moodAnalysis": "<courte analyse du mood de la conversation en 1 phrase>",
  "responses": {
    "ndaanaan": [
      "<réponse 1 poétique, respectueuse, classe>",
      "<réponse 2 poétique, respectueuse, classe>",
      "<réponse 3 poétique, respectueuse, classe>"
    ],
    "taquin": [
      "<réponse 1 humour, taquinerie, challenge>",
      "<réponse 2 humour, taquinerie, challenge>",
      "<réponse 3 humour, taquinerie, challenge>"
    ],
    "cash": [
      "<réponse 1 directe, proposition de date>",
      "<réponse 2 directe, proposition de date>",
      "<réponse 3 directe, proposition de date>"
    ]
  }
}

RÈGLES IMPORTANTES:
- Mixe français correct et argot local (Wawaw, Enjaillement, T'es dans le game, Ndaanaan, etc.)
- Emojis bien dosés (1-2 par message max)
- Pas de clichés bateaux, sois percutant et naturel
- Adapte les réponses au contexte visible dans la capture
- Punchlines originales adaptées aux réseaux sociaux
- Pas de ponctuation excessive
- Sois naturel comme si tu parlais à un pote${contextBlock}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyse cette capture d'écran de conversation et génère les réponses de drague selon les 3 styles demandés.",
                },
                {
                  type: "image_url",
                  image_url: { url: imageBase64 },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de requêtes, réessaie dans un moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits IA épuisés." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Erreur du moteur IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Réponse IA invalide, réessaie." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-conversation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
