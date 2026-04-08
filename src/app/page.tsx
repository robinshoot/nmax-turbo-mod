import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowRight, MessageSquare } from "lucide-react";
import BlogArchiveSidebar from "@/components/BlogArchiveSidebar";

// Add unstable_cache or just rely on Next.js default revalidation
export const revalidate = 10;

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: {
      tags: true,
      _count: {
        select: { comments: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center mb-16 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Inspirasi <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-[#d3a86f]">Modifikasi</span> NMAX Turbo
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Temukan ragam modifikasi, dari custom body hingga aksesoris premium untuk Yamaha NMAX Turbo Anda.
        </p>
      </section>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {posts.map((post, index) => (
          <Link href={`/posts/${post.slug}`} key={post.id} className="group">
            <article 
              className="bg-secondary/10 border border-secondary/20 rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(165,131,86,0.15)] flex flex-col h-full opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
            >
              <div className="aspect-video w-full overflow-hidden relative">
                <Image 
                  src={post.imageUrl} 
                  alt={post.title} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map(tag => (
                    <span key={tag.id} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/20">
                      {tag.name}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm flex-grow line-clamp-3 mb-4">
                  {post.summary}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-secondary/20 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={16} />
                    <span>{post._count.comments} Komentar</span>
                  </div>
                  <div className="flex items-center gap-1 text-accent opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                    <span>Baca detail</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
          </div>
        </div>
        
        <BlogArchiveSidebar />
      </div>
    </div>
  );
}
