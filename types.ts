
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  fatherName: string;
  class: string;
  password: string;
  createdAt: string;
}

export interface Material {
  id: string;
  title: string;
  type: 'SLIDE' | 'LECTURE' | 'DOCUMENT';
  content: string; // Base64 or Description
  date: string;
}

export interface Assignment {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  fileContent: string;
  status: 'PENDING' | 'PASS' | 'FAIL';
  marks?: number;
  teacherComment?: string;
  date: string;
}

export interface LiveSession {
  isActive: boolean;
  teacherName: string;
  startTime?: string;
}

export interface AuthState {
  user: {
    role: UserRole;
    id: string;
    name: string;
  } | null;
}
