import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const skills = [
  'TypeScript',
  'JavaScript',
  'Node.js',
  'NestJS',
  'React',
  'Angular',
  'Next.js',
  'GraphQL',
  'REST API',
  'OpenAPI',
  'WebSocket',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Docker',
  'Git',
  'CI/CD',
  'Nx',
  'RxJS',
  'NgRx',
  'TanStack Query',
  'Python',
  'LLM',
  'AI Agents',
  'MCP',
  'RAG',
  'System Design',
  'Distributed Systems',
  'Performance Optimization',
];

const experiences = [
  [
    'BETCITY',
    'Tech Lead Frontend',
    '2024-08-01',
    '2026-06-01',
    'Led frontend engineering for a high-load B2C betting platform across several markets and three product streams with 16 frontend developers. Designed Angular, TypeScript and Nx architecture with typed contracts, explicit application boundaries, REST, WebSocket, OpenAPI, SSR, Web Vitals and Sentry. Improved delivery flow and reduced lead time by approximately 70%.',
  ],
  [
    'Just AI',
    'Tech Lead',
    '2023-08-01',
    '2024-07-01',
    'Built the first production version of Jay Flow with React, TypeScript, React Flow, Node.js and NestJS. Designed REST and OpenAPI APIs, integrated MongoDB, PostgreSQL, Redis, BullMQ, S3, LLMs, RAG and AI-agent workflows. Improved UI performance by approximately 60% and formed the development team after launch.',
  ],
  [
    'Lootie',
    'Tech Lead',
    '2020-07-01',
    '2024-01-01',
    'Led frontend development of a high-load B2C platform. Performed a gradual Angular to React and Next.js migration, worked with SSR, SSG, TanStack Query, Zustand, OpenAPI and Feature-Sliced Design. Reached Lighthouse Performance Score 98 for key pages and improved loading time by approximately 20-80%.',
  ],
  [
    'Blockchain Liquidity Platform',
    'Lead Frontend Developer',
    '2023-03-01',
    '2023-06-01',
    'Developed a DeFi frontend in React and TypeScript for concentrated liquidity management with leverage on Avalanche. Designed frontend architecture and integrated smart contracts, wallets, external DeFi protocols and on-chain state.',
  ],
  [
    'Orion Protocol',
    'Lead Frontend Developer',
    '2022-07-01',
    '2023-05-01',
    'Developed a DeFi trading platform frontend with React and TypeScript. Implemented market data, order book, order management, swaps, liquidity pools and governance interfaces using WebSocket, REST APIs, SDKs, smart contracts and wallets.',
  ],
  [
    'Частная практика / проектная работа',
    'Fullstack Developer / Architect',
    '2015-01-01',
    '2021-10-01',
    'Designed and developed an information system for cataloguing, storing and researching oriental manuscripts. Implemented the full stack, Node.js, TypeScript, Express, GraphQL, Apollo Server, TypeGraphQL, MongoDB, Angular, NgRx and Apollo Client.',
  ],
] as const;

const nikitaSkills = [
  'Python',
  'Go',
  'TypeScript',
  'PostgreSQL',
  'Kafka',
  'Docker',
  'Kubernetes',
  'CI/CD',
  'React Native',
  'AI Agents',
  'RAG',
  'LangChain',
  'Prompt Engineering',
  'Distributed Systems',
  'System Design',
  'High-load Systems',
  'AI Strategy',
  'Digital Transformation',
] as const;

const nikitaExperiences = [
  [
    'TRIBES / 3BS',
    'Founder / Head of AI Product',
    '2019-04-01',
    null,
    'Built COSMOS, an AI operations platform for controlled delegation of business tasks to AI agents with approvals, task queues, usage and cost tracking, action logs and result verification. Modernized business systems by connecting analytics, ERP, accounting, reporting, CRM, localization and marketplace automation. Reduced manual work by 60% and creative production costs by 70%.',
  ],
  [
    'StudyFree LLC',
    'CTO, Turnaround Engagement',
    '2022-07-01',
    '2023-02-01',
    'Rebuilt product and infrastructure, restored the platform and launched React Native mobile applications with subscription monetization. Improved delivery speed by approximately 30% through stronger CI/CD and fault-tolerant Go, Kafka, ELK and Docker-based services.',
  ],
  [
    'OnlinePay Ltd',
    'Interim CTO',
    '2017-11-01',
    '2018-03-01',
    'Launched an international payment gateway with PCI-DSS aligned architecture and multi-currency payment flows. Led distributed teams, reached 99.9% operational uptime and reduced fraud incidents by approximately 60%.',
  ],
  [
    'Yacademy',
    'Chief Technology Officer',
    '2017-02-01',
    '2017-11-01',
    'Built an AI-powered edtech platform with facial-recognition proctoring, anti-fraud checks, real-time scoring and public APIs using Angular, TypeScript and PostgreSQL.',
  ],
  [
    'Zeemi TV',
    'Chief Technology Officer',
    '2015-09-01',
    '2016-11-01',
    'Led a high-load media platform and local Indonesian engineering team. Migrated core services from Ruby to Go for approximately 5x performance improvement and reduced infrastructure costs by approximately 40%.',
  ],
  [
    'Early Career',
    'Technical, Product and Finance Roles',
    '2005-01-01',
    '2015-12-31',
    'Worked on scalable Node.js backend and mobile products, trade finance automation, SWIFT integrations, enterprise IT, systems integration, network infrastructure and IT operations management.',
  ],
] as const;

