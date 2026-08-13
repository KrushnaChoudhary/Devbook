import mongoose from "mongoose";
import Post from "../models/Post.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    const post = await Post.create({
      content,
      image,
      author: req.user._id,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Posts
// export const getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("author", "name username profilePicture")
//       .sort({ createdAt: -1 });

//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// Get All Posts with Pagination
export const getPosts = async (req, res) => {
  try {
    // Page number
    const page = parseInt(req.query.page) || 1;

    // Posts per page
    const limit = parseInt(req.query.limit) || 5;

    // Skip calculation
    const skip = (page - 1) * limit;

    // Total posts count
    const totalPosts = await Post.countDocuments();

    const posts = await Post.find()
      .populate("author", "name username profilePicture")
      .populate("comments.user", "name username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Like / Unlike Post
export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check if already liked
    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );

      await post.save();

      return res.status(200).json({
        message: "Post unliked",
        likes: post.likes.length,
      });
    }

    // Like
    post.likes.push(req.user._id);

    await post.save();

    res.status(200).json({
      message: "Post liked",
      likes: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Validate id format before hitting the DB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post id",
      });
    }

    // Don't allow empty/whitespace-only comments
    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = {
      user: req.user._id,
      text: text.trim(),
    };

    post.comments.push(comment);

    await post.save();

    // BUG FIX: previously the response returned post.comments with
    // "user" as a raw ObjectId, so the just-added comment showed up
    // without a name/username until the page was refetched. Populating
    // here means the client gets the commenter's info immediately.
    await post.populate("comments.user", "name username profilePicture");

    res.status(201).json({
      message: "Comment added successfully",
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id format before hitting the DB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post id",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this post",
      });
    }

    await post.deleteOne();

    // Return the deleted post's id so the client can remove it
    // from local state without refetching the whole feed
    res.status(200).json({
      message: "Post deleted successfully",
      postId: id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Personalized Feed
export const getFeedPosts = async (req, res) => {
  try {
    // Current user
    const currentUser = req.user;

    // Include own posts also
    const followingUsers = [
      ...currentUser.following,
      currentUser._id,
    ];

    const posts = await Post.find({
      author: { $in: followingUsers },
    })
      .populate("author", "name username profilePicture")
      .populate("comments.user", "name username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Save / Unsave Post
export const toggleSavePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    // Validate id format before hitting the DB
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "Invalid post id",
      });
    }

    // Make sure the post actually exists (previously you could
    // "save" a post id that didn't exist)
    const postExists = await Post.exists({ _id: postId });

    if (!postExists) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const user = req.user;

    // BUG FIX: user.savedPosts is an array of ObjectId documents,
    // postId is a plain string - Array.prototype.includes() (which
    // Mongoose does not override) compares them with strict equality
    // and never matches, so saves/unsaves were unreliable. Comparing
    // via .toString() (same pattern used in toggleFollowUser below)
    // fixes it.
    const alreadySaved = user.savedPosts.some(
      (id) => id.toString() === postId
    );

    if (alreadySaved) {
      // Remove saved post
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== postId
      );

      await user.save();

      return res.status(200).json({
        message: "Post removed from saved",
      });
    }

    // Save post
    user.savedPosts.push(postId);

    await user.save();

    res.status(200).json({
      message: "Post saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Saved Posts
export const getSavedPosts = async (req, res) => {
  try {
    const user = await req.user.populate({
      path: "savedPosts",
      populate: {
        path: "author",
        select: "name username profilePicture",
      },
    });

    res.status(200).json(user.savedPosts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
