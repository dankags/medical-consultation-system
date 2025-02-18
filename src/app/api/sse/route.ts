// pages/api/sse.ts
declare global {
  // eslint-disable-next-line no-var
  var sseClients: Array<{ id: number; res: Response }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function handler(req: Request, res: any) {
  if (req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    global.sseClients = global.sseClients || [];
    const clientId = Date.now();

    global.sseClients.push({ id: clientId, res });
    console.log(`Client ${clientId} connected to SSE`);

    // Send an initial event (optional)
    res.write(`data: ${JSON.stringify({ message: 'Connected to SSE stream', clientId })}\n\n`);

      req.body?.getReader().closed.finally(() => {
        console.log(`Client ${clientId} disconnected`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        global.sseClients = global.sseClients.filter((client: any) => client.id !== clientId);
      });
 
  } else {
    res.status(405).end();
  }
}
