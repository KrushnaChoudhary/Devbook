import { useEffect, useState } from "react";

import API from "../api/axios";
import PostCard from "../components/PostCard";
import MainLayout from "../layouts/MainLayout";

function SavedPostsPage() {
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch saved posts
  const fetchSavedPosts = async () => {
    try {
      const { data } = await API.get("/posts/saved");

      setPosts(data);
    } catch (error) {
      console.log("Saved Posts Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  // Remove a deleted post from local state without a full refetch
  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((post) => post._id !== deletedId));
  };

  // Remove a post as soon as it's unsaved from this page
  const handlePostUnsaved = (unsavedId) => {
    setPosts((prev) => prev.filter((post) => post._id !== unsavedId));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-white text-center mt-10">
          Loading saved posts...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">
          Saved Posts
        </h1>

        {posts.length === 0 ? (
          <p className="text-zinc-400">
            You haven't saved any posts yet.
          </p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDeleted={handlePostDeleted}
              onUnsaved={handlePostUnsaved}
            />
          ))
        )}
      </div>
    </MainLayout>
  );
}

export default SavedPostsPage;
