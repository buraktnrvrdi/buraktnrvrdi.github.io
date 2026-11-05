// Set this to the owner's public Spotify playlist URL.
export const PLAYLIST_URL = 'https://open.spotify.com/intl-tr/album/2Mr7kct2eAZqs01YckFXTi';

export function playlistEmbedUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Geçerli bir Spotify çalma listesi bağlantısı gerekli.'); }
  const match = url.pathname.match(/^\/(?:intl-[a-z]+\/)?(?:embed\/)?(playlist|album)\/([A-Za-z0-9]{22})\/?$/);
  if (url.protocol !== 'https:' || url.hostname !== 'open.spotify.com' || !match) {
    throw new Error('Spotify albüm veya çalma listesi bağlantısı kullanmalısın.');
  }
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
}

export function mountPlaylist(playlistUrl = PLAYLIST_URL) {
  if (!playlistUrl) return;
  const surface = document.getElementById('music');
  if (!surface || surface.querySelector('.playlist-player')) return;
  const src = playlistEmbedUrl(playlistUrl);
  const wrapper = document.createElement('div');
  wrapper.className = 'playlist-player';
  const frame = document.createElement('iframe');
  frame.title = 'Burak’ın Spotify albümü';
  frame.src = src;
  frame.width = '100%';
  frame.height = '352';
  frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  frame.allowFullscreen = true;
  frame.loading = 'lazy';
  wrapper.append(frame);
  surface.append(wrapper);
  surface.classList.add('has-playlist');
  surface.setAttribute('aria-label', 'Spotify albümü');
}
