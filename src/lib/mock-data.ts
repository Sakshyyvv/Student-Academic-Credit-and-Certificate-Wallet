import { User, Certificate, CampusActivity } from './types';

export const MOCK_STUDENTS: User[] = [
  {
    id: 'student-1',
    name: 'Shourya Dubey',
    email: 'shourya@mits.edu',
    role: 'student',
    interests: ['Machine Learning', 'Web Development', 'Public Speaking'],
    rollNumber: '0901CS231129',
    semesterAcademicCredits: [
      { semester: 'Semester I', credits: 20 },
      { semester: 'Semester II', credits: 22 },
      { semester: 'Semester III', credits: 21 },
      { semester: 'Semester IV', credits: 23 },
      { semester: 'Semester V', credits: 20 },
      { semester: 'Semester VI', credits: 22 },
      { semester: 'Semester VII', credits: 20 },
      { semester: 'Semester VIII', credits: 12 },
    ]
  },
  {
    id: 'student-2',
    name: 'Aditi Tiwari',
    email: 'aditi@mits.edu',
    role: 'student',
    interests: ['UI/UX Design', 'Entrepreneurship'],
    rollNumber: '0901CS231130',
    semesterAcademicCredits: [
      { semester: 'Semester I', credits: 21 },
      { semester: 'Semester II', credits: 23 },
      { semester: 'Semester III', credits: 22 },
      { semester: 'Semester IV', credits: 24 },
      { semester: 'Semester V', credits: 21 },
      { semester: 'Semester VI', credits: 23 },
      { semester: 'Semester VII', credits: 21 },
      { semester: 'Semester VIII', credits: 5 },
    ]
  }
];

export const MOCK_ADMIN: User = {
  id: 'admin-1',
  name: 'Mr. Vivek Sharma',
  email: 'viveksharma@mits.edu',
  role: 'admin',
  interests: [],
};

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'c1',
    studentId: 'student-1',
    studentRollNumber: '0901CS231129',
    studentName: 'Shourya Dubey',
    title: 'Inter-College Debate Winner',
    category: 'Institute level (C1)',
    creditPoints: 2,
    status: 'approved',
    uploadDate: '2024-01-15',
    fileUrl: 'https://picsum.photos/seed/cert1/400/300',
  },
  {
    id: 'c2',
    studentId: 'student-1',
    studentRollNumber: '0901CS231129',
    studentName: 'Shourya Dubey',
    title: 'State Level Coding Challenge',
    category: 'State level (C2)',
    creditPoints: 3,
    status: 'approved',
    uploadDate: '2024-03-01',
    fileUrl: 'https://picsum.photos/seed/cert3/400/300',
  },
  {
    id: 'c3',
    studentId: 'student-1',
    studentRollNumber: '0901CS231129',
    studentName: 'Shourya Dubey',
    title: 'Google Cloud Certification',
    category: 'MOOCS (C6)',
    creditPoints: 6,
    status: 'approved',
    uploadDate: '2024-02-20',
    fileUrl: 'https://picsum.photos/seed/cert4/400/300',
  },
];

export const INITIAL_ACTIVITIES: CampusActivity[] = [
  {
    id: 'act-1',
    title: 'MITS National Hackathon 2024',
    description: 'A 24-hour coding challenge for innovative solutions in Smart Cities.',
    type: 'Hackathon',
    category: 'State level (C2)',
    link: 'https://mits.edu/hackathon',
    registrationDeadline: '2024-12-01',
    postedDate: '2024-10-15',
  },
  {
    id: 'act-2',
    title: 'Workshop on Generative AI',
    description: 'Learn the basics of LLMs and Genkit with industry experts.',
    type: 'Workshop',
    category: 'National level (C3)',
    link: 'https://mits.edu/ai-workshop',
    registrationDeadline: '2024-11-20',
    postedDate: '2024-10-20',
  },
];

const CERT_STORAGE_KEY = 'mits_pdc_certificates';
const USER_STORAGE_KEY = 'mits_pdc_users';
const ACTIVITY_STORAGE_KEY = 'mits_campus_activities';
const SESSION_EMAIL_KEY = 'mits_active_session_email';

export const getStoredCertificates = (): Certificate[] => {
  if (typeof window === 'undefined') return INITIAL_CERTIFICATES;
  const stored = localStorage.getItem(CERT_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(INITIAL_CERTIFICATES));
    return INITIAL_CERTIFICATES;
  }
  return JSON.parse(stored);
};

export const saveCertificates = (certs: Certificate[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(certs));
    window.dispatchEvent(new Event('storage'));
  }
};

export const getStoredActivities = (): CampusActivity[] => {
  if (typeof window === 'undefined') return INITIAL_ACTIVITIES;
  const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(INITIAL_ACTIVITIES));
    return INITIAL_ACTIVITIES;
  }
  return JSON.parse(stored);
};

export const saveActivities = (activities: CampusActivity[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
    window.dispatchEvent(new Event('storage'));
  }
};

export const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return MOCK_STUDENTS;
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(MOCK_STUDENTS));
    return MOCK_STUDENTS;
  }
  return JSON.parse(stored);
};

export const registerUser = (userData: Omit<User, 'id' | 'role' | 'semesterAcademicCredits'>): User => {
  const newUser: User = {
    ...userData,
    id: `student-${Date.now()}`,
    role: 'student',
    semesterAcademicCredits: [
      { semester: 'Semester I', credits: 20 },
      { semester: 'Semester II', credits: 20 },
      { semester: 'Semester III', credits: 20 },
      { semester: 'Semester IV', credits: 20 },
      { semester: 'Semester V', credits: 20 },
      { semester: 'Semester VI', credits: 20 },
      { semester: 'Semester VII', credits: 20 },
      { semester: 'Semester VIII', credits: 0 },
    ]
  };
  
  const users = getStoredUsers();
  const updated = [...users, newUser];
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  return newUser;
};

export const findUserByRoll = (rollNumber: string): User | null => {
  const users = getStoredUsers();
  return users.find(u => u.rollNumber?.toUpperCase() === rollNumber.toUpperCase()) || null;
};

export const findUserByEmail = (email: string): User | null => {
  const users = getStoredUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

export const setSessionEmail = (email: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_EMAIL_KEY, email);
  }
};

export const getSessionEmail = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_EMAIL_KEY);
};

export const logoutSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_EMAIL_KEY);
  }
};
