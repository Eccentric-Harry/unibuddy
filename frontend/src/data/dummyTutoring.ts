import type { TutoringListing } from '../types/tutoring';

export const dummyTutoringListings: TutoringListing[] = [
  {
    id: 'tutor-1',
    title: 'Python Programming & Data Structures',
    description: 'Expert Python tutor with experience in teaching data structures and algorithms. I can help you ace your CS courses!',
    hourlyRate: 250.00,
    subjects: [
      {
        id: 'python',
        name: 'Python',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
      },
      {
        id: 'dsa',
        name: 'Data Structures',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
      }
    ],
    syllabus: [
      'Python Basics & Syntax',
      'Object-Oriented Programming',
      'Data Structures (Lists, Dictionaries, Sets)',
      'Algorithm Analysis',
      'Problem Solving Techniques'
    ],
    availability: [
      'Monday: 2 PM - 6 PM',
      'Wednesday: 3 PM - 7 PM',
      'Saturday: 10 AM - 4 PM'
    ],
    status: 'ACTIVE',
    tutor: {
      id: 'tutor-1',
      name: 'Alex Chen',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      year: 4,
      collegeName: 'Sample University',
      major: 'Computer Science',
      rating: 4.8,
      totalReviews: 45
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tutor-2',
    title: 'Calculus & Linear Algebra',
    description: 'Mathematics major offering comprehensive tutoring in Calculus I, II, and Linear Algebra. Clear explanations and practice problems provided.',
    hourlyRate: 300.00,
    subjects: [
      {
        id: 'calculus',
        name: 'Calculus',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968282.png'
      },
      {
        id: 'linear-algebra',
        name: 'Linear Algebra',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/7968/7968886.png'
      }
    ],
    syllabus: [
      'Limits and Continuity',
      'Derivatives and Applications',
      'Integration Techniques',
      'Vector Spaces',
      'Matrix Operations',
      'Eigenvalues and Eigenvectors'
    ],
    availability: [
      'Tuesday: 1 PM - 5 PM',
      'Thursday: 2 PM - 6 PM',
      'Friday: 10 AM - 2 PM'
    ],
    status: 'ACTIVE',
    tutor: {
      id: 'tutor-2',
      name: 'Sarah Williams',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      year: 3,
      collegeName: 'Sample University',
      major: 'Mathematics',
      rating: 4.9,
      totalReviews: 32
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tutor-3',
    title: 'Chemistry & Organic Chemistry',
    description: 'Experienced chemistry tutor helping students understand complex concepts. Specializing in general and organic chemistry.',
    hourlyRate: 280.00,
    subjects: [
      {
        id: 'chemistry',
        name: 'Chemistry',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048888.png'
      },
      {
        id: 'organic-chemistry',
        name: 'Organic Chemistry',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048966.png'
      }
    ],
    syllabus: [
      'Chemical Bonding',
      'Stoichiometry',
      'Acid-Base Chemistry',
      'Organic Compounds',
      'Reaction Mechanisms',
      'Spectroscopy'
    ],
    availability: [
      'Monday: 9 AM - 1 PM',
      'Wednesday: 2 PM - 6 PM',
      'Thursday: 3 PM - 7 PM'
    ],
    status: 'ACTIVE',
    tutor: {
      id: 'tutor-3',
      name: 'Emily Rodriguez',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      year: 4,
      collegeName: 'Sample University',
      major: 'Chemistry',
      rating: 4.7,
      totalReviews: 28
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tutor-4',
    title: 'Web Development (React & Node.js)',
    description: 'Full-stack developer offering tutoring in modern web development. Learn to build responsive and scalable web applications.',
    hourlyRate: 350.00,
    subjects: [
      {
        id: 'react',
        name: 'React',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
      },
      {
        id: 'nodejs',
        name: 'Node.js',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
      }
    ],
    syllabus: [
      'React Fundamentals',
      'Component Architecture',
      'State Management',
      'Node.js & Express',
      'RESTful APIs',
      'Database Integration'
    ],
    availability: [
      'Tuesday: 4 PM - 8 PM',
      'Thursday: 4 PM - 8 PM',
      'Saturday: 1 PM - 5 PM'
    ],
    status: 'ACTIVE',
    tutor: {
      id: 'tutor-4',
      name: 'David Park',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      year: 4,
      collegeName: 'Sample University',
      major: 'Computer Science',
      rating: 4.9,
      totalReviews: 37
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];
