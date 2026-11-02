import * as THREE from 'three';
import { HERO_OBJECT } from './config.js';

// İsteğe bağlı 3B nesne kancası: public/models/hero.glb dosyası varsa sahneye eklenir.
// Dosya yoksa (404 ya da geliştirme sunucusunun HTML yedeği) sessizce hiçbir şey yapmaz.
export async function loadHeroObject(scene) {
  const url = `${import.meta.env.BASE_URL}${HERO_OBJECT.url}`;
  let res;
  try {
    res = await fetch(url, { method: 'HEAD' });
  } catch {
    return null;
  }
  const type = res.headers.get('content-type') || '';
  if (!res.ok || type.includes('text/html')) return null;

  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const gltf = await new GLTFLoader().loadAsync(url);
  const root = gltf.scene;
  root.position.set(...HERO_OBJECT.position);
  root.scale.setScalar(HERO_OBJECT.scale);

  // Sahnedeki gölgelendiriciler ışık kullanmaz; modelin standart malzemeleri için hafif ışık
  const group = new THREE.Group();
  group.add(root);
  group.add(new THREE.AmbientLight(0x442222, 1.4));
  const key = new THREE.PointLight(0xff3a28, 40, 40, 1.6);
  key.position.set(2, 2, 3);
  group.add(key);
  scene.add(group);
  return group;
}
