# Burak Tanrıverdi — portfolyo

Kişisel portfolyo sitem. Tek sayfa, tek tam ekran Three.js sahnesi; sayfayı kaydırdıkça kamera
karanlık bir uzayda kırmızı bir ışık çizgisini ("iplik") takip eder, iplik yeşile dönerken bölümler
sırayla açılır: giriş, hakkında, yol, işler, araçlar, iletişim.

**Canlı adres:** [buraktnrvrdi.github.io](https://buraktnrvrdi.github.io)

## Tasarım

- Sahne (`src/scene/`): kendi yazdığım GLSL ile köşeli kayalar, artı biçiminde ışık çizgisi, iplik
  (CatmullRom eğrisi), toz ve bokeh parçacıkları; bloom, kenar bulanıklığı, tane ve vinyet son geçişi.
- Kamera yolu `src/scene/config.js` içinde veri olarak tanımlı (anahtar kareler, bölüm aralıkları,
  renk geçişi). Kamera, sahne ve metin aynı normalize scroll ilerlemesinden sürülür.
- Arayüz neredeyse yok: sol üstte monogram, üstte sayaç, sağ üstte dikey bölüm listesi ve ilerleme
  işaretleri, sol altta sabit metin bloğu, sağ altta bağlantı düğmesi.
- Yazı tipi (yerel, OFL): Geist (değişken). Zemin siyah, metin sıcak beyaz.
- Tüm metinler `src/data.js` içinde; başlıkları oradan değiştirebilirsin.

## Erişilebilirlik ve yedekler

- `prefers-reduced-motion`: kamera yolculuğu yok; bölümler alt alta akar, sahne her bölüm için
  tek sabit kare olarak çizilir.
- WebGL yoksa ya da bağlam kaybolursa: CSS ile çizilmiş sabit bir poster ve alt alta tüm içerik.
- Mobilde (dikey kadraj) ayrı kamera anahtarları, daha az kaya, DPR ≤ 1.5 ve son geçişler kapalı.
- Klavye: bölüm listesi gerçek düğmelerdir; "Ana içeriğe geç" bağlantısı; Escape mobil menüyü kapatır.
- Sekme görünmezken çizim durur.

## İsteğe bağlı 3B nesne

`public/models/hero.glb` dosyası varsa `src/scene/HeroObject.js` onu sahneye ekler (konum ve ölçek
`config.js` içinde `HERO_OBJECT`). Dosya yoksa sahne onsuz tam çalışır.

## Hata ayıklama

`?p=0.35` parametresi scroll ilerlemesini doğrudan ayarlar (0 ile 1 arası); sabit kare almak için
kullanılır, üretimde zararsızdır.

## Teknolojiler

- [React](https://react.dev) + [Vite](https://vite.dev)
- [Three.js](https://threejs.org) (MIT)
- [@fontsource-variable/geist](https://fontsource.org/fonts/geist) (OFL-1.1)

## Geliştirme

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run lint
```

## Yayınlama

`main` dalına yapılan her push, GitHub Actions üzerinden otomatik olarak build alıp
GitHub Pages'e deploy eder (bkz. `.github/workflows/deploy.yml`).
