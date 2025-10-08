import type { JobPosting } from '../types/jobs';

export const dummyJobs: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Software Engineering Intern',
    company: {
      id: 'company-1',
      name: 'Google',
      logo: 'https://logo.clearbit.com/google.com',
      website: 'https://careers.google.com'
    },
    location: 'Mountain View, CA',
    locationType: 'Hybrid',
    jobType: 'Internship',
    description: 'Join Google as a Software Engineering Intern and work on cutting-edge projects that impact billions of users. You\'ll collaborate with experienced engineers and contribute to real products.',
    requirements: [
      'Currently pursuing a Bachelor\'s or Master\'s degree in Computer Science or related field',
      'Strong foundation in data structures and algorithms',
      'Experience with one or more programming languages (Java, C++, Python)',
      'Good problem-solving skills',
      'Available for 12-week summer internship'
    ],
    responsibilities: [
      'Design and implement software solutions',
      'Write clean, maintainable code',
      'Participate in code reviews',
      'Collaborate with cross-functional teams',
      'Debug and optimize existing systems'
    ],
    skills: ['Java', 'Python', 'Data Structures', 'Algorithms', 'Problem Solving'],
    salary: {
      min: 7000,
      max: 9000,
      currency: 'USD',
      period: 'monthly'
    },
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      id: 'recruiter-1',
      name: 'Sarah Chen',
      role: 'Tech Recruiter'
    },
    applicationUrl: 'https://careers.google.com/apply',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-2',
    title: 'Frontend Developer',
    company: {
      id: 'company-2',
      name: 'Meta',
      logo: 'https://logo.clearbit.com/meta.com',
      website: 'https://www.metacareers.com'
    },
    location: 'Menlo Park, CA',
    locationType: 'On-site',
    jobType: 'Full-time',
    description: 'Build the future of social technology at Meta. We\'re looking for talented frontend developers to create exceptional user experiences across our family of apps.',
    requirements: [
      'Bachelor\'s degree in Computer Science or equivalent experience',
      '2+ years of experience with React.js',
      'Strong understanding of JavaScript, HTML, and CSS',
      'Experience with modern frontend build tools',
      'Knowledge of responsive design principles'
    ],
    responsibilities: [
      'Develop new user-facing features using React.js',
      'Build reusable components and libraries',
      'Optimize applications for maximum speed and scalability',
      'Collaborate with designers and backend engineers',
      'Ensure technical feasibility of UI/UX designs'
    ],
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Redux'],
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD',
      period: 'yearly'
    },
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      id: 'recruiter-2',
      name: 'Michael Rodriguez',
      role: 'Engineering Recruiter'
    },
    applicationUrl: 'https://www.metacareers.com/apply',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-3',
    title: 'Machine Learning Engineer Intern',
    company: {
      id: 'company-3',
      name: 'Microsoft',
      logo: 'https://logo.clearbit.com/microsoft.com',
      website: 'https://careers.microsoft.com'
    },
    location: 'Redmond, WA',
    locationType: 'Hybrid',
    jobType: 'Internship',
    description: 'Work on cutting-edge AI and machine learning projects at Microsoft. Help build intelligent systems that empower every person and organization on the planet.',
    requirements: [
      'Pursuing MS/PhD in Computer Science, Machine Learning, or related field',
      'Strong foundation in machine learning algorithms',
      'Experience with Python and ML frameworks (TensorFlow, PyTorch)',
      'Understanding of neural networks and deep learning',
      'Research experience preferred'
    ],
    responsibilities: [
      'Develop and train machine learning models',
      'Conduct experiments and analyze results',
      'Collaborate with research scientists',
      'Implement ML algorithms for production systems',
      'Document research findings and methodologies'
    ],
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP'],
    salary: {
      min: 8000,
      max: 10000,
      currency: 'USD',
      period: 'monthly'
    },
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      id: 'recruiter-3',
      name: 'Emily Johnson',
      role: 'AI/ML Recruiter'
    },
    applicationUrl: 'https://careers.microsoft.com/apply',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-4',
    title: 'Backend Developer - Java/Spring',
    company: {
      id: 'company-4',
      name: 'Amazon',
      logo: 'https://logo.clearbit.com/amazon.com',
      website: 'https://www.amazon.jobs'
    },
    location: 'Seattle, WA',
    locationType: 'On-site',
    jobType: 'Full-time',
    description: 'Join Amazon Web Services and build scalable backend systems that power the world\'s most customer-centric company. Work with distributed systems at massive scale.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of experience with Java and Spring Framework',
      'Strong knowledge of RESTful APIs and microservices',
      'Experience with SQL and NoSQL databases',
      'Understanding of cloud platforms (AWS preferred)'
    ],
    responsibilities: [
      'Design and develop scalable backend services',
      'Build and maintain RESTful APIs',
      'Optimize database queries and system performance',
      'Implement security best practices',
      'Participate in on-call rotation'
    ],
    skills: ['Java', 'Spring Boot', 'AWS', 'MySQL', 'Docker', 'Kubernetes', 'Microservices'],
    salary: {
      min: 130000,
      max: 190000,
      currency: 'USD',
      period: 'yearly'
    },
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      id: 'recruiter-4',
      name: 'David Park',
      role: 'Senior Technical Recruiter'
    },
    applicationUrl: 'https://www.amazon.jobs/apply',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-5',
    title: 'Full Stack Developer',
    company: {
      id: 'company-5',
      name: 'Stripe',
      logo: 'https://logo.clearbit.com/stripe.com',
      website: 'https://stripe.com/jobs'
    },
    location: 'San Francisco, CA',
    locationType: 'Hybrid',
    jobType: 'Full-time',
    description: 'Help us build the economic infrastructure for the internet. Work on products that process billions of dollars for millions of businesses worldwide.',
    requirements: [
      'Bachelor\'s degree in Computer Science or equivalent',
      'Experience with modern web frameworks (React, Node.js)',
      'Strong understanding of both frontend and backend development',
      'Knowledge of payment systems is a plus',
      'Excellent communication skills'
    ],
    responsibilities: [
      'Build end-to-end features across the stack',
      'Design and implement APIs',
      'Create intuitive user interfaces',
      'Write comprehensive tests',
      'Collaborate with product and design teams'
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'REST APIs'],
    salary: {
      min: 140000,
      max: 200000,
      currency: 'USD',
      period: 'yearly'
    },
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      id: 'recruiter-5',
      name: 'Jessica Lee',
      role: 'Engineering Recruiter'
    },
    applicationUrl: 'https://stripe.com/jobs/apply',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-6',
    title: 'Mobile App Developer - iOS',
    company: {
      id: 'company-6',
      name: 'Apple',
      logo: 'https://logo.clearbit.com/apple.com',
      website: 'https://jobs.apple.com'
    },
    location: 'Cupertino, CA',
    locationType: 'On-site',
    jobType: 'Full-time',
    description: 'Create amazing experiences for millions of iOS users. Work with the latest Apple technologies and contribute to apps that define the mobile experience.',
    requirements: [
      'Bachelor\'s degree in Computer Science',
      'Strong proficiency in Swift and SwiftUI',
      'Experience with iOS SDK and frameworks',
      'Published apps on the App Store preferred',
      'Understanding of Apple\'s Human Interface Guidelines'
    ],
    responsibilities: [
      'Develop and maintain iOS applications',
      'Implement new features and improvements',
      'Optimize app performance and user experience',
      'Debug and fix app issues',
      'Collaborate with designers and product managers'
    ],
    skills: ['Swift', 'SwiftUI', 'iOS', 'Xcode', 'UIKit', 'Core Data'],
    salary: {
      min: 135000,
      max: 195000,
      currency: 'USD',
      period: 'yearly'
    },
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      id: 'recruiter-6',
      name: 'Alex Thompson',
      role: 'iOS Recruiter'
    },
    applicationUrl: 'https://jobs.apple.com/apply',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-7',
    title: 'DevOps Engineer',
    company: {
      id: 'company-7',
      name: 'Netflix',
      logo: 'https://logo.clearbit.com/netflix.com',
      website: 'https://jobs.netflix.com'
    },
    location: 'Los Gatos, CA',
    locationType: 'Remote',
    jobType: 'Full-time',
    description: 'Help Netflix deliver streaming content to 200+ million members worldwide. Build and maintain the infrastructure that powers entertainment for the planet.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '2+ years of DevOps/SRE experience',
      'Strong knowledge of cloud platforms (AWS, GCP)',
      'Experience with containerization and orchestration',
      'Proficiency in scripting languages (Python, Bash)'
    ],
    responsibilities: [
      'Build and maintain CI/CD pipelines',
      'Manage cloud infrastructure and services',
      'Implement monitoring and alerting systems',
      'Automate deployment processes',
      'Ensure system reliability and performance'
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Python', 'Terraform', 'Monitoring'],
    salary: {
      min: 150000,
      max: 220000,
      currency: 'USD',
      period: 'yearly'
    },
    applicationDeadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      id: 'recruiter-7',
      name: 'Rachel Green',
      role: 'Infrastructure Recruiter'
    },
    applicationUrl: 'https://jobs.netflix.com/apply',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-8',
    title: 'Data Science Intern',
    company: {
      id: 'company-8',
      name: 'Airbnb',
      logo: 'https://logo.clearbit.com/airbnb.com',
      website: 'https://careers.airbnb.com'
    },
    location: 'San Francisco, CA',
    locationType: 'Hybrid',
    jobType: 'Internship',
    description: 'Join Airbnb\'s data science team and work on projects that help millions of hosts and travelers. Use data to drive product decisions and improve user experiences.',
    requirements: [
      'Pursuing degree in Data Science, Statistics, or Computer Science',
      'Strong foundation in statistics and probability',
      'Experience with Python and data analysis libraries',
      'Knowledge of SQL and data visualization tools',
      'Excellent analytical and problem-solving skills'
    ],
    responsibilities: [
      'Analyze large datasets to extract insights',
      'Build predictive models and algorithms',
      'Create data visualizations and dashboards',
      'Collaborate with product and engineering teams',
      'Present findings to stakeholders'
    ],
    skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Tableau', 'Statistical Analysis', 'R'],
    salary: {
      min: 6500,
      max: 8500,
      currency: 'USD',
      period: 'monthly'
    },
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      id: 'recruiter-8',
      name: 'Tom Wilson',
      role: 'Data Science Recruiter'
    },
    applicationUrl: 'https://careers.airbnb.com/apply',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-9',
    title: 'Cybersecurity Engineer',
    company: {
      id: 'company-9',
      name: 'Cloudflare',
      logo: 'https://logo.clearbit.com/cloudflare.com',
      website: 'https://www.cloudflare.com/careers'
    },
    location: 'Austin, TX',
    locationType: 'Remote',
    jobType: 'Full-time',
    description: 'Help build a better Internet by securing and optimizing the performance of websites, APIs, and applications. Work on security challenges at massive scale.',
    requirements: [
      'Bachelor\'s degree in Computer Science or Cybersecurity',
      'Strong understanding of network security principles',
      'Experience with security tools and frameworks',
      'Knowledge of common vulnerabilities and attacks',
      'Security certifications (CISSP, CEH) preferred'
    ],
    responsibilities: [
      'Monitor and respond to security incidents',
      'Conduct security assessments and penetration testing',
      'Implement security controls and policies',
      'Analyze security threats and vulnerabilities',
      'Develop security automation tools'
    ],
    skills: ['Network Security', 'Penetration Testing', 'Python', 'Linux', 'SIEM', 'Firewalls'],
    salary: {
      min: 125000,
      max: 175000,
      currency: 'USD',
      period: 'yearly'
    },
    applicationDeadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      id: 'recruiter-9',
      name: 'Olivia Martinez',
      role: 'Security Recruiter'
    },
    applicationUrl: 'https://www.cloudflare.com/careers/apply',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-10',
    title: 'Software Development Engineer - Part Time',
    company: {
      id: 'company-10',
      name: 'Uber',
      logo: 'https://logo.clearbit.com/uber.com',
      website: 'https://www.uber.com/careers'
    },
    location: 'San Francisco, CA',
    locationType: 'Hybrid',
    jobType: 'Part-time',
    description: 'Work on innovative transportation solutions while balancing your studies. Perfect for students looking to gain real-world experience in a fast-paced environment.',
    requirements: [
      'Currently enrolled in Computer Science program',
      'Basic programming skills in any language',
      'Understanding of object-oriented programming',
      'Ability to work 20 hours per week',
      'Strong desire to learn and grow'
    ],
    responsibilities: [
      'Contribute to feature development',
      'Write clean and tested code',
      'Participate in code reviews',
      'Fix bugs and improve system stability',
      'Learn from senior engineers'
    ],
    skills: ['Java', 'Python', 'Git', 'Problem Solving', 'Agile'],
    salary: {
      min: 35,
      max: 45,
      currency: 'USD',
      period: 'hourly'
    },
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      id: 'recruiter-10',
      name: 'Chris Anderson',
      role: 'Campus Recruiter'
    },
    applicationUrl: 'https://www.uber.com/careers/apply',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-11',
    title: 'Cloud Solutions Architect',
    company: {
      id: 'company-11',
      name: 'Salesforce',
      logo: 'https://logo.clearbit.com/salesforce.com',
      website: 'https://salesforce.wd1.myworkdayjobs.com'
    },
    location: 'New York, NY',
    locationType: 'Hybrid',
    jobType: 'Full-time',
    description: 'Design and implement cloud solutions for enterprise customers. Help businesses transform their operations using Salesforce technologies.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of experience with cloud platforms',
      'Strong knowledge of system architecture patterns',
      'Experience with Salesforce platform preferred',
      'Excellent client-facing skills'
    ],
    responsibilities: [
      'Design scalable cloud architectures',
      'Provide technical guidance to customers',
      'Conduct solution workshops and presentations',
      'Create technical documentation',
      'Collaborate with sales and engineering teams'
    ],
    skills: ['Cloud Architecture', 'Salesforce', 'AWS', 'Solution Design', 'APIs', 'Integration'],
    salary: {
      min: 145000,
      max: 205000,
      currency: 'USD',
      period: 'yearly'
    },
    applicationDeadline: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      id: 'recruiter-11',
      name: 'Amy Zhang',
      role: 'Cloud Recruiter'
    },
    applicationUrl: 'https://salesforce.wd1.myworkdayjobs.com/apply',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-12',
    title: 'Game Developer - Unity',
    company: {
      id: 'company-12',
      name: 'Riot Games',
      logo: 'https://logo.clearbit.com/riotgames.com',
      website: 'https://www.riotgames.com/careers'
    },
    location: 'Los Angeles, CA',
    locationType: 'On-site',
    jobType: 'Full-time',
    description: 'Create unforgettable gaming experiences for players worldwide. Work on popular titles and new innovative game projects using Unity engine.',
    requirements: [
      'Bachelor\'s degree in Computer Science or Game Development',
      'Strong proficiency in C# and Unity',
      'Experience with game physics and mechanics',
      'Portfolio of game projects',
      'Passion for gaming and player experience'
    ],
    responsibilities: [
      'Develop game features and systems',
      'Optimize game performance',
      'Implement gameplay mechanics',
      'Collaborate with artists and designers',
      'Debug and fix gameplay issues'
    ],
    skills: ['Unity', 'C#', 'Game Development', '3D Math', 'Shaders', 'Optimization'],
    salary: {
      min: 110000,
      max: 165000,
      currency: 'USD',
      period: 'yearly'
    },
    applicationDeadline: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      id: 'recruiter-12',
      name: 'Jake Brown',
      role: 'Game Dev Recruiter'
    },
    applicationUrl: 'https://www.riotgames.com/careers/apply',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString()
  }
];

