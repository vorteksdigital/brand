export type ServicePage = {
  description: string
  eyebrow: string
  faqs: Array<{ answer: string; question: string }>
  heading: string
  intro: string
  name: string
  outcomes: string[]
  process: Array<{ body: string; title: string }>
  slug: string
  title: string
}

export const services: ServicePage[] = [
  {
    slug: 'web-design',
    name: 'Web design',
    eyebrow: 'Web design · Johannesburg',
    title: 'Web Design Johannesburg | Vorteks Digital',
    description:
      'Strategic, responsive web design in Johannesburg for South African startups and growing businesses. Clear structure, distinctive design and practical delivery.',
    heading: 'Web design that makes your business easier to understand and choose.',
    intro:
      'Vorteks Digital plans and designs focused websites for businesses that need more than a polished surface. We connect positioning, content, user journeys and visual direction so every page has a clear job.',
    outcomes: [
      'A clear website structure built around customer questions',
      'Responsive page designs for mobile, tablet and desktop',
      'A practical design system that keeps future pages consistent',
      'Developer-ready layouts, interactions and content guidance',
    ],
    process: [
      { title: 'Understand', body: 'We clarify the audience, offer, goals and constraints before proposing pages.' },
      { title: 'Structure', body: 'We map the content hierarchy and journeys that move visitors toward action.' },
      { title: 'Design', body: 'We establish a distinctive visual system and apply it across responsive screens.' },
      { title: 'Refine', body: 'We test clarity, accessibility and implementation details before development.' },
    ],
    faqs: [
      {
        question: 'How much does web design cost in Johannesburg?',
        answer:
          'Cost depends on page count, content readiness, interaction complexity and whether development is included. Vorteks Digital scopes the work before quoting so the price reflects the actual project.',
      },
      {
        question: 'Do you design for mobile devices?',
        answer:
          'Yes. Every interface is designed responsively for mobile, tablet and desktop, with accessibility and performance considered from the start.',
      },
      {
        question: 'Can you redesign an existing website?',
        answer:
          'Yes. We can assess the existing structure and content, retain what works and redesign the parts that are limiting clarity, usability or growth.',
      },
    ],
  },
  {
    slug: 'web-development',
    name: 'Web development',
    eyebrow: 'Web development · Johannesburg',
    title: 'Web Development Johannesburg | Vorteks Digital',
    description:
      'Modern web development in Johannesburg for fast, accessible and maintainable business websites and digital platforms. Built for South African teams.',
    heading: 'Fast, maintainable websites built around real business needs.',
    intro:
      'We develop responsive websites and web platforms with clean foundations, practical content management and measured performance. The technology follows the job rather than forcing every project into the same template.',
    outcomes: [
      'Responsive implementation across current browsers and devices',
      'Accessible interfaces and semantic, search-friendly content',
      'Content management that fits the people maintaining the site',
      'Deployment, analytics and technical handover prepared for launch',
    ],
    process: [
      { title: 'Scope', body: 'We define features, integrations, content responsibilities and acceptance criteria.' },
      { title: 'Build', body: 'We implement the approved system in testable stages with regular reviews.' },
      { title: 'Verify', body: 'We test responsive behavior, accessibility, performance and core user journeys.' },
      { title: 'Launch', body: 'We deploy, monitor and hand over the tools and documentation your team needs.' },
    ],
    faqs: [
      {
        question: 'What kinds of websites do you develop?',
        answer:
          'We build marketing sites, content-led websites, portfolios, campaign experiences and bespoke web platforms for startups and growing organisations.',
      },
      {
        question: 'Will the website be easy to update?',
        answer:
          'Where content changes regularly, we provide a suitable CMS and shape the editing experience around the team that will use it.',
      },
      {
        question: 'Do you provide support after launch?',
        answer:
          'Yes. Ongoing maintenance and improvement can be included as a defined support plan after launch.',
      },
    ],
  },
  {
    slug: 'wordpress-development',
    name: 'WordPress development',
    eyebrow: 'WordPress · South Africa',
    title: 'WordPress Development South Africa | Vorteks Digital',
    description:
      'Custom WordPress development for South African businesses that need flexible editing, responsive performance and dependable ongoing support.',
    heading: 'WordPress built for your content, team and growth plans.',
    intro:
      'Vorteks Digital creates and improves WordPress websites without treating the platform as a pile of generic plugins. We shape the editing experience, templates and integrations around what your team actually needs to publish and maintain.',
    outcomes: [
      'Custom page templates aligned with your brand and content',
      'A clear editing experience for day-to-day publishing',
      'Careful plugin selection and reduced maintenance overhead',
      'Performance, security and update planning for ongoing operation',
    ],
    process: [
      { title: 'Audit', body: 'For existing sites, we review the theme, plugins, hosting and content risks.' },
      { title: 'Plan', body: 'We define templates, fields, integrations and editor workflows before building.' },
      { title: 'Develop', body: 'We create the theme and functionality with reusable, documented patterns.' },
      { title: 'Support', body: 'We can manage updates, backups, monitoring and planned improvements.' },
    ],
    faqs: [
      {
        question: 'Can you improve an existing WordPress website?',
        answer:
          'Yes. We can audit and improve an existing site, rebuild its theme, reduce unnecessary plugins or plan a controlled migration.',
      },
      {
        question: 'Do you use page builders?',
        answer:
          'The choice depends on the project and the editor. We prefer the simplest maintainable setup that gives your team the control it genuinely needs.',
      },
      {
        question: 'Can you maintain the site after launch?',
        answer:
          'Yes. Maintenance can cover updates, backups, uptime checks, security reviews and an agreed allowance for content or feature changes.',
      },
    ],
  },
  {
    slug: 'digital-products',
    name: 'Digital products',
    eyebrow: 'Digital products · Johannesburg',
    title: 'Digital Product Development Johannesburg | Vorteks Digital',
    description:
      'Digital product strategy, UX design and development in Johannesburg for startups and teams turning complex ideas into useful web products.',
    heading: 'Turn a product idea into a useful, testable digital experience.',
    intro:
      'We help teams define and deliver web-based products, portals and bespoke digital tools. Strategy, interface design and development stay connected so product decisions remain grounded in user needs and technical reality.',
    outcomes: [
      'A prioritised product scope tied to a clear user problem',
      'User flows and interface prototypes for early validation',
      'A maintainable technical foundation for phased delivery',
      'A launch plan with measurement and iteration built in',
    ],
    process: [
      { title: 'Define', body: 'We clarify the problem, audience, constraints and evidence behind the opportunity.' },
      { title: 'Prototype', body: 'We turn the core journey into a testable interface before committing to a full build.' },
      { title: 'Deliver', body: 'We develop the prioritised product in focused stages with working reviews.' },
      { title: 'Improve', body: 'After launch, we use feedback and product data to guide the next useful change.' },
    ],
    faqs: [
      {
        question: 'Can you help define an early-stage product?',
        answer:
          'Yes. We can help reduce a broad idea to a focused first release with clear users, journeys, requirements and priorities.',
      },
      {
        question: 'Do you design and develop the product?',
        answer:
          'Yes. Keeping strategy, UX design and development connected reduces hand-offs and helps the team make realistic product decisions.',
      },
      {
        question: 'Can the product be delivered in phases?',
        answer:
          'Yes. Phased delivery is often the safest way to validate the highest-risk assumptions before expanding the product.',
      },
    ],
  },
]

export const getService = (slug: string) => services.find((service) => service.slug === slug)
