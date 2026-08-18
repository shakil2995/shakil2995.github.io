/**
 * Single source of truth for all site content.
 * Edit anything here — sections read straight from these exports.
 */

export const profile = {
  name: 'Shakil Ahmed',
  firstName: 'Shakil',
  handle: '@shakil2995',
  role: 'Fullstack Developer & AI SaaS Founder',
  // The rotating words in the hero subtitle.
  roles: [
    'Fullstack Developer',
    'AI SaaS Founder',
    'Flutter Specialist',
    'Next.js & MERN Architect',
    'Offline Systems Builder',
  ],
  tagline:
    'Founder of Zinodesk & SmartPilot. Architect of ATI EMR. I build fast, polished products end to end — AI SaaS, offline-first systems, web & Flutter apps.',
  company: 'ATI Limited',
  avatar: './avatar.jpg',
  location: 'Available worldwide · Remote',
  startYear: 2017,
  publicRepos: 45,
}

export const socials = {
  github: 'https://github.com/shakil2995',
  linkedin: 'https://www.linkedin.com/in/shakil2995/',
  phone: '01837138305',
  phoneInternational: '+8801837138305',
  phoneDisplay: '+880 1837-138305',
  whatsappNumber: '8801837138305',
  whatsapp: 'https://wa.me/8801837138305?text=Hi%20Shakil,%20I%20saw%20your%20portfolio%20and%20wanted%20to%20connect!',
  resumeUrl: './resume.html',
}

export type StatKey = 'years' | 'repos' | 'stack' | 'projects'
export interface Stat {
  key: StatKey
  label: string
  suffix?: string
  /** value is computed for `years`; static for the rest */
  value?: number
}

export const stats: Stat[] = [
  { key: 'years', label: 'Years coding', suffix: '+' },
  { key: 'repos', label: 'Public repos', value: 45, suffix: '+' },
  { key: 'stack', label: 'Technologies', value: 15, suffix: '+' },
  { key: 'projects', label: 'Projects shipped', value: 50, suffix: '+' },
]

export const about = {
  paragraphs: [
    "Shakil Ahmed (@shakil2995) is a software developer specializing in Flutter, mobile applications, Node.js, backend systems, and full-stack architecture.",
    "As an AI SaaS founder and engineering team lead at ATI Limited, I build fast, polished products end to end — from offline-first healthcare platforms like ATI EMR to intelligent 24/7 AI receptionists like Zinodesk.",
    "Since 2017 I've shipped 50+ production applications, pairing rigorous computer science foundations with modern cloud, AI, and mobile frameworks that users love.",
  ],
}

export type SkillGroup = {
  title: string
  accent: 'cyan' | 'violet' | 'magenta'
  items: Array<{ name: string; iconKey?: string }>
}

export const skills: SkillGroup[] = [
  {
    title: 'Frontend & Web',
    accent: 'cyan',
    items: [
      { name: 'React', iconKey: 'react' },
      { name: 'Next.js', iconKey: 'nextjs' },
      { name: 'TypeScript', iconKey: 'typescript' },
      { name: 'JavaScript', iconKey: 'javascript' },
      { name: 'Tailwind CSS', iconKey: 'tailwind' },
      { name: 'HTML5', iconKey: 'html5' },
      { name: 'CSS3', iconKey: 'css3' },
      { name: 'Redux', iconKey: 'redux' },
    ],
  },
  {
    title: 'Mobile Development',
    accent: 'violet',
    items: [
      { name: 'Flutter', iconKey: 'flutter' },
      { name: 'Dart', iconKey: 'dart' },
      { name: 'React Native', iconKey: 'react' },
      { name: 'Firebase', iconKey: 'firebase' },
      { name: 'Google Play', iconKey: 'playstore' },
    ],
  },
  {
    title: 'Backend & AI Systems',
    accent: 'magenta',
    items: [
      { name: 'Node.js', iconKey: 'nodejs' },
      { name: 'Express', iconKey: 'express' },
      { name: 'Python', iconKey: 'python' },
      { name: 'AI / LLMs', iconKey: 'api' },
      { name: 'Laravel', iconKey: 'laravel' },
      { name: 'PHP', iconKey: 'php' },
      { name: 'MongoDB', iconKey: 'mongodb' },
      { name: 'MySQL', iconKey: 'mysql' },
    ],
  },
  {
    title: 'Tools & Architecture',
    accent: 'cyan',
    items: [
      { name: 'Offline Sync', iconKey: 'algo' },
      { name: 'Git', iconKey: 'git' },
      { name: 'GitHub', iconKey: 'github' },
      { name: 'Vite', iconKey: 'vite' },
      { name: 'C++', iconKey: 'cpp' },
      { name: 'Java', iconKey: 'java' },
    ],
  },
]

