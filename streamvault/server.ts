import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Server Intelligence & Recommendation Endpoint
app.post('/api/ai/analyze-server', async (req, res) => {
  try {
    const { url, demandType, currentServer } = req.body;

    const prompt = `You are the StreamVault AI Systems Architect & Network Optimizer.
Analyze the user's demanded media use case and recommend the optimal server connection.

Media Link: "${url || 'General Media Ingestion'}"
Demanded Use: "${demandType || 'High-Speed Ultra 4K Download and Mobile Streaming'}"
Current Server Connected: "${currentServer || 'StreamVault Main'}"

Available Servers:
1. "local-docker" (StreamVault Main Server): Best for heavy raw 4K downloads, direct gigabit line, unthrottled local disk storage, Intel QuickSync/NVENC hardware transcoding.
2. "tailscale-mesh" (Tailscale Encrypted Mesh): Best for remote streaming on mobile phones/outside home network, zero open router ports, peer-to-peer WireGuard encryption, bypasses CGNAT.
3. "cloudflare-edge" (Cloudflare Edge Tunnel): Best for quick web browser access on guest PCs without installing VPN clients, edge caching.

Respond in pure JSON matching this exact schema:
{
  "recommendedServerId": "local-docker" | "tailscale-mesh" | "cloudflare-edge",
  "recommendedServerName": "StreamVault Main" | "Tailscale Mesh" | "Cloudflare Tunnel",
  "confidenceScore": number (80 to 99),
  "optimalQuality": "4K Ultra" | "1080p Full HD" | "720p Fast" | "MP3 Audio",
  "reasoning": "1-2 concise sentences explaining why this server is best suited for the link and demanded use.",
  "transcodePreset": "h264_qsv" | "hevc_nvenc" | "direct_passthrough",
  "estimatedSpeed": "85-110 MB/s" | "45-70 MB/s" | "25-40 MB/s",
  "securityNote": "WireGuard P2P Encrypted" | "Direct Host Isolated" | "Cloudflare Edge Filtered"
}`;

    if (!process.env.GEMINI_API_KEY) {
      // Return smart fallback if key is not configured
      return res.json(getHeuristicRecommendation(url, demandType));
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.warn('AI Server recommendation fallback:', err?.message);
    const { url, demandType } = req.body;
    return res.json(getHeuristicRecommendation(url, demandType));
  }
});

function getHeuristicRecommendation(url: string = '', demandType: string = '') {
  const lowerUrl = url.toLowerCase();
  const lowerDemand = demandType.toLowerCase();

  if (lowerDemand.includes('mobile') || lowerDemand.includes('phone') || lowerDemand.includes('remote')) {
    return {
      recommendedServerId: 'tailscale-mesh',
      recommendedServerName: 'Tailscale Mesh',
      confidenceScore: 96,
      optimalQuality: '1080p Full HD',
      reasoning: 'Tailscale creates a zero-port-forwarding WireGuard tunnel optimized for cellular data and remote phone streaming without bandwidth caps.',
      transcodePreset: 'h264_qsv',
      estimatedSpeed: '65-80 MB/s',
      securityNote: 'WireGuard P2P Encrypted'
    };
  }

  if (lowerUrl.includes('youtube') || lowerUrl.includes('4k') || lowerDemand.includes('4k') || lowerDemand.includes('fast')) {
    return {
      recommendedServerId: 'local-docker',
      recommendedServerName: 'StreamVault Main',
      confidenceScore: 98,
      optimalQuality: '4K Ultra',
      reasoning: 'StreamVault Main connects directly to the host NVMe cache and GPU render node, delivering 100+ MB/s unthrottled multi-threaded downloads.',
      transcodePreset: 'hevc_nvenc',
      estimatedSpeed: '95-115 MB/s',
      securityNote: 'Direct Host Isolated'
    };
  }

  return {
    recommendedServerId: 'cloudflare-edge',
    recommendedServerName: 'Cloudflare Tunnel',
    confidenceScore: 91,
    optimalQuality: '1080p Full HD',
    reasoning: 'Cloudflare Tunnel routes through nearest edge POPs, providing smooth browser streaming with automated TLS termination.',
    transcodePreset: 'direct_passthrough',
    estimatedSpeed: '45-60 MB/s',
    securityNote: 'Cloudflare Edge Filtered'
  };
}

async function startServer() {
  // Mount Vite middleware in development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(port, '0.0.0.0', () => {
    console.log(`StreamVault Server running at http://localhost:${port}`);
  });
}

startServer();
