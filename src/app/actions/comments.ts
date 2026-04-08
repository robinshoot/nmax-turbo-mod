"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const CommentSchema = z.object({
  postId: z.string().min(1, "Post ID tidak valid"),
  authorName: z.string().min(2, "Nama minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
  content: z.string().min(5, "Komentar minimal 5 karakter").max(1000, "Komentar terlalu panjang"),
});

export type CommentState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  newComment?: {
    id: string;
    authorName: string;
    content: string;
    createdAt: Date;
    postId: string;
  };
};

export async function addComment(prevState: CommentState, formData: FormData): Promise<CommentState> {
  const validatedFields = CommentSchema.safeParse({
    postId: formData.get("postId"),
    authorName: formData.get("authorName"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Gagal memproses komentar. Pastikan input sesuai.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { postId, authorName, content } = validatedFields.data;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { slug: true }
    });

    if (!post) {
      return { success: false, message: "Artikel tidak ditemukan." };
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorName,
        content,
      },
    });

    revalidatePath(`/posts/${post.slug}`);

    return {
      success: true,
      message: "Komentar berhasil ditambahkan!",
      newComment: comment,
    };
  } catch (error) {
    console.error("Failed to insert comment:", error);
    return {
      success: false,
      message: "Terjadi kesalahan internal pada server.",
    };
  }
}