export type ProjectCategory = 'all' | 'ai' | 'mobile' | 'web'

export type Project = {
  title: string
  category: 'ai' | 'mobile' | 'web'
  categoryLabel: string
  badge?: string
  blurb: string
  tags: string[]
  highlights?: string[]
  image?: string
  repo?: string
  live?: string
  playStore?: string
  /** If true, hidden from the main 'All' grid to keep the default grid at 6 featured items */
  hideOnAll?: boolean
  /** Shown when there's no public repo/live link (e.g. "Signature Product", "Software Studio"). */
  label?: string
  accent: 'cyan' | 'violet' | 'magenta'
}

export const projectCategories = [
  { id: 'all' as const, label: 'All Projects' },
  { id: 'ai' as const, label: '🤖 AI & SaaS' },
  { id: 'mobile' as const, label: '📱 Mobile Apps' },
  { id: 'web' as const, label: '🌐 Web & Enterprise' },
]

export const projects: Project[] = [
  {
    title: 'Zinodesk',
    category: 'ai',
    categoryLabel: 'AI SaaS',
    badge: '⭐ Star Product · Founder',
    blurb:
      'Your AI Receptionist live in 5 minutes. Upload your business knowledge, customize a premium widget, and embed an intelligent assistant that captures leads and answers customer questions 24/7.',
    highlights: ['1-line script embed', 'Custom AI business knowledge', '24/7 automated lead capture'],
    image: './projects/zinodesk.png',
    live: 'https://zinodesk.com',
    tags: ['AI', 'SaaS', 'Chatbot', 'Founder', 'Next.js', 'LLMs'],
    accent: 'cyan',
  },
  {
    title: 'ATI EMR',
    category: 'web',
    categoryLabel: 'Healthcare System',
    badge: '🏆 Signature Product',
    blurb:
      'A fully offline, multi-device sync electronic medical records system for hospitals and clinics. Complete patient workspace, vitals tracking, clinic pipeline, and prescription management with zero internet dependency.',
    highlights: ['Zero-internet LAN sync', 'Multi-device patient workspace', 'Customizable clinical workflows'],
    image: './projects/ati_emr.png',
    label: 'Signature System',
    tags: ['Healthcare', 'Offline-First', 'Multi-device Sync', 'EMR', 'Enterprise'],
    accent: 'magenta',
  },
  {
    title: 'Starlight OTT',
    category: 'web',
    categoryLabel: 'Streaming Platform',
    badge: '🎥 OTT Streaming Platform',
    blurb:
      'Full-stack on-demand movie and TV series streaming platform with instant video playback, multi-language subtitles, adaptive quality switching, categorized catalog discovery, and personal watchlists.',
    highlights: ['Movie & TV series streaming', 'React Vite SPA + Laravel API backend', 'Instant playback & subtitle switching'],
    image: './projects/starlight.png',
    live: 'https://movie.adnetworkbd.shop/#',
    tags: ['React', 'Vite', 'Laravel', 'PHP', 'Streaming', 'Full-Stack'],
    accent: 'cyan',
  },
  {
    title: 'SmartPilot',
    category: 'ai',
    categoryLabel: 'AI & Automation SaaS',
    badge: 'Founder',
    blurb:
      'AI-powered Facebook page automation platform — automated message replies, intelligent comment responses, and automated order management 24/7 without manual effort.',
    highlights: ['Facebook page AI auto-replies', 'Intelligent comment & message automation', 'Automated order capture pipeline'],
    image: './projects/smartpilot.png',
    live: 'https://smartpilot.site/',
    tags: ['AI', 'SaaS', 'Founder', 'Automation', 'Social Commerce'],
    accent: 'cyan',
  },
  {
    title: 'Livora (My SG)',
    category: 'mobile',
    categoryLabel: 'Mobile App & SaaS',
    badge: 'Mobile App & SaaS',
    blurb:
      'Cross-platform mobile community app and comprehensive SaaS platform with Admin Control Center dashboard, marketplace, job listings, support tickets, and real-time moderation.',
    highlights: ['Cross-platform mobile app', 'Full Platform Admin Dashboard', 'Community & marketplace'],
    image: './projects/livora.png',
    live: 'https://my-sg.com/',
    playStore: 'https://play.google.com/store/apps/details?id=com.ucllc.mysg',
    tags: ['Flutter', 'Mobile', 'SaaS Admin', 'Play Store', 'Community'],
    accent: 'violet',
  },
  {
    title: 'SNS Digitals',
    category: 'web',
    categoryLabel: 'AI Software Studio',
    badge: 'Founder',
    blurb:
      'AI-first software studio and agency platform — designing, building, and deploying web, mobile, and desktop applications supercharged with AI for international clients.',
    highlights: ['50+ projects delivered', 'Intelligent automation systems', 'End-to-end engineering'],
    image: './projects/sns_digitals.png',
    label: 'Software Studio',
    tags: ['Agency', 'AI Studio', 'Founder', 'Fullstack', 'Web & Mobile'],
    accent: 'cyan',
  },
  {
    title: 'Ushuttle',
    category: 'mobile',
    categoryLabel: 'Mobile App (Flutter)',
    badge: 'Mobile App',
    blurb:
      'A cross-platform Flutter mobile app with client and admin interfaces for tracking university shuttle routes, live GPS bus locations, schedules, and digital ticket scanning.',
    highlights: ['Client & Admin mobile apps', 'Live GPS route tracking', 'QR ticket scanner & schedules'],
    image: './projects/ushuttle.png',
    repo: 'https://github.com/shakil2995/Ushuttle',
    hideOnAll: true,
    tags: ['Flutter', 'Dart', 'Mobile', 'Maps', 'Admin & Client'],
    accent: 'violet',
  },
  {
    title: 'Tent Design USA',
    category: 'web',
    categoryLabel: 'Client Web Platform',
    badge: 'Client Website',
    blurb:
      'Commercial web platform and digital storefront for custom canopy tents, event displays, and marketing collateral — interactive product catalog and quote request flows.',
    highlights: ['Interactive catalog', 'Dynamic quote builder', 'SEO & mobile optimized'],
    image: './projects/tent_usa.png',
    live: 'https://tentdesignusa.com/',
    tags: ['Client Website', 'JavaScript', 'Frontend', 'Tailwind CSS'],
    accent: 'magenta',
  },
]

