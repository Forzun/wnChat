import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 3001;

const wss = new WebSocketServer({ port: Number(PORT) });

console.log(`🚀 WebSocket server starting on port ${PORT}...`);

wss.on('listening', () => {
  console.log(`✅ WebSocket server is running on ws://localhost:${PORT}`);
});

wss.on('connection', (ws) => {
  console.log('👤 New client connected');

  ws.on('message', (message) => {
    console.log('📨 Received:', message.toString());
    // Echo the message back to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('👋 Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });

  // Send a welcome message
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to WebSocket server' }));
});

wss.on('error', (error) => {
  console.error('❌ Server error:', error);
});

