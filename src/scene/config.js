// Sahne ve kamera verisi. Kamera yolu, "iplik" eğrisi ve bölüm aralıkları burada.
// Tüm sahne ve arayüz aynı normalize scroll ilerlemesinden (0..1) sürülür.

import { WORK } from '../data.js';

// Bölümlerin başladığı ilerleme değerleri (hero, hakkında, yol, işler, araçlar, iletişim)
export const SECTION_STARTS = [0, 0.1, 0.27, 0.43, 0.8, 0.91];
export const PROJECT_RANGE = [0.43, 0.8];
// Proje sayısı veriden gelir; her proje için aşağıdaki kamera listelerinde bir satır olmalı.
export const PROJECT_COUNT = WORK.projects.length;

// Renk sıcaklığı geçişi: kırmızıdan yeşile
export const MIX_RANGE = [0.2, 0.3];

// İplik: önce kameranın önünde yanal dalga (z≈-6), sonra derinliğe uzanan eğri
export const THREAD_POINTS = [
  [-13, -2.0, -5.5],
  [-9.5, -3.2, -5.8],
  [-7.5, -1.6, -6.0],
  [-5.5, -2.0, -6.2],
  [-3.8, -4.6, -6.5],
  [-1.2, -1.8, -6.8],
  [1.5, -0.9, -7.2],
  [3.2, -2.4, -8.0],
  [5.0, -4.4, -9.5],
  [8.0, -3.0, -13],
  [9.0, 0.0, -22],
  [6.0, 2.8, -33],
  [1.0, 2.0, -45],
  [-3.0, -0.4, -58],
  [-4.0, -3.0, -72],
  [0.0, -4.5, -86],
  [5.0, -3.0, -100],
  [7.0, 0.5, -114],
  [4.0, 3.0, -128],
  [-1.0, 3.0, -142],
  [-5.0, 1.0, -156],
  [-5.0, -2.0, -170],
  [-2.0, -3.5, -184],
  [2.0, -2.0, -198],
  [3.0, 0.0, -214],
];

// Kamera anahtar kareleri. `abs`: mutlak konum/hedef. `rel`: iplik üzerindeki u konumuna göre
// (right, up, back) ofseti ve ileri bakış mesafesi (ahead, iplik uzunluğunun oranı).
// p: scroll ilerlemesi, fov: dikey görüş açısı, mix: 0 kırmızı, 1 yeşil (sahne ışığı).
const projectKeys = (list) =>
  list.map(([i, u, right, up, back, ahead]) => ({
    p: PROJECT_RANGE[0] + ((PROJECT_RANGE[1] - PROJECT_RANGE[0]) / PROJECT_COUNT) * (i + 0.5),
    rel: { u, right, up, back, ahead },
    fov: 44,
    pane: true,
  }));

export const KEYS_DESKTOP = [
  { p: 0, abs: { pos: [0, 0.3, 13.5], look: [0, 0, 0] }, fov: 40 },
  { p: 0.05, abs: { pos: [0.4, 0.2, 10.3], look: [0, 0, -1] }, fov: 40 },
  { p: 0.1, abs: { pos: [0, 0, 5.4], look: [0, -1.3, -8] }, fov: 42 },
  { p: 0.17, abs: { pos: [1.2, -0.6, -1.4], look: [2, -2.4, -10] }, fov: 44 },
  { p: 0.23, rel: { u: 0.11, right: 0.6, up: 1.1, back: 7, ahead: 0.05 }, fov: 46 },
  { p: 0.3, rel: { u: 0.19, right: -0.9, up: 1.2, back: 8, ahead: 0.05 }, fov: 46 },
  { p: 0.37, rel: { u: 0.25, right: 1.2, up: 0.8, back: 8, ahead: 0.05 }, fov: 44 },
  ...projectKeys([
    [0, 0.31, -1.2, 0.6, 9, 0.04],
    [1, 0.376, 1.4, 0.4, 9, 0.04],
    [2, 0.442, -1.4, 0.9, 9, 0.04],
    [3, 0.508, 1.2, 0.2, 9, 0.04],
    [4, 0.574, -1.0, 0.8, 9, 0.04],
    [5, 0.64, 1.3, 0.5, 9, 0.04],
  ]),
  { p: 0.86, rel: { u: 0.72, right: 0.6, up: 0.6, back: 10, ahead: 0.05 }, fov: 44 },
  { p: 0.95, rel: { u: 0.82, right: -0.8, up: 0.4, back: 11, ahead: 0.06 }, fov: 42 },
  { p: 1, rel: { u: 0.9, right: 0.4, up: 0.2, back: 12, ahead: 0.07 }, fov: 40 },
];

// Dikey kadraj için ayrı anahtarlar (kamera daha geride, geniş açı)
export const KEYS_MOBILE = [
  { p: 0, abs: { pos: [0, 0.2, 17], look: [0, 0.6, 0] }, fov: 52 },
  { p: 0.05, abs: { pos: [0.3, 0.2, 13], look: [0, 0.6, -1] }, fov: 52 },
  { p: 0.1, abs: { pos: [0, 0.4, 7.5], look: [0, -0.4, -8] }, fov: 54 },
  { p: 0.17, abs: { pos: [0.8, -0.2, -0.8], look: [1.4, -1.6, -10] }, fov: 56 },
  { p: 0.23, rel: { u: 0.11, right: 0.4, up: 0.9, back: 8, ahead: 0.05 }, fov: 56 },
  { p: 0.3, rel: { u: 0.19, right: -0.6, up: 1.1, back: 9, ahead: 0.05 }, fov: 56 },
  { p: 0.37, rel: { u: 0.25, right: 0.8, up: 0.8, back: 9, ahead: 0.05 }, fov: 54 },
  ...projectKeys([
    [0, 0.31, -0.6, -0.9, 10, 0.04],
    [1, 0.376, 0.8, -1.0, 10, 0.04],
    [2, 0.442, -0.8, -0.8, 10, 0.04],
    [3, 0.508, 0.7, -1.0, 10, 0.04],
    [4, 0.574, -0.6, -0.9, 10, 0.04],
    [5, 0.64, 0.7, -1.0, 10, 0.04],
  ]).map((k) => ({ ...k, fov: 54 })),
  { p: 0.86, rel: { u: 0.72, right: 0.4, up: 0.5, back: 12, ahead: 0.05 }, fov: 54 },
  { p: 0.95, rel: { u: 0.82, right: -0.5, up: 0.4, back: 12, ahead: 0.06 }, fov: 52 },
  { p: 1, rel: { u: 0.9, right: 0.3, up: 0.2, back: 13, ahead: 0.07 }, fov: 50 },
];

// Proje pencerelerinin ekrandaki konumu (kamera uzayında, NDC ve mesafe)
export const PANE = {
  desktop: { ndc: [0.36, 0.1], dist: 9.5, width: 6.2, height: 4.2 },
  mobile: { ndc: [0, 0.3], dist: 9.5, width: 4.8, height: 3.6 },
};

// Sahne renkleri (doğrusal olmayan, sRGB 0..1)
export const COLORS = {
  red: [0.93, 0.07, 0.04],
  green: [0.05, 0.78, 0.2],
  thread: [1.0, 0.22, 0.1],
  hot: [1.0, 0.72, 0.62],
};

// İsteğe bağlı 3B nesne: public/models/hero.glb varsa yüklenir (HeroObject).
export const HERO_OBJECT = {
  url: 'models/hero.glb',
  position: [0, -0.4, -3],
  scale: 1.6,
  // iplik üzerinde konum (0..1) yerine sabit dünya konumu kullanılır
};
