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
  avatar: './avatar.webp',
  avatarWidth: 1024,
  avatarHeight: 1024,
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
  email: 'atidevs01@gmail.com',
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
  { key: 'projects', label: 'Projects shipped', value: 100, suffix: '+' },
]

export const about = {
  paragraphs: [
    "Shakil Ahmed (@shakil2995) is a software developer specializing in Flutter, mobile applications, Node.js, backend systems, and full-stack architecture.",
    "As an AI SaaS founder and engineering team lead at ATI Limited, I build fast, polished products end to end — from offline-first healthcare platforms like ATI EMR to intelligent 24/7 AI receptionists like Zinodesk.",
    "Since 2017 I've shipped 100+ production applications, pairing rigorous computer science foundations with modern cloud, AI, and mobile frameworks that users love.",
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

/**
 * Long-form project breakdown shown in the case-study drawer.
 *
 * NOTE: `outcome` deliberately contains no invented metrics. Replace these lines
 * with real numbers when you have them (users onboarded, clinics deployed,
 * response latency, uptime) — concrete figures are what make a case study land.
 */
export type CaseStudy = {
  role: string
  timeframe: string
  problem: string
  approach: Array<{ title: string; detail: string }>
  outcome: string[]
}

export type Project = {
  title: string
  category: 'ai' | 'mobile' | 'web'
  categoryLabel: string
  badge?: string
  blurb: string
  tags: string[]
  highlights?: string[]
  image?: string
  /** Intrinsic pixel size of `image` — set so the browser reserves space (no layout shift). */
  imageWidth?: number
  imageHeight?: number
  /** Long-form breakdown. Present only on signature work; renders an expandable case study. */
  caseStudy?: CaseStudy
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
    image: './projects/zinodesk.webp',
    imageWidth: 1024,
    imageHeight: 480,
    caseStudy: {
      role: 'Founder · Architect · Sole engineer',
      timeframe: '2025 — ongoing',
      problem:
        'Small businesses lose enquiries outside office hours, but staffing a human receptionist around the clock is not viable for them. Off-the-shelf chatbots either need a developer to wire up, or answer from generic training data that knows nothing about the actual business.',
      approach: [
        {
          title: 'Onboarding measured in minutes, not sprints',
          detail:
            'The whole product is designed around one constraint: a non-technical owner has to be live in five minutes. Business knowledge is uploaded rather than configured, and the widget ships as a single script tag — no build step, no framework requirement, no backend work on the customer side.',
        },
        {
          title: 'Grounding the model in the customer\u2019s own knowledge',
          detail:
            'Rather than fine-tuning per customer, each tenant\u2019s uploaded material becomes the retrieval corpus the assistant answers from. That keeps answers specific to the business while staying on a shared, cheap-to-operate LLM path.',
        },
        {
          title: 'The widget is the product surface',
          detail:
            'It is embedded in someone else\u2019s page, so it has to be visually customisable enough to feel native to their brand, and isolated enough that it can never break their site. That pushed the styling and mounting strategy toward strict encapsulation.',
        },
        {
          title: 'Conversation as a lead pipeline',
          detail:
            'Answering questions is table stakes; the commercial value is in capturing intent. Conversations are treated as a funnel, so qualifying details surface as structured leads rather than staying buried in chat logs.',
        },
      ],
      outcome: [
        'Live in production at zinodesk.com, serving real businesses.',
        'Self-serve onboarding — no engineering involvement per customer.',
        'Single-line embed removed the integration barrier that blocks non-technical buyers.',
      ],
    },
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
    image: './projects/ati_emr.webp',
    imageWidth: 1024,
    imageHeight: 576,
    caseStudy: {
      role: 'Architect · Engineering lead',
      timeframe: 'ATI Limited',
      problem:
        'Clinics and hospitals cannot make patient care depend on an internet connection. A dropped link during a consultation cannot be allowed to stall a prescription or lose a set of vitals — but staff still need to work across several devices and see the same patient record.',
      approach: [
        {
          title: 'Offline is the default state, not the failure state',
          detail:
            'The system is built so that every clinical action completes locally first. Connectivity is treated as an optimisation for sharing data between devices, never as a precondition for recording care.',
        },
        {
          title: 'Sync over the local network instead of the cloud',
          detail:
            'Devices reconcile with each other across the clinic LAN, so a site with no external connection still gets a shared, current patient record. This removes the hosting dependency that usually rules EMR systems out for smaller facilities.',
        },
        {
          title: 'One patient workspace across roles',
          detail:
            'Patient records, vitals tracking, the clinic pipeline and prescription management are unified into a single workspace rather than separate modules, so a patient\u2019s state is legible at a glance regardless of which device or role opened it.',
        },
        {
          title: 'Workflows configurable per clinic',
          detail:
            'No two clinics run the same intake process. Clinical workflows are customisable so the software adapts to an existing practice instead of forcing staff to change how they work.',
        },
      ],
      outcome: [
        'Deployed as ATI Limited\u2019s signature clinical system.',
        'Full patient workspace, vitals, pipeline and prescriptions usable with zero internet dependency.',
        'Multi-device clinics stay in sync without any cloud infrastructure to buy or maintain.',
      ],
    },
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
    image: './projects/starlight.webp',
    imageWidth: 1024,
    imageHeight: 478,
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
    image: './projects/smartpilot.webp',
    imageWidth: 1024,
    imageHeight: 482,
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
    image: './projects/livora.webp',
    imageWidth: 1024,
    imageHeight: 483,
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
    highlights: ['100+ projects delivered', 'Intelligent automation systems', 'End-to-end engineering'],
    image: './projects/sns_digitals.webp',
    imageWidth: 1024,
    imageHeight: 481,
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
    image: './projects/ushuttle.webp',
    imageWidth: 836,
    imageHeight: 488,
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
    image: './projects/tent_usa.webp',
    imageWidth: 1024,
    imageHeight: 484,
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
