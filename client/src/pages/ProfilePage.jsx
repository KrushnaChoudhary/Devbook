import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { id } = useParams();

  const { user: currentUser, refreshUser } = useAuth();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [followPending, setFollowPending] = useState(false);

  // Fetch this user's profile (name, bio, skills, followers, following)
  const fetchProfile = async () => {
    try {
      const { data } = await API.get(`/users/${id}`);

      setProfile(data);
    } catch (error) {
      console.log("Profile fetch error:", error);

      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isOwnProfile = currentUser && currentUser._id === id;

  const isFollowing = Boolean(
    profile?.followers?.some((follower) => follower._id === currentUser?._id)
  );

  const handleToggleFollow = async () => {
    try {
      setFollowPending(true);

      await API.put(`/users/${id}/follow`);

      // Refresh this profile's follower/following counts + lists
      await fetchProfile();

      // Keep the logged-in user's own "following" list (used elsewhere,
      // e.g. AuthContext) accurate too
      refreshUser?.();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Failed to update follow status"
      );
    } finally {
      setFollowPending(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-white text-center mt-10">
          Loading profile...
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="text-white text-center mt-10">
          User not found.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
                {profile.name?.charAt(0)}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  {profile.name}
                </h1>

                <p className="text-zinc-400">
                  @{profile.username}
                </p>
              </div>
            </div>

            {!isOwnProfile && (
              <button
                onClick={handleToggleFollow}
                disabled={followPending}
                className={`px-6 py-2 rounded-xl font-semibold transition disabled:opacity-50 ${
                  isFollowing
                    ? "bg-zinc-800 text-white hover:bg-red-500/10 hover:text-red-400"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {followPending
                  ? "..."
                  : isFollowing
                  ? "Following"
                  : "Follow"}
              </button>
            )}
          </div>

          {/* BIO */}
          {profile.bio && (
            <p className="text-zinc-300 mt-5 leading-6">
              {profile.bio}
            </p>
          )}

          {/* SKILLS */}
          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-zinc-800 text-zinc-200 text-sm px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* FOLLOW COUNTS */}
          <div className="flex items-center gap-8 mt-6 pt-6 border-t border-zinc-800">
            <div>
              <span className="text-xl font-bold text-white">
                {profile.followers?.length || 0}
              </span>
              <span className="text-zinc-400 ml-2">
                Followers
              </span>
            </div>

            <div>
              <span className="text-xl font-bold text-white">
                {profile.following?.length || 0}
              </span>
              <span className="text-zinc-400 ml-2">
                Following
              </span>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default ProfilePage;
