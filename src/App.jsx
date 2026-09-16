import CrtOverlay from './components/CrtOverlay.jsx';
import TerminalWindow from './components/TerminalWindow.jsx';
import Hero from './components/Hero.jsx';
import IdentityCard from './components/IdentityCard.jsx';
import ExperienceLog from './components/ExperienceLog.jsx';
import ProjectsGrid from './components/ProjectsGrid.jsx';
import SkillMeters from './components/SkillMeters.jsx';
import ContactCTA from './components/ContactCTA.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <CrtOverlay />
      <TerminalWindow>
        <Hero />
        <IdentityCard />
        <div className="section-rule" />
        <ExperienceLog />
        <div className="section-rule" />
        <ProjectsGrid />
        <div className="section-rule" />
        <SkillMeters />
        <div className="section-rule" />
        <ContactCTA />
        <Footer />
      </TerminalWindow>
    </>
  );
}
