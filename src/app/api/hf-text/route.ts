import { NextRequest, NextResponse } from "next/server";

const TEXT_MODELS: Record<string, string> = {
  mistral: "mistralai/Mistral-7B-Instruct-v0.3",
  llama: "meta-llama/Llama-3.2-3B-Instruct",
  qwen: "Qwen/Qwen2.5-7B-Instruct",
  phi: "microsoft/Phi-3.5-mini-instruct",
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = "mistral" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    if (model === "pollinations") {
      // Return a ReadableStream to support real-time word-by-word streaming on the client
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: prompt }
          ],
          stream: true // Enable streaming on Pollinations API
        })
      });

      if (!response.ok) {
        throw new Error(`Pollinations AI returned status ${response.status}`);
      }

      // Stream the response directly to the client
      return new NextResponse(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // For standard Hugging Face pipeline (Hugging Face does not support serverless streaming easily without direct SSE parsing)
    // We will parse it and simulate a stream, or stream it. Let's make HF stream too!
    const token = process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "HF_TOKEN not set on server. Add it to .env.local" },
        { status: 500 }
      );
    }

    const modelId = TEXT_MODELS[model] ?? TEXT_MODELS.mistral;

    // Use Hugging Face Serverless streaming endpoint by adding "/v1/chat/completions" or using standard SSE
    // Since HF Inference API supports streaming for text generation at standard model path
    const res = await fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 250, return_full_text: false },
          stream: true // HF stream option
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `HF API error (${res.status}): ${errText}` },
        { status: res.status }
      );
    }

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
