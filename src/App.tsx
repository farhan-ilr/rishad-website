import { ArrowDown, ArrowUpRight, Camera, Mail, MapPin, MessageCircle, Palette, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { projects, services, type Project } from './data'

const frameCount = 300
const framePath = (index: number) => `/frame_${String(index + 1).padStart(4, '0')}.webp`

function FrameExperience() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const frameRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(reduce.matches)
    const onChange = () => setReducedMotion(reduce.matches)
    reduce.addEventListener('change', onChange)
    return () => reduce.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return
    let cancelled = false
    let loaded = 0
    const initialFrameCount = reducedMotion ? 1 : 18
    const initialLoaded = new Set<number>()
    const requested = new Set<number>()
    const images: (HTMLImageElement | null)[] = (imagesRef.current = [])
    const draw = (index: number) => {
      let image = images[index]
      if (!image?.complete || !image.naturalWidth) {
        for (let distance = 1; distance < frameCount; distance += 1) {
          image = images[index - distance] ?? images[index + distance]
          if (image?.complete && image.naturalWidth) break
        }
      }
      if (!image?.complete || !image.naturalWidth) return
      const ratio = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight)
      const width = image.naturalWidth * ratio
      const height = image.naturalHeight * ratio
      context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
    }
    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(canvas.clientWidth * pixelRatio)
      canvas.height = Math.floor(canvas.clientHeight * pixelRatio)
      draw(Math.round(frameRef.current))
    }
    const render = () => {
      rafRef.current = null
      const bounds = section.getBoundingClientRect()
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-bounds.top / travel, 0), 1)
      const target = Math.round(progress * (frameCount - 1))
      loadFrames(target, reducedMotion ? 0 : 10)
      const smoothing = window.matchMedia('(max-width: 700px)').matches ? 0.14 : 0.2
      frameRef.current += (target - frameRef.current) * smoothing
      draw(Math.round(frameRef.current))
      if (Math.abs(target - frameRef.current) > 0.5 && rafRef.current === null) {
        rafRef.current = requestAnimationFrame(render)
      }
    }
    const onScroll = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(render)
    }
    const onResize = () => resize()
    const loadFrame = (index: number) => {
      if (index < 0 || index >= frameCount || requested.has(index) || images[index]) return
      requested.add(index)
      const image = new Image()
      image.decoding = 'async'
      image.src = framePath(index)
      image.onload = () => {
        if (cancelled) return
        images[index] = image
        loaded += 1
        if (index < initialFrameCount) {
          initialLoaded.add(index)
          setLoadProgress(Math.round((initialLoaded.size / initialFrameCount) * 100))
          if (initialLoaded.size === initialFrameCount) setReady(true)
        }
        if (index === Math.round(frameRef.current)) draw(index)
      }
      image.onerror = () => {
        if (cancelled || index >= initialFrameCount) return
        initialLoaded.add(index)
        setLoadProgress(Math.round((initialLoaded.size / initialFrameCount) * 100))
        if (initialLoaded.size === initialFrameCount) setReady(true)
      }
    }
    function loadFrames(center: number, radius: number) {
      for (let offset = -radius; offset <= radius; offset += 1) loadFrame(center + offset)
    }
    resize()
    loadFrames(0, reducedMotion ? 0 : initialFrameCount - 1)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [reducedMotion])

  return (
    <section className="frame-experience" ref={sectionRef} aria-label="Enter the space">
      <div className="frame-stage">
        <canvas ref={canvasRef} aria-label="A cinematic journey through a contemporary interior" />
        <div className={`frame-wash ${ready ? 'is-ready' : ''}`} />
        <div className="hero-copy">
          <p className="eyebrow">Interior design / Kerala, India</p>
          <h1>Rishad</h1>
          <p className="hero-role">Interior designer</p>
          <p className="hero-note">Enter a world shaped by light, material and proportion.</p>
        </div>
        <div className="frame-status" aria-live="polite">
          <span>{ready ? 'Scroll to enter' : 'Loading experience'}</span>
          <span>{ready ? <ArrowDown size={14} strokeWidth={1.8} /> : `${loadProgress}%`}</span>
        </div>
      </div>
    </section>
  )
}

type PanelName = 'work' | 'about' | 'services' | 'contact'

