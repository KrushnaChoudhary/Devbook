import { useEffect, useState } from "react";

import API from "../api/axios";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import MainLayout from "../layouts/MainLayout";

function HomePage() {
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch posts
  // const fetchPosts = async () => {
  //   try {
  //     const { data } = await API.get("/posts/feed");

  //     setPosts(data);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchPosts = async () => {
  try {
    const { data } = await API.get("/posts/feed");

    console.log("Feed API Response:", data);
    console.log("Posts Length:", data.length);

    setPosts(data);
  } catch (error) {
    console.log("Feed Error:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPosts();
  }, []);

  // Remove a deleted post from local state without a full refetch
  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((post) => post._id !== deletedId));
  };

  if (loading) {
    return (
      <div className="text-white text-center mt-10">
        Loading feed...
      </div>
    );
  }

  return (
  <MainLayout>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        DevBook Feed
      </h1>

      <CreatePost fetchPosts={fetchPosts} />

      {posts.length === 0 ? (
        <p className="text-zinc-400">
          No posts available
        </p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDeleted={handlePostDeleted}
          />
        ))
      )}
        </div>
    </MainLayout>
  );
}

export default HomePage;