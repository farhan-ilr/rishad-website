export type Project = {
  title: string
  subtitle: string
  category: string
  location: string
  image: string
  url?: string
  links?: { label: string; url: string }[]
  tone: 'light' | 'dark'
}

export const projects: Project[] = [
  { title: 'Ashiq EK Residence', subtitle: 'Master bedroom', category: 'Residential', location: 'Kerala, India', image: 'https://mir-cdn.behance.net/v1/rendition/project_modules/max_1200/e6c57a248000579.69e7afdf0a59d.png', links: [
    { label: 'Master bedroom', url: 'https://www.behance.net/gallery/248000579/ASHIQ-EK-RESIDENCE-MASTER-BEDROOM' },
    { label: 'Bedroom', url: 'https://www.behance.net/gallery/248000377/ASHIQ-EK-RESIDENCE-BEDROOM' },
  ], tone: 'light' },
  { title: 'Formal Living', subtitle: 'Afsal residence', category: 'Residential', location: 'Malappuram, India', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d0c507247397509.69d9dfd34b1fa.png', links: [
    { label: 'Formal living', url: 'https://www.behance.net/gallery/247397509/FORMAL-LIVING-AFSAL-MALAPPURAM' },
  ], tone: 'light' },
  { title: 'Kids Room', subtitle: 'Rashid residence', category: 'Residential', location: 'Bahrain', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/898ca7247397199.69d9dd102a1d9.png', links: [
    { label: 'Kids room', url: 'https://www.behance.net/gallery/247397199/KIDS-ROOM-RASHID-BAHRAIN' },
  ], tone: 'light' },
  { title: 'Salem Khamis', subtitle: "Ladies' majlis", category: 'Hospitality', location: 'Oman', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_632/09bb36246993527.69d0d3f336681.jpg', links: [
    { label: "Ladies' majlis", url: 'https://www.behance.net/gallery/246993527/SALEM-KHAMIS-LADIES-MAJLIS-(MEDNUR)-OMAN' },
    { label: 'Family hall', url: 'https://www.behance.net/gallery/246991701/SALEM-KHAMIS-FAMILY-HALL-(MEDNUR)-OMAN' },
    { label: 'Interior design', url: 'https://www.behance.net/gallery/246991355/SALEM-KHAMIS-INTERIOR-DESIGN-(MEDNUR)-OMAN' },
  ], tone: 'dark' },
  { title: 'Sugarcane Kiosk', subtitle: 'Retail kiosk', category: 'Commercial', location: 'India', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/0d0efe237941743.690af167bb6c8.png', links: [{ label: 'Sugarcane kiosk', url: 'https://www.behance.net/gallery/237941743/SUGARCANE-KIOSK' }], tone: 'dark' },
  { title: 'Figzo Kiosk', subtitle: 'Retail kiosk', category: 'Commercial', location: 'India', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/52ee57237941487.690af07b196a1.png', links: [{ label: 'Figzo kiosk', url: 'https://www.behance.net/gallery/237941487/FIGZO-KIOSK' }], tone: 'dark' },
  { title: 'Jimshan Residence', subtitle: 'Residential interiors', category: 'Residential', location: 'Kerala, India', image: 'https://mir-s3-cdn-cf.behance.net/projects/max_808/c9afc2215459277.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png', links: [{ label: 'Jimshan residence', url: 'https://www.behance.net/gallery/215459277/JIMSHAN-RESIDENCE' }], tone: 'light' },
  { title: 'AFCO Office', subtitle: 'Workplace interiors', category: 'Commercial', location: 'India', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/d2fe6c213912907.674eef1532578.jpg', links: [{ label: 'AFCO office', url: 'https://www.behance.net/gallery/213912907/AFCO-OFFICE' }], tone: 'light' },
  { title: 'Open Class', subtitle: 'Learning space', category: 'Commercial', location: 'India', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/f85a48212302589.6732f4f1968ec.jpg', links: [{ label: 'Open class', url: 'https://www.behance.net/gallery/212302589/OPEN-CLASS' }], tone: 'light' },
  { title: 'Shawarma Fusion', subtitle: 'Food and hospitality', category: 'Commercial', location: 'India', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/0173b0206573089.66ced4a6858f8.png', links: [{ label: 'Shawarma fusion', url: 'https://www.behance.net/gallery/206573089/SHAWARMA-FUSION' }], tone: 'dark' },
]

export const services = [
  ['01', 'Residential interiors'],
  ['02', 'Commercial spaces'],
  ['03', 'Space planning'],
  ['04', '3D visualization'],
]