function Header({ onOpen }: { onOpen: (panel: PanelName) => void }) {
  const [overHero, setOverHero] = useState(true)

  useEffect(() => {
    const updateHeader = () => setOverHero(window.scrollY < window.innerHeight * 0.82)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    window.addEventListener('resize', updateHeader)
    return () => {
      window.removeEventListener('scroll', updateHeader)
      window.removeEventListener('resize', updateHeader)
    }
  }, [])

  return <header className={`site-header ${overHero ? 'is-over-hero' : 'is-over-content'}`}>
    <a className="wordmark" href="#top" aria-label="Rishad home">Rishad<span>/</span></a>
    <nav aria-label="Main navigation">
      <button onClick={() => onOpen('work')}>Work</button><button onClick={() => onOpen('about')}>About</button><button onClick={() => onOpen('services')}>Services</button>
    </nav>
    <div className="header-actions">
      <a className="header-behance" href="https://www.behance.net/Rishad777" target="_blank" rel="noreferrer" aria-label="Behance"><Palette size={13} strokeWidth={2} /></a>
      <button className="header-contact" onClick={() => onOpen('contact')}>Start a project <span className="inline-icon"><ArrowUpRight size={14} strokeWidth={2} /></span></button>
    </div>
  </header>
}

function ProjectCard({ project, index, onOpen }: { project: typeof projects[number]; index: number; onOpen: (project: typeof projects[number]) => void }) {
  return <a className={`project-card project-${index + 1}`} href="#project-viewer" aria-label={`View ${project.title}`} onClick={(event) => { event.preventDefault(); onOpen(project) }}>
    <div className="project-image"><img src={project.image} alt={`${project.title}, ${project.subtitle}`} loading="lazy" /></div>
    <div className="project-meta"><div className="project-title-group"><p><b>{String(index + 1).padStart(2, '0')}</b> / {project.category}</p><h3>{project.title}</h3><span>{project.subtitle}</span></div><div className="project-place">{project.location}<span className="project-open">View project <span className="inline-icon"><ArrowUpRight size={12} strokeWidth={2} /></span></span></div></div>
  </a>
}

