import { NextRequest } from "next/server";
import { mockStream } from "@/lib/services/MockDataStream";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | undefined;
  const stream = new ReadableStream({
    start(controller) {
      const send = (r: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(r)}\n\n`));
      };
      unsubscribe = mockStream.onReading(send);
      // Send initial
      send(mockStream.current());
    },
    cancel() {
      unsubscribe?.();
    }
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
