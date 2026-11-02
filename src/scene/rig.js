import * as THREE from 'three';

// Düzensiz aralıklı Catmull-Rom (Barry-Goldman): anahtarlar arasında hız sürekli kalır.
function sample(points, ts, t, out) {
  const n = ts.length;
  let i = 0;
  while (i < n - 2 && t >= ts[i + 1]) i++;
  const p1 = points[i];
  const p2 = points[i + 1];
  const t1 = ts[i];
  const t2 = ts[i + 1];
  const p0 = i > 0 ? points[i - 1] : p1.clone().multiplyScalar(2).sub(p2);
  const p3 = i < n - 2 ? points[i + 2] : p2.clone().multiplyScalar(2).sub(p1);
  const t0 = i > 0 ? ts[i - 1] : t1 - (t2 - t1);
  const t3 = i < n - 2 ? ts[i + 2] : t2 + (t2 - t1);
  const l = (a, b, ta, tb) => a.clone().multiplyScalar((tb - t) / (tb - ta)).addScaledVector(b, (t - ta) / (tb - ta));
  const a1 = l(p0, p1, t0, t1);
  const a2 = l(p1, p2, t1, t2);
  const a3 = l(p2, p3, t2, t3);
  const b1 = l(a1, a2, t0, t2);
  const b2 = l(a2, a3, t1, t3);
  return out.copy(l(b1, b2, t1, t2));
}

export class CameraRig {
  constructor(keys, thread) {
    const up = new THREE.Vector3(0, 1, 0);
    this.ps = keys.map((k) => k.p);
    this.fovs = keys.map((k) => k.fov);
    this.pos = [];
    this.look = [];
    this.keys = keys;
    for (const k of keys) {
      if (k.abs) {
        this.pos.push(new THREE.Vector3(...k.abs.pos));
        this.look.push(new THREE.Vector3(...k.abs.look));
      } else {
        const { u, right, up: upOff, back, ahead } = k.rel;
        const P = thread.getPointAt(u);
        const T = thread.getTangentAt(u);
        const R = new THREE.Vector3().crossVectors(T, up).normalize();
        const U = new THREE.Vector3().crossVectors(R, T).normalize();
        const pos = P.clone().addScaledVector(R, right).addScaledVector(U, upOff).addScaledVector(T, -back);
        const look = thread.getPointAt(Math.min(1, u + ahead)).clone().addScaledVector(R, right * 0.4);
        this.pos.push(pos);
        this.look.push(look);
        k.paneOrigin = { pos: pos.clone(), look: look.clone() };
      }
      if (k.abs && k.pane) k.paneOrigin = { pos: this.pos[this.pos.length - 1].clone(), look: this.look[this.look.length - 1].clone() };
    }
    this._a = new THREE.Vector3();
    this._b = new THREE.Vector3();
  }

  at(p, camera) {
    const q = Math.min(Math.max(p, this.ps[0]), this.ps[this.ps.length - 1]);
    sample(this.pos, this.ps, q, this._a);
    sample(this.look, this.ps, q, this._b);
    // fov: doğrusal aralık
    let i = 0;
    while (i < this.ps.length - 2 && q >= this.ps[i + 1]) i++;
    const f = (q - this.ps[i]) / (this.ps[i + 1] - this.ps[i]);
    const fov = this.fovs[i] + (this.fovs[i + 1] - this.fovs[i]) * f;
    camera.position.copy(this._a);
    camera.lookAt(this._b);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}
