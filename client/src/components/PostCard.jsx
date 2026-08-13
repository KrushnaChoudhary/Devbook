import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

import {
  FaHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
  FaTrash,
} from "react-icons/fa";

function PostCard({ post, onDeleted, onUnsaved }) {
  const { user, refreshUser } = useAuth();

  const [likes, setLikes] = useState(post?.likes?.length || 0);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savePending, setSavePending] = useState(false);

  const [comments, setComments] = useState(post?.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const isOwner =
    user && post?.author?._id && user._id === post.author._id;

  // Keep "saved" in sync with the logged-in user's savedPosts list
  // (e.g. after login, or after saving/unsaving elsewhere)
  useEffect(() => {
    const isSaved = Boolean(
      user?.savedPosts?.some((id) => id.toString() === post._id)
    );

    setSaved(isSaved);
  }, [user, post._id]);

  const handleLike = async () => {
    try {
      const { data } = await API.put(`/posts/${post._id}/like`);

      setLikes(data.likes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      setSavePending(true);

      const { data } = await API.put(`/posts/${post._id}/save`);

      const nowSaved = data.message === "Post saved successfully";

      setSaved(nowSaved);

      // If this card is being shown on the Saved Posts page,
      // unsaving should remove it from that list immediately
      if (!nowSaved) {
        onUnsaved?.(post._id);
      }

      // Refresh the shared user object so savedPosts stays accurate
      // on every other PostCard too
      refreshUser?.();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to update saved post");
    } finally {
      setSavePending(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      setCommentSubmitting(true);

      const { data } = await API.post(`/posts/${post._id}/comment`, {
        text: commentText.trim(),
      });

      // Backend returns the full, populated comment list
      setComments(data.comments);

      setCommentText("");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this post? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await API.delete(`/posts/${post._id}`);

      // Let the parent (feed) know so it can remove this card
      // without refetching the whole list
      onDeleted?.(post._id);
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition hover:border-zinc-700 hover:bg-zinc-900/80">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        {/* LEFT USER INFO */}
        <Link
          to={`/profile/${post?.author?._id}`}
          className="flex items-center gap-4 group"
        >

          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg font-bold">
            {post?.author?.name?.charAt(0)}
          </div>

          {/* Name + Username */}
          <div>
            <h2 className="font-semibold text-white text-lg group-hover:underline">
              {post?.author?.name}
            </h2>

            <p className="text-zinc-400 text-sm">
              @{post?.author?.username}
            </p>
          </div>

        </Link>

        {/* Timestamp + Delete */}
        <div className="flex items-center gap-4">
          <p className="text-zinc-500 text-sm">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete post"
              className="text-zinc-500 hover:text-red-500 transition disabled:opacity-50"
            >
              <FaTrash />
            </button>
          )}
        </div>

      </div>

      {/* CONTENT */}
      <div className="mt-5">
        <p className="text-zinc-100 leading-7 text-[16px]">
          {post?.content}
        </p>
      </div>

      {/* IMAGE (future-ready) */}
      {post?.image && (
        <div className="mt-5">
          <img
            src={post.image}
            alt="Post"
            className="rounded-xl w-full object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-8 mt-6 pt-4 border-t border-zinc-800 text-zinc-400">

        {/* Likes */}
        <button
          onClick={handleLike}
          className="flex items-center gap-2 hover:text-red-400 transition"
        >
          <FaHeart />

          <span>
            {likes}
          </span>
        </button>

        {/* Comments */}
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-2 hover:text-blue-400 transition"
        >
          <FaRegComment />

          <span>
            {comments.length}
          </span>
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={savePending}
          title={saved ? "Remove from saved" : "Save post"}
          className={`flex items-center gap-2 transition disabled:opacity-50 ${
            saved ? "text-yellow-400" : "hover:text-yellow-400"
          }`}
        >
          {saved ? <FaBookmark /> : <FaRegBookmark />}
        </button>

      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="mt-5 pt-4 border-t border-zinc-800 space-y-4">

          {/* Existing comments */}
          {comments.length === 0 ? (
            <p className="text-zinc-500 text-sm">
              No comments yet. Be the first to comment.
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment, index) => (
                <div
                  key={comment._id || index}
                  className="flex items-start gap-3"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                    {comment?.user?.name?.charAt(0) || "?"}
                  </div>

                  <div className="bg-zinc-800 rounded-xl px-4 py-2 flex-1">
                    <p className="text-sm font-semibold text-white">
                      {comment?.user?.name || "Unknown user"}{" "}
                      <span className="text-zinc-500 font-normal">
                        @{comment?.user?.username}
                      </span>
                    </p>

                    <p className="text-zinc-200 text-sm mt-1">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add comment form */}
          <form
            onSubmit={handleAddComment}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-zinc-800 text-white text-sm p-3 rounded-xl outline-none"
            />

            <button
              type="submit"
              disabled={commentSubmitting || !commentText.trim()}
              className="bg-white text-black px-4 py-2 rounded-xl font-semibold text-sm hover:bg-zinc-200 transition disabled:opacity-50"
            >
              {commentSubmitting ? "..." : "Post"}
            </button>
          </form>

        </div>
      )}
    </div>
  );
}

export default PostCard;
