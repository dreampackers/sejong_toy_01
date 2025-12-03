import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Priority } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Please check your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const classifyComplaint = async (title: string, content: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is not configured.");
  }

  const model = "gemini-2.5-flash";
  
  const systemInstruction = `
    당신은 세종시교육청의 숙련된 민원 분류 담당관입니다. 
    제출된 민원의 제목과 내용을 분석하여 가장 적절한 담당 부서를 배정하고, 우선순위를 판단해야 합니다.
    
    부서별 업무 범위:
    - 총무과: 예산, 인사, 시설, 계약
    - 교육과: 교육과정, 학사일정, 교원연수
    - 학생복지과: 급식, 교육비지원, 학교폭력
    - 정보화팀: NEIS, 홈페이지, 전산장애
    - 체육건강과: 보건, 체육시설, 건강검진
    
    우선순위 판단 기준:
    - 긴급: 학교폭력, 안전사고, 전산시스템 마비, 아동학대 등 즉각적인 조치가 필요한 경우.
    - 보통: 일반적인 문의, 제안, 행정 절차 안내 등.
    - 낮음: 단순 칭찬, 불만 토로(구체적 요구 없음), 단순 정보 조회 등.

    신뢰도는 0에서 100 사이의 정수로 판단하세요.
  `;

  const userPrompt = `
    제목: ${title}
    내용: ${content}
    
    위 민원을 분석하여 담당 부서, 분류 이유, 우선순위, 신뢰도를 JSON 형식으로 반환해 주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            department: {
              type: Type.STRING,
              description: "배정된 담당 부서 이름 (총무과, 교육과, 학생복지과, 정보화팀, 체육건강과 중 택 1)",
              enum: ["총무과", "교육과", "학생복지과", "정보화팀", "체육건강과", "기타/미분류"]
            },
            reason: {
              type: Type.STRING,
              description: "해당 부서로 분류한 구체적인 이유 (한글 2~3문장)"
            },
            priority: {
              type: Type.STRING,
              enum: ["긴급", "보통", "낮음"],
              description: "민원 처리 우선순위"
            },
            confidence: {
              type: Type.INTEGER,
              description: "분류 결과에 대한 신뢰도 (0~100)"
            }
          },
          required: ["department", "reason", "priority", "confidence"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI 응답이 비어있습니다.");
    }

    const jsonResponse = JSON.parse(text);

    // Map string priority to Enum
    let priorityEnum = Priority.NORMAL;
    if (jsonResponse.priority === "긴급") priorityEnum = Priority.URGENT;
    if (jsonResponse.priority === "낮음") priorityEnum = Priority.LOW;

    return {
      department: jsonResponse.department,
      confidence: jsonResponse.confidence,
      reason: jsonResponse.reason,
      priority: priorityEnum
    };

  } catch (error) {
    console.error("Gemini Classification Error:", error);
    throw new Error("민원 분류 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};