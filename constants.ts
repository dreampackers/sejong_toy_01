import { Department } from './types';

export const DEPARTMENT_INFO = {
  [Department.GENERAL_AFFAIRS]: "예산, 인사, 시설, 계약 관련 업무",
  [Department.EDUCATION]: "교육과정, 학사일정, 교원연수 관련 업무",
  [Department.STUDENT_WELFARE]: "급식, 교육비지원, 학교폭력 관련 업무",
  [Department.INFORMATIZATION]: "NEIS, 홈페이지, 전산장애 관련 업무",
  [Department.PE_HEALTH]: "보건, 체육시설, 건강검진 관련 업무",
  [Department.UNKNOWN]: "담당 부서가 불명확하거나 기타 문의"
};

export const SEJONG_BLUE = {
  primary: "#005EB8", // Sejong City official blue approximation
  secondary: "#009FE3",
  bg: "#E6F4FB"
};