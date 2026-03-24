import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId, title, year, era } = await req.json();

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not set");

    const SYSTEM = `You are an Islamic history scholar specializing in the Prophetic biography (Seerah). 
Based on 'The Sealed Nectar' (Ar-Raheeq Al-Makhtum) by Safiur Rahman Mubarakpuri, Ibn Hisham's Seerah, and authenticated hadith collections (Sahih al-Bukhari and Sahih Muslim), write detailed narratives for the given event.

Return ONLY valid JSON with these fields:
- "full_story": Arabic narrative (1000-2000 characters). Write in formal classical Arabic style.
- "full_story_en": English narrative (1000-2000 characters). Write in scholarly but accessible English.
- "hadith_references": Array of strings citing relevant hadith (e.g. "Sahih al-Bukhari, Book 64, Hadith 4418")
- "quran_references": Array of strings citing relevant Quran verses (e.g. "Surah At-Tawbah 9:118")

IMPORTANT: Return ONLY the JSON object, no markdown, no code blocks.`;

    const prompt = `Write a detailed scholarly narrative about: ${title} (${year}, ${era} period)`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`AI gateway error: ${resp.status} - ${err}`);
    }

    const data = await resp.json();
    let content = data.choices[0].message.content.trim();
    
    // Clean markdown
    if (content.startsWith("```")) {
      content = content.split("\n").slice(1).join("\n");
    }
    if (content.endsWith("```")) {
      content = content.slice(0, -3);
    }
    content = content.trim();
    if (content.startsWith("json")) {
      content = content.slice(4).trim();
    }

    const parsed = JSON.parse(content);

    // Update the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("timeline_events")
      .update({
        full_story: parsed.full_story,
        full_story_en: parsed.full_story_en,
        hadith_references: parsed.hadith_references || [],
        quran_references: parsed.quran_references || [],
      })
      .eq("id", eventId);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, eventId, title }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
