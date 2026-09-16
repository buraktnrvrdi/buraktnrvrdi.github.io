const NAV_LINKS = [
  { href: '#work', label: '~/work' },
  { href: '#stack', label: '~/stack' },
  { href: '#contact', label: '~/contact' },
];

export default function TerminalWindow({ children }) {
  return (
    <div className="terminal-window">
      <div className="title-bar">
        <div className="title-bar-left">
          <div className="traffic-lights">
            <span className="traffic-dot red" />
            <span className="traffic-dot amber" />
            <span className="traffic-dot green" />
          </div>
          <div className="path-label">
            <span className="user">burak</span>@portfolio: ~/dev
          </div>
        </div>
        <div className="title-bar-right">
          <nav className="title-nav">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="status-cluster">
            <span className="status-dot" />
            available for work
          </div>
        </div>
      </div>

      <div className="container">{children}</div>
    </div>
  );
}
