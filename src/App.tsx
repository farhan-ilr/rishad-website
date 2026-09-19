import { useEffect, useRef, useState } from 'react'
import { projects, services } from './data'

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
    const requested = new Set<number>()
    const images = imagesRef.current
    const draw = (index: number) => {
      const image = images[index]
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
      draw(frameRef.current)
    }
    const render = () => {
      rafRef.current = null
      const bounds = section.getBoundingClientRect()
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-bounds.top / travel, 0), 1)
      const target = Math.round(progress * (frameCount - 1))
      loadFrames(target, reducedMotion ? 0 : 8)
      if (target !== frameRef.current) {
        frameRef.current = target
        draw(target)
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
        if (index === 0) {
          setReady(true)
          draw(0)
        }
        setLoadProgress(Math.min(100, Math.round((loaded / Math.min(frameCount, 18)) * 100)))
        if (index === frameRef.current) draw(index)
      }
    }
    function loadFrames(center: number, radius: number) {
      for (let offset = -radius; offset <= radius; offset += 1) loadFrame(center + offset)
    }
    resize()
    loadFrames(0, reducedMotion ? 0 : 9)
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
          <span>{ready ? '↓' : `${loadProgress}%`}</span>
        </div>
      </div>
    </section>
  )
}

function Header() {
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
      <a href="#work">Work</a><a href="#about">About</a><a href="#services">Services</a>
    </nav>
    <a className="header-contact" href="#contact">Start a project <span>↗</span></a>
  </header>
}

function ProjectCard({ project, index, onOpen }: { project: typeof projects[number]; index: number; onOpen: (project: typeof projects[number]) => void }) {
  return <a className={`project-card project-${index + 1}`} href="#project-viewer" aria-label={`View ${project.title}`} onClick={(event) => { event.preventDefault(); onOpen(project) }}>
    <div className="project-image"><img src={project.image} alt={`${project.title}, ${project.subtitle}`} loading="lazy" /></div>
    <div className="project-meta"><div className="project-title-group"><p><b>{String(index + 1).padStart(2, '0')}</b> / {project.category}</p><h3>{project.title}</h3><span>{project.subtitle}</span></div><div className="project-place">{project.location}<span className="project-open">View project ↗</span></div></div>
  </a>
}

function ProjectViewer({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  const links = project.links ?? []
  return <div className="project-viewer" id="project-viewer" role="dialog" aria-modal="true" aria-label={`${project.title} project links`}>
    <button className="viewer-close" onClick={onClose} aria-label="Close project viewer">Close <span>×</span></button>
    <div className="viewer-image"><img src={project.image} alt={`${project.title}, ${project.subtitle}`} /></div>
    <div className="viewer-heading"><p className="section-label">Selected project / {project.category}</p><h2>{project.title}</h2><p>{project.location} · {project.subtitle}</p></div>
    <div className="viewer-links">{links.map((link, index) => <a href={link.url} target="_blank" rel="noreferrer" key={link.url}><span>{String(index + 1).padStart(2, '0')}</span><strong>{link.label}</strong><em>Open on Behance ↗</em></a>)}</div>
  </div>
}

function App() {
  const [activeProject, setActiveProject] = useState<typeof projects[number] | null>(null)

  return <div id="top">
    <Header />
    <main>
      <FrameExperience />
      <section className="intro section-pad" id="about">
        <p className="section-label">01 / Perspective</p>
        <div className="intro-content"><h2>Spaces designed around the way <em>you live.</em></h2><p>Rishad is an interior designer focused on creating refined, functional and timeless spaces where architecture, material and atmosphere come together.</p></div>
      </section>
      <section className="work section-pad" id="work">
        <div className="section-heading"><div><p className="section-label">02 / Selected work</p><h2>A study in <em>living.</em></h2></div><span className="work-count">10 projects / 2026</span></div>
        <div className="project-grid featured-projects">{projects.slice(0, 5).map((project, index) => <ProjectCard key={project.title} project={project} index={index} onOpen={setActiveProject} />)}</div>
        <div className="project-list">{projects.slice(5).map((project, index) => <ProjectCard key={project.title} project={project} index={index + 5} onOpen={setActiveProject} />)}</div>
      </section>
      <section className="services section-pad" id="services">
        <div className="services-lead"><p className="section-label">03 / What we do</p><h2>Quietly<br /><em>considered.</em></h2></div>
        <div className="service-list">{services.map(([number, label]) => <div className="service-row" key={number}><span>{number}</span><h3>{label}</h3><span className="service-arrow">↗</span></div>)}</div>
      </section>
      <section className="contact" id="contact"><div className="contact-inner"><p className="section-label">04 / Begin a conversation</p><h2>Let's create<br /><em>a space worth living in.</em></h2><a className="contact-link" href="mailto:rishad@example.com">rishad@example.com <span>↗</span></a><div className="social-links"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram <span>↗</span></a><a href="https://wa.me/" target="_blank" rel="noreferrer">WhatsApp <span>↗</span></a></div><p className="contact-place">Malappuram, Kerala<br />India</p></div></section>
    </main>
    <footer className="site-footer"><span>Rishad / Interior designer</span><div className="footer-links"><a href="https://www.behance.net/Rishad777" target="_blank" rel="noreferrer">Behance ↗</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://wa.me/" target="_blank" rel="noreferrer">WhatsApp ↗</a></div><span>© 2026</span></footer>
    {activeProject && <ProjectViewer project={activeProject} onClose={() => setActiveProject(null)} />}
  </div>
}

export default App
