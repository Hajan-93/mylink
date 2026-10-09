import { NextRequest, NextResponse } from "next/server";
import mockData from "@/data/mock-data.json";
import { ApiResponse, ApiLinkItem } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const activeOnly = searchParams.get("activeOnly") !== "false"; // 기본값 true

    let links = mockData.links as unknown as ApiLinkItem[];

    if (activeOnly) {
      links = links.filter((item) => item.isActive);
    }

    if (category) {
      links = links.filter((item) => item.category === category);
    }

    // order 기준 정렬
    links.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const response: ApiResponse<ApiLinkItem[]> = {
      success: true,
      statusCode: 200,
      message: "링크 목록을 성공적으로 조회했습니다.",
      data: links,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      statusCode: 500,
      message: "링크 목록 조회 중 오류가 발생했습니다.",
      data: null,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // id, title, url 필수 검증
    if (!body.title || !body.url) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "title과 url은 필수 항목입니다.",
          data: null,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const newLink: ApiLinkItem = {
      id: body.id || `lnk_${Date.now()}`,
      title: body.title,
      url: body.url,
      desc: body.desc,
      emoji: body.emoji || "🔗",
      category: body.category || "custom",
      order: body.order ?? 99,
      isActive: true,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse<ApiLinkItem> = {
      success: true,
      statusCode: 201,
      message: "새 링크가 성공적으로 생성되었습니다.",
      data: newLink,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      statusCode: 400,
      message: "유효하지 않은 요청 데이터입니다.",
      data: null,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 400 });
  }
}
