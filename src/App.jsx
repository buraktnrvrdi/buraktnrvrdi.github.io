import { useCallback, useEffect, useRef } from 'react';
import { NAME, UI } from './data.js';
import { PROJECT_COUNT, SECTION_STARTS } from './scene/config.js';
import { Counter, CornerLink, MobileMenu, Monogram, Reticle, SectionList, Strip } from './ui/Chrome.jsx';
import { About, Contact, Experience, Hero, Skills, Work } from './ui/Sections.jsx';
import { maxScrollY, useScene } from './ui/useScene.js';

export default function App() {
  const canvasRef = useRef(null);
  const { mode, mobile, sec, proj } = useScene(canvasRef, true);
  const flow = mode !== 'scroll';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('flow', flow);
    root.classList.toggle('nogl', mode === 'flow-nogl');
    root.classList.toggle('mobile', mobile);
    root.classList.add('js');
  }, [flow, mode, mobile]);

  const goTo = useCallback(
    (i) => {
      if (flow) {
        document.getElementById(['top', 'about', 'experience', 'work', 'stack', 'contact'][i])?.scrollIntoView();
        return;
      }
      const p = i === 0 ? 0 : SECTION_STARTS[i] + 0.004;
      window.scrollTo({ top: p * maxScrollY(), behavior: 'auto' });
    },
    [flow],
  );

  const goProject = useCallback(
    (k) => {
      if (flow) return;
      const a = SECTION_STARTS[3];
      const b = SECTION_STARTS[4];
      const p = a + ((b - a) / PROJECT_COUNT) * (k + 0.5);
      window.scrollTo({ top: p * maxScrollY(), behavior: 'auto' });
    },
    [flow],
  );

  const skip = (e) => {
    e.preventDefault();
    document.getElementById('narrative')?.focus({ preventScroll: true });
  };

  const act = (i) => flow || i === sec;

  return (
    <>
      <a className="skip" href="#narrative" onClick={skip}>
        {UI.skip}
      </a>
      <canvas ref={canvasRef} className="stage" aria-hidden="true" />
      <div className="poster" aria-hidden="true" />
      <div className="grade" aria-hidden="true" />

      <header className="top">
        <Monogram />
        {!flow && <Counter sec={sec} />}
        {flow ? (
          <nav className="flownav" aria-label={UI.menu}>
            {['top', 'about', 'experience', 'work', 'stack', 'contact'].map((id, i) => (
              <a key={id} href={`#${id}`}>
                {['Giriş', 'Hakkında', 'Yol', 'İşler', 'Araçlar', 'İletişim'][i]}
              </a>
            ))}
          </nav>
        ) : mobile ? (
          <MobileMenu sec={sec} onGo={goTo} />
        ) : (
          <SectionList sec={sec} onGo={goTo} />
        )}
      </header>

      {!flow && !mobile && <Strip sec={sec} />}
      {!flow && !mobile && <Reticle />}

      <main id="narrative" tabIndex={-1} aria-label={NAME}>
        <Hero active={act(0)} />
        <About active={act(1)} />
        <Experience active={act(2)} />
        <Work active={act(3)} proj={proj} flow={flow} onProject={goProject} />
        <Skills active={act(4)} />
        <Contact active={act(5)} />
      </main>

      {!flow && (
        <div className="corner-wrap">
          <CornerLink sec={sec} onTop={() => goTo(0)} />
        </div>
      )}
      {!flow && sec === 0 && (
        <p className="scrollhint" aria-hidden="true">
          {UI.scroll}
          <span />
        </p>
      )}
      {flow && mode === 'flow-nogl' && <p className="nogl-note">{UI.noWebgl}</p>}
      {!flow && <div className="track" aria-hidden="true" />}
    </>
  );
}
