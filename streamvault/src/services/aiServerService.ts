export interface ServerRecommendation {
  recommendedServerId: 'local-docker' | 'tailscale-mesh' | 'cloudflare-edge';
  recommendedServerName: string;
  confidenceScore: number;
  optimalQuality: '4K Ultra' | '1080p Full HD' | '720p Fast' | 'MP3 Audio';
  reasoning: string;
  transcodePreset: string;
  estimatedSpeed: string;
  securityNote: string;
}

export async function getAIServerRecommendation(
  url: string,
  demandType: string,
  currentServer: string
): Promise<ServerRecommendation> {
  try {
    const response = await fetch('/api/ai/analyze-server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, demandType, currentServer }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.warn('AI Server API fetch error, using client fallback:', err);
  }

  // Client-side heuristic fallback
  const lowerUrl = url.toLowerCase();
  const lowerDemand = demandType.toLowerCase();

  if (lowerDemand.includes('mobile') || lowerDemand.includes('phone') || lowerDemand.includes('remote') || lowerDemand.includes('outside')) {
    return {
      recommendedServerId: 'tailscale-mesh',
      recommendedServerName: 'Tailscale Mesh',
      confidenceScore: 97,
      optimalQuality: '1080p Full HD',
      reasoning: 'Tailscale mesh automatically creates an encrypted peer-to-peer WireGuard tunnel with zero open router ports, optimized for cellular and mobile streaming.',
      transcodePreset: 'h264_qsv',
      estimatedSpeed: '70-85 MB/s',
      securityNote: 'WireGuard P2P Encrypted'
    };
  }

  if (lowerUrl.includes('youtube') || lowerUrl.includes('4k') || lowerDemand.includes('4k') || lowerDemand.includes('fast')) {
    return {
      recommendedServerId: 'local-docker',
      recommendedServerName: 'StreamVault Main',
      confidenceScore: 98,
      optimalQuality: '4K Ultra',
      reasoning: 'StreamVault Main container utilizes host NVMe storage and Intel QuickSync / NVENC GPU silicon, delivering max unthrottled multi-threaded speeds.',
      transcodePreset: 'hevc_nvenc',
      estimatedSpeed: '95-115 MB/s',
      securityNote: 'Direct Host Isolated'
    };
  }

  return {
    recommendedServerId: 'cloudflare-edge',
    recommendedServerName: 'Cloudflare Tunnel',
    confidenceScore: 92,
    optimalQuality: '1080p Full HD',
    reasoning: 'Cloudflare Tunnel routes through nearby edge nodes, providing quick universal web browser playback without installing VPN certificates.',
    transcodePreset: 'direct_passthrough',
    estimatedSpeed: '45-60 MB/s',
    securityNote: 'Cloudflare Edge Filtered'
  };
}
