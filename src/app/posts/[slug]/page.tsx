import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommentSection from "@/components/CommentSection";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag as TagIcon, Wrench, CheckCircle2 } from "lucide-react";
import BlogArchiveSidebar from "@/components/BlogArchiveSidebar";

export const revalidate = 10;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ select: { slug: true } });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: { title: true, summary: true, imageUrl: true }
  });

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | NMAX Turbo Modifikasi`,
    description: post.summary,
    openGraph: {
      images: [post.imageUrl],
    },
  };
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      tags: true,
      modifiedParts: true,
      comments: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors mb-8 group font-semibold">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <article className="flex-1 w-full max-w-4xl">

      <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag.id} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 shadow-[0_0_10px_rgba(165,131,86,0.1)]">
              <TagIcon size={14} />
              {tag.name}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-2 text-gray-400 mb-10 pb-6 border-b border-secondary/30">
          <Calendar size={18} />
          <span suppressHydrationWarning>
            {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(post.createdAt)}
          </span>
        </div>
      </div>

      <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 border border-secondary/20 shadow-2xl relative opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <Image 
          src={post.imageUrl} 
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <div className="prose prose-invert prose-lg prose-p:text-gray-300 prose-headings:text-white max-w-none opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
        {post.content.split('\n').map((paragraph, idx) => (
          <p key={idx} className="mb-6 leading-relaxed">{paragraph}</p>
        ))}
      </div>

      {post.modifiedParts && post.modifiedParts.length > 0 && (
        <div className="my-10 p-8 bg-secondary/10 border border-secondary/30 rounded-3xl opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
          <h3 className="text-2xl font-bold flex items-center gap-3 mb-6 text-white">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Wrench className="text-accent" size={24} />
            </div>
            Daftar Modifikasi
          </h3>
          <ul className="grid grid-cols-1 gap-4">
            {post.modifiedParts.map((part) => {
              let statusClasses = "bg-purple-500/10 text-purple-400 border-purple-500/20";
              if (part.status === "PnP") statusClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
              else if (part.status === "Butuh Bracket") statusClasses = "bg-amber-500/10 text-amber-400 border-amber-500/20";

              return (
                <li 
                  key={part.id} 
                  className="flex flex-col gap-2 p-5 bg-background/50 border border-secondary/20 rounded-xl hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 group"
                >
                  <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-accent flex-shrink-0 group-hover:scale-110 transition-transform" size={22} />
                      <span className="text-gray-100 font-bold text-lg group-hover:text-white transition-colors">{part.name}</span>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-sm ${statusClasses} flex-shrink-0`}>
                      {part.status}
                    </span>
                  </div>
                  {part.description && (
                    <p className="text-gray-400 text-sm sm:pl-9 leading-relaxed mt-1">
                      {part.description}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
        <CommentSection postId={post.id} initialComments={post.comments} />
      </div>
        </article>

        <BlogArchiveSidebar currentSlug={post.slug} />
      </div>
    </div>
  );
}
