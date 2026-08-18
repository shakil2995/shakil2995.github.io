/**
 * Single source of truth for all site content.
 * Edit anything here — sections read straight from these exports.
 *
 * NOTE: a couple of fields are placeholders you should personalize before
 * publishing — they are marked with `// TODO:`.
 */

export const profile = {
  name: 'Shakil',
  firstName: 'Shakil',
  role: 'Fullstack Developer',
  // The rotating words in the hero subtitle.
  roles: ['Fullstack Developer', 'MERN Engineer', 'Next.js Developer', 'Flutter Developer'],
  tagline:
    'I build fast, polished products end to end — web with the MERN stack & Next.js, mobile with Flutter.',
  company: 'ATI Limited',
  avatar: 'https://avatars.githubusercontent.com/u/29783183?v=4',
  location: 'Available worldwide · Remote',
  startYear: 2017,
  publicRepos: 45,
}

export const socials = {
  github: 'https://github.com/shakil2995',
  // TODO: replace with your real public contact email before publishing.
  email: 'hello@example.com',
  // TODO: add these if you have them, otherwise leave empty and they are hidden.
  linkedin: '',
  twitter: '',
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
    "I'm a fullstack developer and team lead who likes owning a product from the database to the pixel. On the web I work across the MERN stack and Next.js; on mobile I ship cross-platform apps with Flutter.",
    "Since my first commit in 2017 I've shipped 50+ projects, public and private — from an AI website chatbot (Zinodesk) and a fully offline hospital EMR to shuttle-tracking apps and business sites — always chasing clean architecture and interfaces that feel effortless.",
  ],
}

export type SkillGroup = {
  title: string
  accent: 'cyan' | 'violet' | 'magenta'
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    title: 'Frontend',
    accent: 'cyan',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Redux'],
  },
  {
    title: 'Mobile',
    accent: 'violet',
    items: ['Flutter', 'Dart', 'React Native', 'Firebase'],
  },
  {
    title: 'Backend',
    accent: 'magenta',
    items: ['Node.js', 'Express', 'Laravel', 'PHP', 'Python', 'REST APIs', 'MongoDB', 'MySQL'],
  },
  {
    title: 'Tools & Foundations',
    accent: 'cyan',
    items: ['Git', 'GitHub', 'Vite', 'C++', 'Java', 'Data Structures'],
  },
]

export type Project = {
  title: string
  blurb: string
  tags: string[]
  repo?: string
  live?: string
  /** Shown when there's no public repo/live link (e.g. "Private build", "Agency"). */
  label?: string
  accent: 'cyan' | 'violet' | 'magenta'
  year: string
}

export const projects: Project[] = [
  {
    title: 'Zinodesk',
    blurb:
      'An AI chatbot you can drop into any website with a single line of code — then customize endlessly to match your brand, voice, and knowledge base.',
    tags: ['AI', 'Chatbot', 'SaaS', 'Embed'],
    live: 'https://zinodesk.com',
    accent: 'cyan',
    year: '2025',
  },
  {
    title: 'AgentFlow',
    blurb:
      'Automates customer conversations on Facebook — replying, routing, and handling inbound messages so pages keep up without a human on every chat.',
    tags: ['AI', 'Automation', 'Messenger', 'Bots'],
    label: 'Private build',
    accent: 'violet',
    year: '2025',
  },
  {
    title: 'ATI EMR',
    blurb:
      'A fully offline, multi-device electronic medical records system for hospitals and clinics — patient records that sync across devices with zero dependence on the internet.',
    tags: ['Healthcare', 'Offline-First', 'Multi-device', 'EMR'],
    label: 'Product',
    accent: 'magenta',
    year: '2025',
  },
  {
    title: 'SNS Digital',
    blurb:
      'My IT agency — where I take products from idea to launch for clients, spanning web, mobile, and everything in between.',
    tags: ['Agency', 'Web', 'Mobile', 'Consulting'],
    label: 'Agency',
    accent: 'cyan',
    year: '2024',
  },
  {
    title: 'Ushuttle',
    blurb:
      'A Flutter app for tracking university shuttle routes and timings — helping students catch the right ride without the guesswork.',
    tags: ['Flutter', 'Dart', 'Maps', 'Realtime'],
    repo: 'https://github.com/shakil2995/Ushuttle',
    accent: 'violet',
    year: '2024',
  },
  {
    title: 'Tent USA',
    blurb:
      'A JavaScript web build for a business-facing site — marketing pages and interactions wired up front to back.',
    tags: ['JavaScript', 'Web', 'Frontend'],
    repo: 'https://github.com/shakil2995/tent-usa-web',
    accent: 'magenta',
    year: '2025',
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
      'Leading a team and shipping production software — while building my own products on the side: Zinodesk, ATI EMR, and SNS Digital.',
    accent: 'cyan',
  },
  {
    when: '2024 — 2025',
    title: 'Mobile App Developer',
    place: 'ATI Limited',
    detail:
      'Built cross-platform mobile apps with Flutter, taking features from design through to release.',
    accent: 'violet',
  },
  {
    when: '2023 — 2024',
    title: 'Junior Software Engineer',
    place: 'Winning bees',
    detail:
      'Worked across the stack on web products, growing from fundamentals into shipping real features for users.',
    accent: 'magenta',
  },
  {
    when: '2023',
    title: 'Intern Software Engineer',
    place: 'Excellent Soft',
    detail:
      'My first professional role — a three-month internship where classroom theory met a real codebase.',
    accent: 'cyan',
  },
  {
    when: 'Graduation',
    title: 'B.Sc. in Computer Science & Engineering',
    place: 'Independent University, Bangladesh (IUB)',
    detail:
      'Earned my CSE degree, building the foundations in algorithms, systems, and software design that everything since stands on.',
    accent: 'violet',
  },
]
