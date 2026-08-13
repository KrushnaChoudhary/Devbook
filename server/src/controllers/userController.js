import mongoose from "mongoose";
import User from "../models/User.js";

// Get Current Logged-In User
export const getCurrentUser = async (req, res) => {
  res.status(200).json(req.user);
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update fields
    user.name = req.body.name || user.name;

    user.bio = req.body.bio || user.bio;

    user.profilePicture =
      req.body.profilePicture || user.profilePicture;

    // Update skills
    if (req.body.skills) {
      user.skills = req.body.skills;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Follow / Unfollow User
export const toggleFollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id format before hitting the DB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    // Prevent self-follow
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const targetUser = await User.findById(id);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const currentUser = await User.findById(req.user._id);

    // BUG FIX: currentUser.following.includes(targetUser._id) compared
    // two different ObjectId *instances* holding the same value.
    // Array.prototype.includes uses strict/SameValueZero equality, which
    // compares objects by reference, not value - so this virtually never
    // matched. The result: the "already following" branch almost never
    // fired, so Follow clicks could push duplicate entries and inflate
    // follower/following counts instead of toggling. Fixed by comparing
    // with .toString(), same pattern already used correctly a few lines
    // below in the unfollow filter.
    const alreadyFollowing = currentUser.following.some(
      (followingId) => followingId.toString() === targetUser._id.toString()
    );

    if (alreadyFollowing) {
      // Unfollow
      currentUser.following =
        currentUser.following.filter(
          (followingId) => followingId.toString() !== targetUser._id.toString()
        );

      targetUser.followers =
        targetUser.followers.filter(
          (followerId) => followerId.toString() !== currentUser._id.toString()
        );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        message: "User unfollowed",
        followersCount: targetUser.followers.length,
        followingCount: currentUser.following.length,
      });
    }

    // Follow
    currentUser.following.push(targetUser._id);

    targetUser.followers.push(currentUser._id);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      message: "User followed successfully",
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    const user = await User.findById(id)
      .select("-password")
      .populate("followers", "name username profilePicture")
      .populate("following", "name username profilePicture");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Search Users
export const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.query.query;

    if (!searchQuery || !searchQuery.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const users = await User.find({
      $or: [                        //match either name OR username
        {
          name: {
            $regex: searchQuery.trim(),
            $options: "i",
          },
        },
        {
          username: {
            $regex: searchQuery.trim(),
            $options: "i",
          },
        },
      ],
    })
      // PRIVACY FIX: this route has no auth middleware (anyone, logged in
      // or not, can hit it), so "-password" alone still returned every
      // user's email address in a public search response. Switched to an
      // explicit allow-list of only the fields the UI actually needs.
      .select("name username bio profilePicture")
      .limit(20);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};