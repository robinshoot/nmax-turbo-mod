import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { postId, authorName, content } = await req.json();

    if (!postId || !authorName || !content) {
      return NextResponse.json(
        { error: "Brak danych: postId, authorName, or content is missing" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorName,
        content,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
