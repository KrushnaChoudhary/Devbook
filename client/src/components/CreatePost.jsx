import { useState } from "react";

import API from "../api/axios";

function CreatePost({ fetchPosts }) {
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setLoading(true);

      await API.post("/posts", {
        content,
      });

      // Clear input
      setContent("");

      // Refresh feed
      fetchPosts();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4"
    >
      <div className="flex gap-4">
  
  {/* Avatar */}
  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold">
    D
  </div>

  {/* Textarea */}
        <textarea
            placeholder="Share your developer thoughts..."
            value={content}
            onChange={(e) =>
            setContent(e.target.value)
            }
            className="flex-1 bg-zinc-800 text-white p-4 rounded-xl resize-none h-28 outline-none"
        />

</div>

      <div className="flex justify-end">
        <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
        >
            {loading ? "Posting..." : "Post"}
        </button>
</div>
    </form>
  );
}

export default CreatePost;