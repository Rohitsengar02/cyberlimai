import { NextRequest, NextResponse } from "next/server";

const IMAGE_MODELS: Record<string, string> = {
  flux: "black-forest-labs/FLUX.1-schnell",
  sdxl: "stabilityai/stable-diffusion-xl-base-1.0",
  sd15: "runwayml/stable-diffusion-v1-5",
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = "flux" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Direct Integration for Pollinations.ai Image Model (unrestricted prompt generation)
    if (model === "pollinations") {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
      
      // Let's verify the connection works by sending a fast HEAD request to check availability
      const response = await fetch(imageUrl, { method: "HEAD" });
      if (!response.ok) {
        throw new Error(`Pollinations AI image endpoint returned status ${response.status}`);
      }

      return NextResponse.json({ image: imageUrl });
    }

    // Standard Hugging Face pipeline
    const token = process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "HF_TOKEN not set on server. Add it to .env.local" },
        { status: 500 }
      );
    }

    const modelId = IMAGE_MODELS[model] ?? IMAGE_MODELS.flux;

    const res = await fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `HF API error (${res.status}): ${errText}` },
        { status: res.status }
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return NextResponse.json({ image: `data:image/png;base64,${base64}` });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
