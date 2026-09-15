import type { Application, Business, Shift, Student } from './types';

/**
 * DEMO DATA — every business, student, shift and rating below is fictional and
 * exists only to demonstrate the BackSoon flow. No real company, person, review
 * or partnership is represented here.
 */

/** the business you are logged in as in the demo */
export const DEMO_BUSINESS_ID = 'b1';
/** the student you are logged in as in the demo */
export const DEMO_STUDENT_ID = 's1';

export const BUSINESSES: Business[] = [
  {
    id: 'b1',
    name: 'Kávé & Kő',
    district: 'Budapest VII',
    category: 'Hospitality',
    verified: true,
    about: 'Neighbourhood café on Kazinczy street. Two full-time baristas, a rotating student team on evenings and weekends.',
  },
  { id: 'b2', name: 'Ramen Klub', district: 'Budapest VI', category: 'Hospitality', verified: true, about: 'Small ramen counter near the Opera.' },
  { id: 'b3', name: 'Könyvsarok', district: 'Budapest V', category: 'Retail', verified: true, about: 'Independent bookshop in the old town.' },
  { id: 'b4', name: 'Pék & Társa', district: 'Budapest V', category: 'Food & Beverage', verified: true, about: 'Family bakery, open from five in the morning.' },
  { id: 'b5', name: 'Duna Mozi', district: 'Budapest VIII', category: 'Events', verified: false, about: 'Two-screen cinema running weekly event nights.' },
  { id: 'b6', name: 'Váci Ruhabolt', district: 'Budapest V', category: 'Retail', verified: true, about: 'Clothing shop on the main shopping street.' },
];

export const SHIFTS: Shift[] = [
  {
    id: '1',
    title: 'Café Assistant',
    businessId: 'b1',
    business: 'Kávé & Kő',
    district: 'Budapest VII',
    date: '25 September 2026',
    time: '16:00–22:00',
    pay: 2500,
    status: 'open',
    category: 'Hospitality',
    skillTags: ['Customer Service', 'Barista', 'English'],
    postedLabel: '2 days ago',
    description:
      'We need an energetic assistant to help our team during busy evening hours. Tasks include taking orders, serving customers, and light cleaning.',
    requirements: ['Friendly attitude', 'Basic English or German', 'Standing for long periods', 'Previous café experience preferred'],
  },
  {
    id: '2',
    title: 'Waiter / Waitress',
    businessId: 'b2',
    business: 'Ramen Klub',
    district: 'Budapest VI',
    date: '28 September 2026',
    time: '11:00–17:00',
    pay: 2800,
    status: 'open',
    category: 'Hospitality',
    skillTags: ['Waitress', 'Customer Service', 'English'],
    postedLabel: '1 day ago',
    description:
      'Busy ramen restaurant needs a waiter for lunch service. You will take orders, serve food, and ensure a great customer experience.',
    requirements: ['Table service experience', 'English communication skills', 'Professional appearance'],
  },
  {
    id: '3',
    title: 'Cashier',
    businessId: 'b3',
    business: 'Könyvsarok',
    district: 'Budapest V',
    date: '1 October 2026',
    time: '09:00–13:00',
    pay: 2200,
    status: 'open',
    category: 'Retail',
    skillTags: ['Cashier', 'Customer Service'],
    postedLabel: '4 days ago',
    description:
      'Bookstore covering Saturday morning. Handling cash and card payments, assisting customers, and maintaining a tidy shop floor.',
    requirements: ['Basic numeracy', 'Attention to detail', 'Interest in books a plus'],
  },
  {
    id: '4',
    title: 'Bakery Assistant',
    businessId: 'b4',
    business: 'Pék & Társa',
    district: 'Budapest V',
    date: '3 October 2026',
    time: '06:00–10:00',
    pay: 2300,
    status: 'open',
    category: 'Food & Beverage',
    skillTags: ['Customer Service', 'Cashier'],
    postedLabel: '6 days ago',
    description:
      'Morning bakery shift. Preparing display cases, serving customers, packaging products, and keeping the area clean.',
    requirements: ['Early morning availability', 'Physical work involved', 'Food handling certificate helpful'],
  },
  {
    id: '5',
    title: 'Event Staff',
    businessId: 'b5',
    business: 'Duna Mozi',
    district: 'Budapest VIII',
    date: '4 October 2026',
    time: '18:00–23:00',
    pay: 2600,
    status: 'open',
    category: 'Events',
    skillTags: ['Event Staff', 'Customer Service', 'English'],
    postedLabel: '3 days ago',
    description:
      'Cinema event night requires additional staff for ticket checking, ushering, and concession sales.',
    requirements: ['Customer-facing confidence', 'Ability to work evenings'],
  },
  {
    id: '6',
    title: 'Stock Room Assistant',
    businessId: 'b6',
    business: 'Váci Ruhabolt',
    district: 'Budapest V',
    date: '6 October 2026',
    time: '08:00–16:00',
    pay: 2400,
    status: 'open',
    category: 'Retail',
    skillTags: ['Stock Management', 'Cashier'],
    postedLabel: '1 week ago',
    description:
      'Full day in the stock room: receiving deliveries, organizing inventory, and restocking floor displays.',
    requirements: ['Physical fitness', 'Organised mindset', 'Able to lift 15kg'],
  },
  {
    id: '7',
    title: 'Weekend Barista',
    businessId: 'b1',
    business: 'Kávé & Kő',
    district: 'Budapest VII',
    date: '29 September 2026',
    time: '10:00–16:00',
    pay: 2500,
    status: 'open',
    category: 'Hospitality',
    skillTags: ['Barista', 'Customer Service'],
    postedLabel: '5 days ago',
    description:
      'Saturday daytime cover on the coffee bar while our regular barista is away. Espresso machine training provided on arrival.',
    requirements: ['Weekend availability', 'Comfortable on an espresso machine', 'Friendly with regulars'],
  },
];

