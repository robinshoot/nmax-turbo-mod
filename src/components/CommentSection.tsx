"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, User } from "lucide-react";

type Comment = {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
};

export default function CommentSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, authorName: name, content }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([...comments, { ...newComment, createdAt: new Date(newComment.createdAt) }]);
        setName("");
        setContent("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 bg-secondary/5 border border-secondary/20 rounded-2xl p-6 md:p-8">
      <h3 className="text-2xl font-bold flex items-center gap-3 mb-8">
        <MessageSquare className="text-accent" />
        Komentar ({comments.length})
      </h3>

      <div className="space-y-6 mb-10">
        {comments.map((comment, index) => (
          <div 
            key={comment.id} 
            className="flex gap-4 animate-fade-in-up opacity-0"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
          >
            <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0 border border-secondary/50">
              <User size={20} className="text-gray-300" />
            </div>
            <div className="flex-grow">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-bold text-lg text-accent">{comment.authorName}</span>
                <span className="text-xs text-gray-500">
                  {mounted ? new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(comment.createdAt)) : "..."}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed bg-black/20 p-4 rounded-xl rounded-tl-none border border-secondary/10">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 italic text-center py-6">Belum ada komentar. Jadilah yang pertama!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-secondary/20 pt-8">
        <h4 className="font-semibold mb-4 text-lg">Tinggalkan Komentar</h4>
        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full md:w-1/2 bg-black/30 border border-secondary/30 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors text-white"
            required
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Tuliskan pendapat atau pertanyaan Anda..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full bg-black/30 border border-secondary/30 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors text-white resize-y"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex justify-center items-center gap-2 bg-accent hover:bg-[#b89568] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(165,131,86,0.39)] disabled:opacity-50 md:w-fit"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
