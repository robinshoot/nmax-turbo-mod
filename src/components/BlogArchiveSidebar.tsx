import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BlogArchiveSidebar({ currentSlug }: { currentSlug?: string }) {
  const allPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, createdAt: true },
  });

  if (allPosts.length === 0) return null;

  type ArchiveMonth = { month: string; posts: typeof allPosts };
  type ArchiveYear = { year: number; months: ArchiveMonth[]; count: number };
  
  const tree: ArchiveYear[] = [];
  const postsByYear = new Map<number, typeof allPosts>();

  allPosts.forEach(p => {
    const y = p.createdAt.getFullYear();
    if (!postsByYear.has(y)) postsByYear.set(y, []);
    postsByYear.get(y)!.push(p);
  });

  Array.from(postsByYear.keys()).sort((a, b) => b - a).forEach(year => {
    const postsForYear = postsByYear.get(year)!;
    const postsByMonth = new Map<string, typeof allPosts>();
    
    postsForYear.forEach(p => {
      const m = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(p.createdAt);
      if (!postsByMonth.has(m)) postsByMonth.set(m, []);
      postsByMonth.get(m)!.push(p);
    });

    const months: ArchiveMonth[] = Array.from(postsByMonth.keys()).map(m => ({
      month: m,
      posts: postsByMonth.get(m)!
    }));

    tree.push({ year, months, count: postsForYear.length });
  });

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
      <div className="sticky top-8 bg-secondary/5 border border-secondary/20 rounded-3xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4 border-b border-secondary/20 pb-3 text-white">
          Blog Archive
        </h3>
        
        <div className="flex flex-col gap-2 text-sm">
          {tree.map((yearGroup, idx) => (
            <details key={yearGroup.year} className="group/year" open={idx === 0}>
              <summary className="cursor-pointer font-bold text-gray-200 hover:text-accent transition-colors py-1 select-none">
                {yearGroup.year} <span className="text-gray-500 font-normal">({yearGroup.count})</span>
              </summary>
              
              <div className="pl-4 flex flex-col gap-1 mt-1 border-l border-secondary/20 ml-2">
                {yearGroup.months.map((monthGroup, mIdx) => (
                  <details key={monthGroup.month} className="group/month mt-1" open={idx === 0 && mIdx === 0}>
                    <summary className="cursor-pointer font-semibold text-gray-300 hover:text-accent transition-colors py-1 select-none">
                      {monthGroup.month} <span className="text-gray-500 font-normal">({monthGroup.posts.length})</span>
                    </summary>
                    
                    <div className="pl-4 flex flex-col gap-2 my-2 border-l border-secondary/20 ml-2">
                      {monthGroup.posts.map(ap => (
                        <Link 
                          href={`/posts/${ap.slug}`} 
                          key={ap.id} 
                          className={`block hover:text-accent transition-colors leading-snug line-clamp-2 ${ap.slug === currentSlug ? 'text-accent font-bold' : 'text-gray-400'}`}
                        >
                          {ap.title}
                        </Link>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </aside>
  );
}
