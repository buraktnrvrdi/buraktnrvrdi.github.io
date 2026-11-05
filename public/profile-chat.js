// A local profile guide: answers only from the portfolio's known facts.
const normalize = value => String(value ?? '').toLocaleLowerCase('tr-TR')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i')
  .replace(/[^a-z0-9@.\s-]/g, ' ').replace(/\s+/g, ' ').trim();
const has = (text, pattern) => pattern.test(text);
const projects = [
  { keys: /\bklipster\b|video|kliple/, name: 'Klipster', description: 'Uzun videoları altyazılı dikey kliplere dönüştüren AI destekli bir SaaS.', stack: 'Next.js, FastAPI ve Whisper', link: 'https://klipster.com.tr' },
  { keys: /bilgi[ -]?islem|envanter|\bqr\b/, name: 'bilgi-islem-app', description: 'IT departmanları için QR kodla takip sunan masaüstü envanter yönetimi uygulaması.', stack: 'Electron ve SQLite', link: 'https://github.com/buraktnrvrdi/bilgi-islem-app' },
  { keys: /btsoft|depo|stok|barkod/, name: 'btsoftdepo', description: 'Fabrikalar için barkod desteği ve AI stok tahmini içeren depo yönetimi uygulaması.', stack: 'Electron, AI ve Excel', link: 'https://github.com/buraktnrvrdi/btsoftdepo' },
  { keys: /alsancak|yedek|\bparca\b|arac|otomobil/, name: 'Alsancak Yedek Parça', description: 'Marka, model ve yıl bazlı araç bulma filtresi içeren oto yedek parça e-ticaret sitesi.', stack: 'Shopify, Liquid ve JavaScript', link: 'https://www.xn--alsancakyedekpara-psb.com.tr/' },
  { keys: /pektas|\byapi\b|maliyet/, name: 'Pektaş Yapı', description: 'Ürüne göre anlık maliyet hesaplama aracı içeren yapı malzemeleri e-ticaret sitesi.', stack: 'Shopify ve JavaScript', link: 'https://pektasyapi.com/' },
  { keys: /lojistik|tasima|nakliye/, name: 'Lojistik demo', description: 'Dünya küresi üzerinde taşıma rotalarını ve hava, deniz, kara yolu hizmetlerini gösteren demo web sitesi.', stack: null, link: 'https://buraklojistiksite.netlify.app/' },
];
const isTech = q => has(q, /teknoloji|\bdil|stack|python|javascript|kotlin|flutter|beceri|yetkinlik|hangi arac|ne kullani|neyle|nasil yap/);
function projectAnswer(project, q) {
  if (has(q, /link|adres|github|kaynak|nereden|incele|ziyaret|canli/)) return `${project.name} bağlantısı: ${project.link}`;
  if (isTech(q)) return project.stack ? `${project.name}, ${project.stack} kullanılarak geliştirildi.` : `${project.name} için kullanılan teknolojilerin ayrıntısı profil bilgilerinde yer almıyor. Projeyi inceleyebilirsin: ${project.link}`;
  return `${project.name}: ${project.description}${project.stack ? ` Kullanılan teknolojiler: ${project.stack}.` : ''} İncelemek için: ${project.link}`;
}
export function answerProfileQuestion(question, history = []) {
  const q = normalize(question);
  if (!q || q.length < 2 || !/[aeiou]/.test(q)) return 'Mesajını tam anlayamadım. Burak hakkında ne öğrenmek istersin? Örneğin “Klipster ne yapıyor?” diye sorabilirsin.';
  if (has(q, /^(merhaba|selam|selamlar|hello|hi|hey|gunaydin|iyi aksamlar)[.!\s]*$/)) return 'Merhaba! Burak’ın projeleri, deneyimi, eğitimi ve kullandığı teknolojiler hakkında yardımcı olabilirim. Neyi merak ediyorsun?';
  if (has(q, /tesekkur|sag ol|sagol|thanks/)) return 'Rica ederim! Merak ettiğin başka bir proje veya deneyim var mı?';
  if (has(q, /nasilsin|naber|ne haber/)) return 'Buradayım, yardımcı olmaya hazırım. Burak’ın çalışmalarından hangisini keşfetmek istersin?';
  const explicitProject = projects.find(p => p.keys.test(q));
  if (explicitProject) return projectAnswer(explicitProject, q);
  // Resolve short follow-up questions against the last user-mentioned project.
  const previous = [...history].reverse().find(m => m.role === 'user');
  const contextProject = previous && projects.find(p => p.keys.test(normalize(previous.content)));
  if (contextProject && has(q, /\bbunu|\bbunda|\bonu|\bonun|\bpeki|hangi teknoloji|neyle|nasil yap|linki|kaynak kod/)) return projectAnswer(contextProject, q);
  if (has(q, /linkedin/)) return 'Burak’ın LinkedIn profili: https://www.linkedin.com/in/burak-tanriverdi-11b6a5377/';
  if (has(q, /github/)) return 'Burak, açık kaynak projelerini GitHub’da paylaşıyor: https://github.com/buraktnrvrdi';
  if (has(q, /iletisim|\bmail|eposta|e-posta|posta|ulas|contact/)) return 'Burak’a buraktanriverdicontact@gmail.com adresinden ulaşabilirsin. Diğer bağlantıları masadaki İletişim telefonunda yer alıyor.';
  if (has(q, /telefon|\bnumara|\byasi?\b|kac yas|dogum|maas|ucret|fiyat|ev adres/)) return 'Bu bilgi Burak’ın profilinde paylaşılmıyor. Kendisine buraktanriverdicontact@gmail.com adresinden sorabilirsin.';
  if (has(q, /cetin/)) return 'Burak, 2025–2026 döneminde Çetin Group IT departmanında staj yapıyor; envanter, destek ve iç araçlar üzerine çalışıyor.';
  if (has(q, /zinca/)) return 'Burak, Haziran–Eylül 2025 döneminde Zinca Metal’de Bilgi İşlem Sorumlusu olarak çalıştı ve fabrika ortamındaki IT süreçlerinden sorumlu oldu.';
  if (has(q, /is ariyor|ise alim|musait|freelance|serbest|firsat|tam zamanli|birlikte calis|teklif/)) return 'Burak, tam zamanlı roller ve freelance projeler için yeni fırsatlara açık. Projeni veya iş teklifini buraktanriverdicontact@gmail.com adresine gönderebilirsin.';
  if (has(q, /deneyim|tecrube|staj|kariyer|nerede calis|calisti|experience/)) return 'Zinca Metal’de Haziran–Eylül 2025 arasında Bilgi İşlem Sorumlusu olarak çalıştı. 2025–2026 döneminde Çetin Group IT departmanında staj yapıyor. Deneyim panosundan ayrıntıları inceleyebilirsin.';
  if (has(q, /okul|egitim|universite|mezun|education|ne okudu|hangi bolum/)) return 'Burak, Trakya Üniversitesi Mobil Teknolojileri bölümünden 2026 yılında mezun oldu.';
  if (isTech(q)) return 'Burak’ın araç kutusunda JavaScript, Python, Node.js, Electron, Flutter, Kotlin, SQL ve Firebase var. Web, masaüstü ve mobil uygulamalar geliştiriyor. Belirli bir projenin teknolojilerini de sorabilirsin.';
  if (has(q, /nerede|sehir|konum|nereli|yasiyor|where/)) return 'Burak’ın profilindeki konum Tekirdağ, Türkiye. Saat dilimi UTC+3.';
  if (has(q, /\bproje|project|portfolyo|neler yap|ne yapti|calismalari/)) return 'Altı proje mevcut: Klipster, bilgi-islem-app, btsoftdepo, Alsancak Yedek Parça, Pektaş Yapı ve lojistik demo. Hangisini anlatmamı istersin?';
  if (has(q, /\bkimsin|\bbot\b|yapay zeka|\bai\b|nasil calisiyorsun/)) return 'Ben Burak’ın portfolyosundaki yerel profil rehberiyim. Kayıtlı CV ve proje bilgileriyle yanıt veriyorum; genel amaçlı bir yapay zekâ servisine bağlı değilim.';
  if (has(q, /burak kim|kendini tanit|hakkinda|kimdir|tanit|ozgecmis|\bcv\b/)) return 'Burak Tanrıverdi, Trakya Üniversitesi Mobil Teknolojileri mezunu bir full-stack ve mobil geliştirici. Web, masaüstü ve mobil projeler üretiyor; Çetin Group IT departmanında staj yapıyor.';
  return 'Bu soruya profil bilgilerinden güvenilir bir yanıt çıkaramadım. Sorunu Burak’ın bir projesi, eğitimi, deneyimi veya iletişim bilgileri hakkında biraz daha açık yazabilir misin?';
}
