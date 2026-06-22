import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const TEXT_MODELS: Record<string, string> = {
  mistral: "mistralai/Mistral-7B-Instruct-v0.3",
  llama: "meta-llama/Llama-3.2-3B-Instruct",
  qwen: "Qwen/Qwen2.5-7B-Instruct",
  phi: "microsoft/Phi-3.5-mini-instruct",
};

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate API Key
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Bearer token" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.replace("Bearer ", "").trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Unauthorized: API Key is empty" },
        { status: 401 }
      );
    }

    const keyDoc = await getDoc(doc(db, "apiKeys", apiKey));
    if (!keyDoc.exists()) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid API Key" },
        { status: 401 }
      );
    }

    const keyData = keyDoc.data();
    if (keyData.status !== "active") {
      return NextResponse.json(
        { error: "Unauthorized: API Key has been revoked" },
        { status: 401 }
      );
    }

    // 2. Parse Request Payload
    const { prompt, systemInstruction, model = "mistral", stream = true } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing required parameter: prompt" },
        { status: 400 }
      );
    }

    // Compile messages array
    const messages = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    // 3. Forward to AI Engine
    if (model === "pollinations" || model === "openai") {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
          model: "openai", // vision/chat model
          stream: stream
        })
      });

      if (!response.ok) {
        throw new Error(`Pollinations AI error status ${response.status}`);
      }

      if (stream) {
        return new NextResponse(response.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      } else {
        const text = await response.text();
        return NextResponse.json({ result: text });
      }
    }

    // For standard Hugging Face model
    const token = process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "HF_TOKEN not set on server. Configure it on backend" },
        { status: 500 }
      );
    }

    const modelId = TEXT_MODELS[model] ?? TEXT_MODELS.mistral;
    
    // Construct prompt string including system instructions if present
    const formattedPrompt = systemInstruction 
      ? `System: ${systemInstruction}\n\nUser: ${prompt}\n\nAssistant:`
      : prompt;

    const res = await fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: formattedPrompt,
          parameters: { max_new_tokens: 500, return_full_text: false },
          stream: stream
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

    if (stream) {
      return new NextResponse(res.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } else {
      const data = await res.json();
      return NextResponse.json({ result: data[0]?.generated_text || data });
    }

  } catch (err: any) {
    console.error("API Chat route error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
