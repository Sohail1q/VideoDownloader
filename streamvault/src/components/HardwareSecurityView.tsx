import React, { useState } from 'react';
import { 
  ShieldCheck, Cpu, HardDrive, Lock, Wifi, Smartphone, 
  Tv, Monitor, CheckCircle, AlertTriangle, ArrowRight, Zap, Copy, Check 
} from 'lucide-react';

export const HardwareSecurityView: React.FC = () => {
  const [selectedGpu, setSelectedGpu] = useState<'qsv' | 'nvenc' | 'vaapi' | 'cpu'>('qsv');
  const [selectedResolution, setSelectedResolution] = useState<'1080p' | '720p' | '480p' | 'audio'>('1080p');
  const [copiedCmd, setCopiedCmd] = useState(false);

  // Compute FFmpeg snippet
  const getFfmpegSnippet = () => {
    switch (selectedGpu) {
      case 'qsv':
        return `ffmpeg -hwaccel qsv -qsv_device /dev/dri/renderD128 -i /vault/staging/input.mkv \\
  -vf 'vpp_qsv=w=1920:h=1080' -c:v h264_qsv -b:v 5500k -preset veryfast \\
  -c:a aac -b:a 192k -f hls -hls_time 4 -hls_playlist_type vod master.m3u8`;
      case 'nvenc':
        return `ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i /vault/staging/input.mkv \\
  -vf 'scale_cuda=1920:1080' -c:v h264_nvenc -preset p4 -b:v 5500k \\
  -c:a aac -b:a 192k -f hls -hls_time 4 -hls_playlist_type vod master.m3u8`;
      case 'vaapi':
        return `ffmpeg -vaapi_device /dev/dri/renderD128 -i /vault/staging/input.mkv \\
  -vf 'format=nv12,hwupload,scale_vaapi=w=1920:h=1080' -c:v h264_vaapi -b:v 5500k \\
  -c:a aac -b:a 192k -f hls -hls_time 4 -hls_playlist_type vod master.m3u8`;
      case 'cpu':
        return `ffmpeg -i /vault/staging/input.mkv \\
  -vf 'scale=1920:1080' -c:v libx264 -preset fast -crf 22 \\
  -c:a aac -b:a 192k -f hls -hls_time 4 -hls_playlist_type vod master.m3u8`;
    }
  };

  const currentCmd = getFfmpegSnippet();

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(currentCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border border-neutral-800 rounded-xl bg-neutral-900/60 p-5 backdrop-blur-sm">
        <div className="text-amber-400 font-mono text-xs uppercase tracking-wider mb-1">
          Hardware Acceleration & Security Architecture
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Transcoding Optimization & Zero-Trust Remote Access
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl leading-relaxed">
          How StreamVault achieves butter-smooth multi-device playback (from mobile phones to 4K Smart TVs) while keeping your server strictly private and completely inaccessible from the public internet.
        </p>
      </div>

      {/* Part 1: Secure Remote Access Architecture Matrix */}
      <div className="border border-neutral-800 rounded-xl bg-neutral-900/60 p-5 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Remote Access Strategy: Tailscale Mesh vs. Other Paradigms
            </h3>
            <p className="text-xs text-neutral-400">
              Why Tailscale Mesh VPN is the superior choice for self-hosted private media vaults.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Option 1: Tailscale Mesh (Recommended) */}
          <div className="border-2 border-amber-400/60 rounded-xl p-4 bg-neutral-950 flex flex-col justify-between space-y-3 relative">
            <div className="absolute -top-2.5 right-3 bg-amber-400 text-neutral-950 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase">
              Recommended Choice
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Tailscale Mesh VPN
              </div>
              <div className="text-neutral-400 mt-1 leading-relaxed">
                Creates a peer-to-peer encrypted WireGuard mesh between your server, phone, and laptop.
              </div>

              <div className="space-y-1.5 mt-3 pt-3 border-t border-neutral-800 font-mono text-[11px]">
                <div className="text-emerald-400">✓ 0 Open public router ports</div>
                <div className="text-emerald-400">✓ Works through CGNAT / Carrier 5G</div>
                <div className="text-emerald-400">✓ Direct P2P throughput (no proxy limits)</div>
                <div className="text-emerald-400">✓ Automated HTTPS cert via MagicDNS</div>
              </div>
            </div>

            <div className="p-2 rounded bg-neutral-900 text-neutral-300 text-[11px]">
              <strong className="text-white">Verdict:</strong> Maximum security. Zero attack surface for port scanners or botnets.
            </div>
          </div>

          {/* Option 2: Cloudflare Tunnels */}
          <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/60 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-sm text-white">Cloudflare Tunnels (Zero Trust)</div>
              <div className="text-neutral-400 mt-1 leading-relaxed">
                Connects server via outbound tunnel to Cloudflare edge edge network.
              </div>

              <div className="space-y-1.5 mt-3 pt-3 border-t border-neutral-800 font-mono text-[11px]">
                <div className="text-emerald-400">✓ 0 Open router ports</div>
                <div className="text-amber-400">⚠ Cloudflare inspects unencrypted traffic</div>
                <div className="text-rose-400 font-semibold">✗ Violates Cloudflare TOS Section 2.8!</div>
                <div className="text-neutral-400 text-[10px]">Cloudflare strictly prohibits high-bandwidth video streaming on free/pro plans. Accounts are frequently banned.</div>
              </div>
            </div>

            <div className="p-2 rounded bg-neutral-900 text-neutral-300 text-[11px]">
              <strong className="text-white">Verdict:</strong> Dangerous for media archives due to automated bandwidth bans.
            </div>
          </div>

          {/* Option 3: Reverse Proxy + Authelia/Authentik */}
          <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/60 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-sm text-white">Caddy + Authelia / Authentik SSO</div>
              <div className="text-neutral-400 mt-1 leading-relaxed">
                Direct public domain with strict forward-auth middleware and WebAuthn (YubiKey) 2FA.
              </div>

              <div className="space-y-1.5 mt-3 pt-3 border-t border-neutral-800 font-mono text-[11px]">
                <div className="text-emerald-400">✓ Works on any guest browser without VPN</div>
                <div className="text-emerald-400">✓ Hardware security key (FIDO2) support</div>
                <div className="text-amber-400">⚠ Requires Port 443 forwarded on router</div>
                <div className="text-amber-400">⚠ Requires public domain & static IP / DDNS</div>
              </div>
            </div>

            <div className="p-2 rounded bg-neutral-900 text-neutral-300 text-[11px]">
              <strong className="text-white">Verdict:</strong> Excellent secondary fallback if family members cannot install VPN software.
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Hardware Transcoding Engine Matrix */}
      <div className="border border-neutral-800 rounded-xl bg-neutral-900/60 p-5 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Hardware Transcoding Architecture (FFmpeg Acceleration)
            </h3>
            <p className="text-xs text-neutral-400">
              Hardware silicon offload allows small homelab mini-PCs (Intel N100 / Core i5) to transcode 4K 60fps streams concurrently at under 15W power draw.
            </p>
          </div>
        </div>

        {/* GPU Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setSelectedGpu('qsv')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedGpu === 'qsv'
                ? 'bg-amber-400/15 border-amber-400 text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-semibold text-xs text-amber-400">Intel QuickSync (QSV)</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">8th-14th Gen / N100</div>
          </button>

          <button
            onClick={() => setSelectedGpu('nvenc')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedGpu === 'nvenc'
                ? 'bg-amber-400/15 border-amber-400 text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-semibold text-xs text-emerald-400">Nvidia NVENC</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">GTX 1650 / RTX / T400</div>
          </button>

          <button
            onClick={() => setSelectedGpu('vaapi')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedGpu === 'vaapi'
                ? 'bg-amber-400/15 border-amber-400 text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-semibold text-xs text-sky-400">AMD VAAPI</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Radeon APU / RX 6000+</div>
          </button>

          <button
            onClick={() => setSelectedGpu('cpu')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedGpu === 'cpu'
                ? 'bg-amber-400/15 border-amber-400 text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-semibold text-xs text-neutral-300">Software CPU (x264)</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Universal CPU Fallback</div>
          </button>
        </div>

        {/* Command Generator Output */}
        <div className="border border-neutral-800 rounded-lg p-4 bg-neutral-950 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-neutral-400">
              Generated Worker Transcoding Command ({selectedGpu.toUpperCase()}):
            </span>
            <button
              onClick={handleCopyCmd}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors text-xs"
            >
              {copiedCmd ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Command</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 bg-neutral-900 border border-neutral-800 rounded text-xs font-mono text-amber-300 overflow-x-auto leading-relaxed">
            <code>{currentCmd}</code>
          </pre>
        </div>

        {/* Device Matrix Specs */}
        <div className="border border-neutral-800 rounded-lg overflow-hidden text-xs">
          <div className="grid grid-cols-12 bg-neutral-950 p-2.5 font-semibold text-neutral-400 border-b border-neutral-800">
            <span className="col-span-3">Target Client Device</span>
            <span className="col-span-3">Supported Container</span>
            <span className="col-span-3">Optimal Codec</span>
            <span className="col-span-3 text-right">Transcode Strategy</span>
          </div>

          <div className="divide-y divide-neutral-800/80 bg-neutral-900/40">
            <div className="grid grid-cols-12 p-2.5 items-center">
              <span className="col-span-3 font-semibold text-white flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" /> Apple iOS / iPadOS
              </span>
              <span className="col-span-3 font-mono text-neutral-300">HLS (.m3u8) / MP4</span>
              <span className="col-span-3 font-mono text-neutral-400">H.264 / HEVC / AV1 (A17+)</span>
              <span className="col-span-3 text-right text-emerald-400 font-mono">Hardware Remux / QSV</span>
            </div>

            <div className="grid grid-cols-12 p-2.5 items-center">
              <span className="col-span-3 font-semibold text-white flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Android / Pixel / Galaxy
              </span>
              <span className="col-span-3 font-mono text-neutral-300">HLS / WebM / MP4</span>
              <span className="col-span-3 font-mono text-neutral-400">AV1 / VP9 / H.264</span>
              <span className="col-span-3 text-right text-emerald-400 font-mono">Direct Stream</span>
            </div>

            <div className="grid grid-cols-12 p-2.5 items-center">
              <span className="col-span-3 font-semibold text-white flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-sky-400" /> Smart TVs & Apple TV 4K
              </span>
              <span className="col-span-3 font-mono text-neutral-300">HLS / Matroska (MKV)</span>
              <span className="col-span-3 font-mono text-neutral-400">4K HEVC HDR10 / Dolby Vision</span>
              <span className="col-span-3 text-right text-emerald-400 font-mono">Direct 4K Passthrough</span>
            </div>

            <div className="grid grid-cols-12 p-2.5 items-center">
              <span className="col-span-3 font-semibold text-white flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-purple-400" /> Desktop Browsers
              </span>
              <span className="col-span-3 font-mono text-neutral-300">HLS / WebM / MP4</span>
              <span className="col-span-3 font-mono text-neutral-400">AV1 / H.264 / AAC</span>
              <span className="col-span-3 text-right text-emerald-400 font-mono">Adaptive Bitrate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
