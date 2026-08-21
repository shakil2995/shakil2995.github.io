/**
 * Single source of truth for all site content.
 * Edit anything here — sections read straight from these exports.
 */

export const profile = {
  name: 'Shakil Ahmed',
  firstName: 'Shakil',
  handle: '@shakil2995',
  role: 'Product Engineer & Fullstack Developer',
  // The rotating words in the hero subtitle.
  roles: [
    'Product Engineer',
    'Fullstack Developer',
    'AI SaaS Founder',
    'Mobile App Builder',
    'Systems Architect',
  ],
  tagline:
    'I build fast, polished web and mobile products from idea to launch — focusing on clean design, real utility, and great user experience.',
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
  email: 'devshakil.ati@gmail.com',
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
  { key: 'years', label: 'Years building', suffix: '+' },
  { key: 'repos', label: 'Open-source repos', value: 45, suffix: '+' },
  { key: 'stack', label: 'Core technologies', value: 15, suffix: '+' },
  { key: 'projects', label: 'Products shipped', value: 100, suffix: '+' },
]

export const about = {
  paragraphs: [
    "I’m a software engineer and founder who loves turning complex ideas into clean, reliable software that feels effortless to use.",
    "Currently leading engineering at ATI Limited while building my own products. Over the past 8+ years, I’ve architected clinical platforms that run 100% offline, AI assistants that support customers 24/7, and mobile apps loved by thousands.",
    "Whether designing a new product from scratch or refining an existing system, I care deeply about speed, intuitive design, and rock-solid code.",
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
    title: 'Mobile Apps',
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
    title: 'Backend & AI',
    accent: 'magenta',
    items: [
      { name: 'Node.js', iconKey: 'nodejs' },
      { name: 'Express', iconKey: 'express' },
      { name: 'Python', iconKey: 'python' },
      { name: 'AI & LLMs', iconKey: 'api' },
      { name: 'Laravel', iconKey: 'laravel' },
      { name: 'PHP', iconKey: 'php' },
      { name: 'MongoDB', iconKey: 'mongodb' },
      { name: 'MySQL', iconKey: 'mysql' },
    ],
  },
  {
    title: 'Architecture & Tools',
    accent: 'cyan',
    items: [
      { name: 'Offline Sync', iconKey: 'algo' },
      { name: 'Git & GitHub', iconKey: 'git' },
      { name: 'REST APIs', iconKey: 'api' },
      { name: 'Vite', iconKey: 'vite' },
      { name: 'C++', iconKey: 'cpp' },
      { name: 'Java', iconKey: 'java' },
    ],
  },
]

export type ProjectCategory = 'all' | 'ai' | 'mobile' | 'web'

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
  imageWidth?: number
  imageHeight?: number
  caseStudy?: CaseStudy
  repo?: string
  live?: string
  playStore?: string
  hideOnAll?: boolean
  label?: string
  accent: 'cyan' | 'violet' | 'magenta'
}

export const projectCategories = [
  { id: 'all' as const, label: 'All Projects' },
  { id: 'ai' as const, label: '🤖 AI & SaaS' },
  { id: 'mobile' as const, label: '📱 Mobile Apps' },
  { id: 'web' as const, label: '🌐 Web & Platforms' },
]

