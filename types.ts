export enum Department {
  GENERAL_AFFAIRS = "총무과",
  EDUCATION = "교육과",
  STUDENT_WELFARE = "학생복지과",
  INFORMATIZATION = "정보화팀",
  PE_HEALTH = "체육건강과",
  UNKNOWN = "기타/미분류"
}

export enum Priority {
  URGENT = "긴급",
  NORMAL = "보통",
  LOW = "낮음"
}

export interface AnalysisResult {
  department: string;
  confidence: number; // 0 to 100
  reason: string;
  priority: Priority;
}

export interface ComplaintData {
  title: string;
  content: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  complaint: ComplaintData;
  result: AnalysisResult;
}