function ProjectViewer({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  const links = project.links ?? []
  return <div className="project-viewer" id="project-viewer" role="dialog" aria-modal="true" aria-label={`${project.title} project links`}>
    <button className="viewer-close" onClick={onClose} aria-label="Close project viewer">Close <span className="inline-icon"><X size={18} strokeWidth={1.8} /></span></button>
    <div className="viewer-image"><img src={project.image} alt={`${project.title}, ${project.subtitle}`} /></div>
    <div className="viewer-heading"><p className="section-label">Selected project / {project.category}</p><h2>{project.title}</h2><p>{project.location} · {project.subtitle}</p></div>
    <div className="viewer-links">{links.map((link, index) => <a href={link.url} target="_blank" rel="noreferrer" key={link.url}><span>{String(index + 1).padStart(2, '0')}</span><strong>{link.label}</strong><em>Open on Behance <span className="inline-icon"><ArrowUpRight size={12} strokeWidth={2} /></span></em></a>)}</div>
  </div>
}

function SectionSheet({ panel, projects, onClose, onProjectOpen }: { panel: PanelName; projects: Project[]; onClose: () => void; onProjectOpen: (project: Project) => void }) {
  const content = {
    work: { label: '02 / Selected work', title: 'A study in living.' },
    about: { label: '01 / Perspective', title: 'Spaces designed around the way you live.' },
    services: { label: '03 / What we do', title: 'Quietly considered.' },
    contact: { label: '04 / Begin a conversation', title: 'Let\'s create a space worth living in.' },
  }[panel]
  return <div className="section-sheet-backdrop" role="presentation" onClick={onClose}>
    <section className={`section-sheet section-sheet-${panel}`} role="dialog" aria-modal="true" aria-label={content.title} onClick={(event) => event.stopPropagation()}>
      <button className="sheet-close" onClick={onClose} aria-label="Close panel">Close <span className="inline-icon"><X size={18} strokeWidth={1.8} /></span></button>
      <p className="section-label">{content.label}</p>
      <h2>{content.title}</h2>
      {panel === 'work' && <div className="sheet-projects">{projects.map((project) => <button className="sheet-project" key={project.title} onClick={() => onProjectOpen(project)}><img src={project.image} alt="" /><span>{project.title}</span><small>{project.category} / {project.location} <span className="inline-icon inline-icon-small"><ArrowUpRight size={11} strokeWidth={2} /></span></small></button>)}</div>}
      {panel === 'about' && <div className="sheet-about"><p className="sheet-name">Rishad P</p><p className="sheet-role">Interior designer</p><p className="sheet-copy">I create refined, functional and timeless spaces where architecture, material and atmosphere come together. My work is shaped around the way people live, gather and feel at home.</p></div>}
      {panel === 'services' && <div className="sheet-services">{services.map(([number, label]) => <p key={number}><span>{number}</span>{label}</p>)}</div>}
      {panel === 'contact' && <div className="sheet-contact"><a href="mailto:rishad@example.com">rishad@example.com <span className="inline-icon"><ArrowUpRight size={12} strokeWidth={2} /></span></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram <span className="inline-icon"><ArrowUpRight size={12} strokeWidth={2} /></span></a><a href="https://wa.me/" target="_blank" rel="noreferrer">WhatsApp <span className="inline-icon"><ArrowUpRight size={12} strokeWidth={2} /></span></a></div>}
    </section>
  </div>
}

function App() {
  const [activeProject, setActiveProject] = useState<typeof projects[number] | null>(null)
  const [activePanel, setActivePanel] = useState<PanelName | null>(null)

  return <div id="top">
    <Header onOpen={setActivePanel} />
    <main>
      <FrameExperience />
      <section className="intro section-pad" id="about">
        <p className="section-label">01 / Perspective</p>
        <div className="intro-content">
          <h2>Spaces designed around the way <em>you live.</em></h2>
          <p className="intro-signature">Rishad P</p>
          <p className="intro-role">Interior designer</p>
          <p className="intro-copy">I create refined, functional and timeless spaces where architecture, material and atmosphere come together. My work is shaped around the way people live, gather and feel at home.</p>
        </div>
      </section>
      <section className="work section-pad" id="work">
        <div className="section-heading"><div><p className="section-label">02 / Selected work</p><h2>A study in <em>living.</em></h2></div><span className="work-count">10 projects / 2026</span></div>
        <div className="project-grid featured-projects">{projects.slice(0, 5).map((project, index) => <ProjectCard key={project.title} project={project} index={index} onOpen={setActiveProject} />)}</div>
        <div className="project-list">{projects.slice(5).map((project, index) => <ProjectCard key={project.title} project={project} index={index + 5} onOpen={setActiveProject} />)}</div>
      </section>
      <section className="services section-pad contact-combined" id="services">
        <div className="services-column">
          <div className="services-lead"><p className="section-label">03 / What we do</p><h2>Quietly<br /><em>considered.</em></h2><p className="services-intro">From the first plan to the final detail, every space is shaped with clarity, warmth and purpose.</p></div>
          <div className="service-list">{services.map(([number, label]) => <div className="service-row" key={number}><span>{number}</span><h3>{label}</h3><span className="service-arrow"><ArrowUpRight size={16} strokeWidth={2} /></span></div>)}</div>
        </div>
        <div className="contact-column">
          <div className="contact-inner">
            <p className="section-label">04 / Begin a conversation</p>
            <h2>Let's create<br /><em>a space worth living in.</em></h2>
            <div className="contact-actions">
              <div className="contact-stack">
                <a className="contact-link" href="mailto:rishadhparmapan@gmail.com"><span className="inline-icon"><Mail size={12} strokeWidth={2} /></span> rishadhparmapan@gmail.com</a>
                <a href="https://www.instagram.com/_rish_ad__p/" target="_blank" rel="noreferrer"><span className="inline-icon"><Camera size={12} strokeWidth={2} /></span> Instagram</a>
                <a href="https://wa.me/99946801100" target="_blank" rel="noreferrer"><span className="inline-icon"><MessageCircle size={12} strokeWidth={2} /></span> WhatsApp</a>
                <a href="https://www.behance.net/Rishad777" target="_blank" rel="noreferrer"><span className="inline-icon"><Palette size={12} strokeWidth={2} /></span> Behance</a>
              </div>
              <p className="contact-place"><span className="inline-icon inline-icon-map"><MapPin size={12} strokeWidth={2} /></span> Malappuram, Kerala<br />India</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer className="site-footer"><span>Rishad / Interior designer</span><div className="footer-links"><a href="https://www.behance.net/Rishad777" target="_blank" rel="noreferrer">Behance <span className="inline-icon"><Palette size={10} strokeWidth={2} /></span></a><a href="https://www.instagram.com/_rish_ad__p/" target="_blank" rel="noreferrer">Instagram <span className="inline-icon"><Camera size={10} strokeWidth={2} /></span></a><a href="https://wa.me/99946801100" target="_blank" rel="noreferrer">WhatsApp <span className="inline-icon"><MessageCircle size={10} strokeWidth={2} /></span></a></div><span>© 2026</span></footer>
    {activePanel && <SectionSheet panel={activePanel} projects={projects} onClose={() => setActivePanel(null)} onProjectOpen={(project) => { setActivePanel(null); setActiveProject(project) }} />}
    {activeProject && <ProjectViewer project={activeProject} onClose={() => setActiveProject(null)} />}
  </div>
}

export default App
