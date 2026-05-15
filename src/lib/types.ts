export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  interests: string[];
  rollNumber?: string;
  semesterAcademicCredits?: {
    semester: string;
    credits: number;
  }[];
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface CategoryRule {
  id: string;
  categoryName: string;
  maxCredits: number;
  weightage: number;
  pointsPerCertificate: number;
  description?: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  studentRollNumber?: string;
  studentName?: string;
  title: string;
  category: string;
  creditPoints: number;
  status: SubmissionStatus;
  uploadDate: string;
  fileUrl: string;
  rejectionReason?: string;
}

export interface PDCResults {
  totalExtraCredits: number;
  academicCredits: number;
  categoryCredits: Record<string, number>;
  pdcScore: number;
  totalCombinedScore: number;
  maxPossiblePdcScore: number;
}

export interface CampusActivity {
  id: string;
  title: string;
  description: string;
  type: 'Seminar' | 'Internship' | 'Hackathon' | 'Course' | 'Workshop' | 'Other';
  category: string;
  link: string;
  registrationDeadline: string;
  postedDate: string;
}