async function main(): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.upsert({
      where: { slug: 'demid-nikitin' },
      update: {
        name: 'Демид Никитин',
        description:
          'Tech Lead, Fullstack Engineer and Software Architect with more than 24 years of experience building production systems, AI products and agent-based platforms.',
      },
      create: {
        slug: 'demid-nikitin',
        name: 'Демид Никитин',
        description:
          'Tech Lead, Fullstack Engineer and Software Architect with more than 24 years of experience building production systems, AI products and agent-based platforms.',
      },
    });

    await tx.profileLink.deleteMany({ where: { profileId: profile.id } });
    await tx.experience.deleteMany({ where: { profileId: profile.id } });
    await tx.project.deleteMany({ where: { profileId: profile.id } });
    await tx.profileSkill.deleteMany({ where: { profileId: profile.id } });

    await tx.profileLink.create({
      data: { profileId: profile.id, type: 'github', url: 'https://github.com/demidn/visdemo' },
    });
    await tx.profileLink.create({
      data: { profileId: profile.id, type: 'linkedin', url: 'https://www.linkedin.com/in/demid-nikitin/' },
    });

    await tx.experience.createMany({
      data: experiences.map(([company, position, startDate, endDate, achievements]) => ({
        profileId: profile.id,
        company,
        position,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        achievements,
      })),
    });

    await tx.project.createMany({
      data: [
        { profileId: profile.id, name: 'Jay Flow', url: 'https://jayflow.ai' },
        { profileId: profile.id, name: 'Infinite Gomoku RL Environment & AI Evaluation Framework', url: '' },
      ],
    });

    for (const name of skills) {
      const skill = await tx.skill.upsert({ where: { name }, update: {}, create: { name } });
      await tx.profileSkill.create({ data: { profileId: profile.id, skillId: skill.id } });
    }
  });

  await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.upsert({
      where: { slug: 'nikita-krasnov' },
      update: {
        name: 'Никита Краснов',
        description:
          'CTO, Head of AI and AI Operations Platform Architect with 17+ years of experience across e-commerce, fintech, edtech, media and finance. Builds AI-powered operational systems with Python, Go, TypeScript, LLM agents, RAG and distributed systems.',
      },
      create: {
        slug: 'nikita-krasnov',
        name: 'Никита Краснов',
        description:
          'CTO, Head of AI and AI Operations Platform Architect with 17+ years of experience across e-commerce, fintech, edtech, media and finance. Builds AI-powered operational systems with Python, Go, TypeScript, LLM agents, RAG and distributed systems.',
      },
    });

    await tx.profileLink.deleteMany({ where: { profileId: profile.id } });
    await tx.experience.deleteMany({ where: { profileId: profile.id } });
    await tx.project.deleteMany({ where: { profileId: profile.id } });
    await tx.profileSkill.deleteMany({ where: { profileId: profile.id } });

    await tx.experience.createMany({
      data: nikitaExperiences.map(([company, position, startDate, endDate, achievements]) => ({
        profileId: profile.id,
        company,
        position,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        achievements,
      })),
    });

    await tx.project.createMany({
      data: [
        { profileId: profile.id, name: 'COSMOS AI Operations Platform', url: '' },
        { profileId: profile.id, name: 'Marketplace Intelligence', url: '' },
        { profileId: profile.id, name: 'ERP and Financial Automation', url: '' },
        { profileId: profile.id, name: 'Generative Commerce Engine', url: '' },
      ],
    });

    for (const name of nikitaSkills) {
      const skill = await tx.skill.upsert({ where: { name }, update: {}, create: { name } });
      await tx.profileSkill.create({ data: { profileId: profile.id, skillId: skill.id } });
    }
  });
}

await main().finally(() => prisma.$disconnect());