export const projects: Project[] = [
  {
    title: 'Zinodesk',
    category: 'ai',
    categoryLabel: 'AI SaaS',
    badge: '⭐ Star Product · Founder',
    blurb:
      'An intelligent AI receptionist for businesses. Embeds on any website with one line of code to answer customer questions and capture leads 24/7.',
    highlights: ['1-line website embed', 'Trained on your business content', '24/7 automated lead capture'],
    image: './projects/zinodesk.webp',
    imageWidth: 1024,
    imageHeight: 480,
    caseStudy: {
      role: 'Founder & Fullstack Architect',
      timeframe: '2025 — Present',
      problem:
        'Small businesses lose potential customers after hours because 24/7 human support is too expensive, while generic chatbots give inaccurate or irrelevant answers.',
      approach: [
        {
          title: 'Live in 5 minutes',
          detail:
            'Designed for non-technical business owners — upload documents or website links, style the widget, and paste one script tag.',
        },
        {
          title: 'Accurate business retrieval',
          detail:
            'Uses private document grounding so the AI only speaks from verified company knowledge, avoiding hallucinations.',
        },
        {
          title: 'Zero-friction website embed',
          detail:
            'A lightweight, sandboxed widget that adapts to any website design without slowing down page load times.',
        },
        {
          title: 'Conversational lead funnel',
          detail:
            'Automatically collects visitor emails, phone numbers, and booking requests directly inside the chat.',
        },
      ],
      outcome: [
        'Live in production at zinodesk.com serving active businesses.',
        '100% self-serve onboarding with zero developer setup required.',
        'Proven increase in after-hours customer inquiry conversion.',
      ],
    },
    live: 'https://zinodesk.com',
    tags: ['AI', 'SaaS', 'Chatbot', 'Founder', 'Next.js'],
    accent: 'cyan',
  },
  {
    title: 'ATI EMR',
    category: 'web',
    categoryLabel: 'Healthcare System',
    badge: '🏆 Signature System',
    blurb:
      'A hospital-grade electronic medical records platform that works 100% offline. Keeps multiple clinic devices synchronized over the local network with zero internet dependency.',
    highlights: ['Zero-internet LAN sync', 'Multi-device patient records', 'Custom clinic workflows'],
    image: './projects/ati_emr.webp',
    imageWidth: 1024,
    imageHeight: 576,
    caseStudy: {
      role: 'Lead Systems Architect',
      timeframe: 'ATI Limited',
      problem:
        'Clinics cannot pause patient care when internet goes down. Losing connectivity during consultations risks lost vitals, delayed prescriptions, and blocked triage.',
      approach: [
        {
          title: 'Offline by default',
          detail:
            'Every clinical record, vital sign, and prescription is written locally first so consultations never stall.',
        },
        {
          title: 'Local mesh synchronization',
          detail:
            'Doctors, nurses, and receptionists stay instantly updated across devices over the clinic’s local Wi-Fi without needing cloud servers.',
        },
        {
          title: 'Unified clinical workspace',
          detail:
            'Combines patient history, vitals, billing, and pharmacy orders into a single, intuitive dashboard.',
        },
      ],
      outcome: [
        'Deployed across clinics as ATI Limited’s flagship healthcare software.',
        'Zero downtime and uninterrupted patient consultations even during ISP outages.',
        'Runs reliably on existing clinic hardware without expensive cloud bills.',
      ],
    },
    label: 'Signature System',
    tags: ['Healthcare', 'Offline-First', 'Local Sync', 'Enterprise'],
    accent: 'magenta',
  },
  {
    title: 'Starlight OTT',
    category: 'web',
    categoryLabel: 'Streaming Platform',
    badge: '🎥 Streaming Service',
    blurb:
      'A modern movie and TV streaming platform featuring instant buffer-free playback, multi-language subtitles, adaptive video streaming, and personalized watchlists.',
    highlights: ['Instant HD video playback', 'Multi-language subtitles', 'Adaptive quality switching'],
    image: './projects/starlight.webp',
    imageWidth: 1024,
    imageHeight: 478,
    live: 'https://movie.adnetworkbd.shop/#',
    tags: ['React', 'Vite', 'Laravel', 'Video Streaming', 'Full-Stack'],
    accent: 'cyan',
  },
  {
    title: 'SmartPilot',
    category: 'ai',
    categoryLabel: 'Social Commerce AI',
    badge: 'Founder',
    blurb:
      'An automated AI assistant for Facebook pages that answers customer messages, replies to comments, and captures sales orders 24/7 without manual effort.',
    highlights: ['Instant AI replies to messages & comments', 'Automated order checkout', '24/7 social sales'],
    image: './projects/smartpilot.webp',
    imageWidth: 1024,
    imageHeight: 482,
    live: 'https://smartpilot.site/',
    tags: ['AI', 'Automation', 'Founder', 'Social Commerce'],
    accent: 'cyan',
  },
  {
    title: 'Livora (My SG)',
    category: 'mobile',
    categoryLabel: 'Mobile App & SaaS',
    badge: 'Mobile App & SaaS',
    blurb:
      'A mobile community platform connecting users with local job listings, trusted services, a community marketplace, and a centralized admin moderation dashboard.',
    highlights: ['Available on Google Play', 'Job board & marketplace', 'Real-time admin control center'],
    image: './projects/livora.webp',
    imageWidth: 1024,
    imageHeight: 483,
    live: 'https://my-sg.com/',
    playStore: 'https://play.google.com/store/apps/details?id=com.ucllc.mysg',
    tags: ['Flutter', 'Mobile', 'Play Store', 'Community', 'Dashboard'],
    accent: 'violet',
  },
  {
    title: 'SNS Digitals',
    category: 'web',
    categoryLabel: 'Software Studio',
    badge: 'Founder',
    blurb:
      'A digital product studio designing and engineering custom web apps, mobile apps, and automated AI solutions for founders and growing businesses.',
    highlights: ['100+ projects delivered', 'End-to-end product delivery', 'Modern AI integrations'],
    image: './projects/sns_digitals.webp',
    imageWidth: 1024,
    imageHeight: 481,
    label: 'Software Studio',
    tags: ['Studio', 'Founder', 'Web & Mobile', 'Product Engineering'],
    accent: 'cyan',
  },
  {
    title: 'Ushuttle',
    category: 'mobile',
    categoryLabel: 'Campus Transit App',
    badge: 'Mobile App',
    blurb:
      'A cross-platform transit app for university students and drivers featuring live GPS bus tracking, estimated arrival times, and digital QR ticket verification.',
    highlights: ['Live GPS bus tracking', 'Instant route updates', 'QR ticket check-in'],
    image: './projects/ushuttle.webp',
    imageWidth: 836,
    imageHeight: 488,
    repo: 'https://github.com/shakil2995/Ushuttle',
    hideOnAll: true,
    tags: ['Flutter', 'Dart', 'Mobile', 'Maps', 'GPS'],
    accent: 'violet',
  },
  {
    title: 'Tent Design USA',
    category: 'web',
    categoryLabel: 'E-Commerce Storefront',
    badge: 'Client Storefront',
    blurb:
      'An interactive digital storefront for commercial canopy tents and event displays, featuring a real-time custom product quote builder.',
    highlights: ['Interactive catalog', 'Instant quote request builder', 'Fast, mobile-friendly design'],
    image: './projects/tent_usa.webp',
    imageWidth: 1024,
    imageHeight: 484,
    live: 'https://tentdesignusa.com/',
    tags: ['E-Commerce', 'Frontend', 'Tailwind CSS', 'Responsive'],
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
    when: '2025 — Present',
    title: 'Lead Software Engineer',
    place: 'ATI Limited',
    detail:
      'Leading engineering teams and architecting signature products — including ATI EMR (offline healthcare platform), Zinodesk (AI SaaS), and high-scale web systems.',
    accent: 'cyan',
  },
  {
    when: '2024 — 2025',
    title: 'Mobile Application Developer',
    place: 'ATI Limited',
    detail:
      'Crafted high-performance cross-platform mobile apps with Flutter, taking features from Figma designs to production App Store and Google Play releases.',
    accent: 'violet',
  },
  {
    when: '2023 — 2024',
    title: 'Software Engineer',
    place: 'Winning Bees',
    detail:
      'Built responsive full-stack web applications and shipped customer-facing features in fast-paced collaborative sprints.',
    accent: 'magenta',
  },
  {
    when: '2023',
    title: 'Engineering Intern',
    place: 'Excellent Soft',
    detail:
      'Turned core computer science fundamentals into production software during an intensive full-stack internship.',
    accent: 'cyan',
  },
  {
    when: 'Graduation',
    title: 'B.Sc. in Computer Science & Engineering',
    place: 'Independent University, Bangladesh (IUB)',
    detail:
      'Graduated with a CSE degree, building deep foundations in algorithms, software architecture, and distributed systems.',
    accent: 'violet',
  },
]

