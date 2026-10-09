import { NextResponse } from "next/server";
import mockData from "@/data/mock-data.json";
import { ApiResponse, ApiProfileData } from "@/types/api";

export async function GET() {
  try {
    const profile = mockData.profile as unknown as ApiProfileData;

    const response: ApiResponse<ApiProfileData> = {
      success: true,
      statusCode: 200,
      message: "프로필 정보를 성공적으로 조회했습니다.",
      data: profile,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      statusCode: 500,
      message: "서버 내부 오류가 발생했습니다.",
      data: null,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