export type TimelineEntry = {
  when: string
  title: string
  place?: string
  detail: string
  accent: 'cyan' | 'violet' | 'magenta'
}

export const timeline: TimelineEntry[] = [
  {
    when: '2025 — Now',
    title: 'Software Engineer & Team Lead',
    place: 'ATI Limited',
    detail:
      'Leading engineering teams and shipping production software — while building high-impact products: Zinodesk (Star AI SaaS), ATI EMR (Signature offline healthcare system), SmartPilot, and SNS Digitals.',
    accent: 'cyan',
  },
  {
    when: '2024 — 2025',
    title: 'Mobile App Developer',
    place: 'ATI Limited',
    detail:
      'Built production cross-platform mobile apps with Flutter, taking features from Figma designs through to Apple App Store and Google Play releases.',
    accent: 'violet',
  },
  {
    when: '2023 — 2024',
    title: 'Junior Software Engineer',
    place: 'Winning bees',
    detail:
      'Worked across the stack on web products, growing from core fundamentals into shipping real client-facing features.',
    accent: 'magenta',
  },
  {
    when: '2023',
    title: 'Intern Software Engineer',
    place: 'Excellent Soft',
    detail:
      'My first professional role — a three-month intensive internship where computer science foundations met production codebases.',
    accent: 'cyan',
  },
  {
    when: 'Graduation',
    title: 'B.Sc. in Computer Science & Engineering',
    place: 'Independent University, Bangladesh (IUB)',
    detail:
      'Graduated with a CSE degree, building rigorous fundamentals in algorithms, software architecture, distributed systems, and computer engineering.',
    accent: 'violet',
  },
]
