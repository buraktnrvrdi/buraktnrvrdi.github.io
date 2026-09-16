const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
];

export default function Nav() {
  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-links">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-square">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
