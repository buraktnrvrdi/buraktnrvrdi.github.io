import { Fragment } from 'react';
import PixelAvatar from './PixelAvatar.jsx';

const IDENTITY = [
  { key: 'OS', value: 'Human v1.0 (developer build)' },
  { key: 'Host', value: 'Tekirdağ, TR' },
  { key: 'Role', value: 'Full-stack + Mobile Developer' },
  { key: 'Uptime', value: 'Yeni mezun · 2026' },
  { key: 'Shell', value: 'bash, git, npm' },
  { key: 'Stack', value: 'Python, JS/TS, Kotlin, Flutter' },
  { key: 'Focus', value: 'Mobile & masaüstü uygulamalar' },
];

const SWATCHES = [
  'var(--green)',
  'var(--green-dim)',
  'var(--green-faint)',
  'var(--amber)',
  'var(--cyan)',
  'var(--sage)',
  'var(--ink)',
  'var(--panel-2)',
];

export default function IdentityCard() {
  return (
    <section className="shell-section" id="about">
      <div className="prompt-line">
        <span className="prompt-user">burak</span>
        <span className="prompt-path">~/dev $ </span>
        <span className="prompt-cmd">neofetch</span>
      </div>

      <div className="identity-panel">
        <div className="identity-avatar-col">
          <PixelAvatar />
          <div className="avatar-label">burak@dev</div>
        </div>

        <div className="identity-main">
          <div className="identity-title glow-soft">burak@portfolio ----------</div>
          <div className="identity-list">
            {IDENTITY.map((row) => (
              <Fragment key={row.key}>
                <div className="identity-key">{row.key}:</div>
                <div className="identity-value">{row.value}</div>
              </Fragment>
            ))}
            <div className="identity-key">Status:</div>
            <div className="identity-value status-available">available for select work</div>
          </div>

          <div className="swatch-strip">
            {SWATCHES.map((color, i) => (
              <span className="swatch" key={i} style={{ background: color }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
