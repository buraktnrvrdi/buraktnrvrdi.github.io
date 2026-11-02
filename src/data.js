// Mevcut sitedeki gerçek içerik. Metinler değiştirilmedi.
export const EMAIL = 'buraktanriverdicontact@gmail.com';
export const GITHUB = 'https://github.com/buraktnrvrdi';
export const LINKEDIN = 'https://www.linkedin.com/in/burak-tanriverdi-11b6a5377/';

export const NAME = 'Burak Tanrıverdi';

export const HERO = {
  role: ['full-stack geliştirici.'],
  meta: ['Tekirdağ, TR · UTC+3', 'Trakya Üniversitesi, 2026', 'Available for work'],
};

export const INTRO = {
  lead: ['Yeni ', 'mezun', ' bir yazılım geliştiricisiyim.'],
  rest:
    'Şu an <strong>Çetin Group</strong> IT departmanında stajyer olarak çalışıyorum, boş vakitlerimde masaüstü, mobil ve web tarafında uçtan uca projeler geliştirip <strong>GitHub</strong>\'da paylaşıyorum.',
};

export const IDENTITY = [
  { key: 'OS', value: 'Human v1.0 (developer build)' },
  { key: 'Host', value: 'Tekirdağ, TR' },
  { key: 'Role', value: 'Full-stack + Mobile Developer' },
  { key: 'Uptime', value: 'Yeni mezun · 2026' },
  { key: 'Shell', value: 'bash, git, npm' },
  { key: 'Stack', value: 'Python, JS/TS, Kotlin, Flutter' },
  { key: 'Focus', value: 'Mobile & masaüstü uygulamalar' },
  { key: 'Status', value: 'available for select work' },
];

export const EXPERIENCE = {
  heading: ['Bugüne kadarki ', 'yol'],
  rows: [
    {
      time: '2025.06 - 2025.09',
      org: 'Zinca Metal',
      desc: 'Bilgi İşlem Sorumlusu — fabrika ortamında IT süreçlerinden sorumlu oldum.',
    },
    {
      time: '2025 - 2026',
      org: 'Çetin Group',
      desc: 'IT Departmanı, Stajyer — envanter, destek ve iç araçlar üzerine çalışıyorum.',
    },
    { time: '2026', org: 'Trakya Üniversitesi', desc: 'Mobil Teknolojileri — mezuniyet.' },
  ],
};

export const WORK = {
  heading: ['Things I built and ', 'shipped'],
  projects: [
    {
      name: 'klipster',
      stars: 'live',
      desc: '<strong>AI destekli</strong> video klipleme SaaS’ı — uzun videoları altyazılı dikey kliplere çevirir. klipster.com.tr’de canlı yayında.',
      tags: ['Next.js', 'FastAPI', 'Whisper', { label: 'live', hot: true }],
      source: null,
      demo: 'https://klipster.com.tr',
    },
    {
      name: 'bilgi-islem-app',
      stars: '1',
      desc: 'IT departmanları için <strong>masaüstü</strong> envanter yönetimi, QR kod ile takip.',
      tags: ['Electron', 'SQLite', { label: 'open source', hot: true }],
      source: 'https://github.com/buraktnrvrdi/bilgi-islem-app',
      demo: null,
    },
    {
      name: 'btsoftdepo',
      stars: '1',
      desc: 'Fabrikalar için depo yönetimi, barkod desteği ve <strong>AI stok tahmini</strong>.',
      tags: ['Electron', 'AI', 'Excel', { label: 'open source', hot: true }],
      source: 'https://github.com/buraktnrvrdi/btsoftdepo',
      demo: null,
    },
    {
      name: 'alsancak-yedek-parca',
      stars: 'live',
      desc: 'Marka/model/yıl bazlı <strong>araç bulma filtresi</strong> eklediğim oto yedek parça e-ticareti.',
      tags: ['Shopify', 'Liquid', 'JavaScript', { label: 'live', hot: true }],
      source: null,
      demo: 'https://www.xn--alsancakyedekpara-psb.com.tr/',
    },
    {
      name: 'pektas-yapi',
      stars: 'live',
      desc: 'Yapı malzemeleri e-ticareti, ürüne göre <strong>anlık maliyet hesaplama</strong> aracı.',
      tags: ['Shopify', 'JavaScript', { label: 'live', hot: true }],
      source: null,
      demo: 'https://pektasyapi.com/',
    },
    {
      name: 'lojistik-demo',
      stars: 'live',
      desc: 'Lojistik firmaları için <strong>demo web sitesi</strong> — dünya küresi üzerinde taşıma rotaları, hava, deniz ve kara yolu hizmetleri.',
      tags: ['Lojistik', { label: 'demo', hot: true }],
      source: null,
      demo: 'https://buraklojistiksite.netlify.app/',
    },
  ],
};

export const SKILLS = {
  heading: ['The ', 'tools', ' I reach for'],
  note: 'self-assessed, honest',
  rows: [
    { label: 'JavaScript', pct: 92 },
    { label: 'Python', pct: 85 },
    { label: 'Node.js', pct: 82 },
    { label: 'Electron', pct: 80 },
    { label: 'Flutter', pct: 78 },
    { label: 'Kotlin', pct: 75 },
    { label: 'SQL', pct: 80 },
    { label: 'Firebase', pct: 74 },
  ],
};

export const CONTACT = {
  heading: ["Let's build ", 'something', ' together.'],
  sub: 'Yeni fırsatlara açığım — staj sonrası tam zamanlı roller ya da freelance projeler için ulaşabilirsin.',
};

export const FOOTER = ['(c) 2026 Burak Tanrıverdi, built in the terminal, shipped fast', 'last commit: az önce, main branch'];

// Bölüm listesi (arayüz etiketleri, kısa ve tarafsız)
export const SECTIONS = [
  { id: 'top', label: 'Giriş' },
  { id: 'about', label: 'Hakkında' },
  { id: 'experience', label: 'Yol' },
  { id: 'work', label: 'İşler' },
  { id: 'stack', label: 'Araçlar' },
  { id: 'contact', label: 'İletişim' },
];

// Diğer arayüz metinleri
export const UI = {
  skip: 'Ana içeriğe geç',
  scroll: 'Kaydır',
  chapter: 'Bölüm',
  github: 'GitHub',
  toTop: 'Başa dön',
  email: 'E-posta',
  linkedin: 'LinkedIn',
  live: 'Canlı site',
  source: 'Kaynak',
  project: 'Proje',
  menu: 'Bölümler',
  close: 'Kapat',
  noWebgl: '3B sahne bu cihazda çalışmıyor; içerik aşağıda.',
};