export const STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Anna Kovács',
    university: 'ELTE',
    faculty: 'Faculty of Economics',
    rating: 4.8,
    completedShifts: 12,
    skills: ['Customer Service', 'Cashier', 'English', 'German'],
    verified: true,
    avatar: 'AK',
    district: 'Budapest VII',
    bio: 'Economics student with 2 years of hospitality experience. Reliable, punctual, and great with customers.',
    availability: 'Weekends & evenings',
  },
  {
    id: 's2',
    name: 'Bence Horváth',
    university: 'BME',
    faculty: 'IT Management',
    rating: 4.6,
    completedShifts: 8,
    skills: ['Cashier', 'Stock Management', 'Forklift'],
    verified: true,
    avatar: 'BH',
    district: 'Budapest XI',
    bio: 'IT Management student. Detail-oriented and efficient. Previous experience in retail and logistics.',
    availability: 'Flexible — weekdays & weekends',
  },
  {
    id: 's3',
    name: 'Léa Szabó',
    university: 'BCE',
    faculty: 'Tourism & Catering',
    rating: 4.9,
    completedShifts: 20,
    skills: ['Waitress', 'Barista', 'English', 'French', 'Customer Service'],
    verified: true,
    avatar: 'LS',
    district: 'Budapest VII',
    bio: 'Tourism student with extensive hospitality experience. Has covered shifts for cafés and restaurants across the city.',
    availability: 'Evenings & weekends',
  },
  {
    id: 's4',
    name: 'Márk Tóth',
    university: 'ELTE',
    faculty: 'Communications',
    rating: 4.5,
    completedShifts: 5,
    skills: ['Customer Service', 'Event Staff', 'Social Media'],
    verified: false,
    avatar: 'MT',
    district: 'Budapest VIII',
    bio: 'Communications student looking for flexible work. Enthusiastic and quick to learn.',
    availability: 'Weekends only',
  },
  {
    id: 's5',
    name: 'Dóra Nagy',
    university: 'SZTE',
    faculty: 'Psychology',
    rating: 4.7,
    completedShifts: 9,
    skills: ['Barista', 'Customer Service', 'English'],
    verified: true,
    avatar: 'DN',
    district: 'Budapest VII',
    bio: 'Psychology student, three summers behind a coffee bar. Calm under pressure on busy evenings.',
    availability: 'Evenings & weekends',
  },
];

/** Seeded applications so the demo starts with a shift that already has candidates. */
export const APPLICATIONS: Application[] = [
  { id: 'a1', shiftId: '1', studentId: 's3', status: 'pending', appliedLabel: '1 day ago' },
  { id: 'a2', shiftId: '1', studentId: 's5', status: 'pending', appliedLabel: '20 hours ago' },
  { id: 'a3', shiftId: '1', studentId: 's4', status: 'pending', appliedLabel: '6 hours ago' },
  { id: 'a4', shiftId: '7', studentId: 's3', status: 'pending', appliedLabel: '2 days ago' },
  { id: 'a5', shiftId: '7', studentId: 's2', status: 'pending', appliedLabel: '1 day ago' },
  { id: 'a6', shiftId: '5', studentId: 's4', status: 'pending', appliedLabel: '3 hours ago' },
];

export const CATEGORY_SKILLS: Record<string, string[]> = {
  Hospitality: ['Customer Service', 'Waitress', 'Barista'],
  Retail: ['Cashier', 'Customer Service', 'Stock Management'],
  'Food & Beverage': ['Customer Service', 'Cashier'],
  Events: ['Event Staff', 'Customer Service'],
  Other: ['Customer Service'],
};
