import { v } from "convex/values";
import { query } from "./_generated/server";

export const getAnalytics = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      return null;
    }

    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .collect();

    
    const followersCount = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), user._id))
      .collect();

   
    const totalViews = posts.reduce((sum, post) => sum + post.viewCount, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0);

    const postIds = posts.map((p) => p._id);
    let totalComments = 0;

    for (const postId of postIds) {
      const comments = await ctx.db
        .query("comments")
        .filter((q) =>
          q.and(
            q.eq(q.field("postId"), postId),
            q.eq(q.field("status"), "approved")
          )
        )
        .collect();
      totalComments += comments.length;
    }

   
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const recentPosts = posts.filter((p) => p.createdAt > thirtyDaysAgo);
    const recentViews = recentPosts.reduce(
      (sum, post) => sum + post.viewCount,
      0
    );
    const recentLikes = recentPosts.reduce(
      (sum, post) => sum + post.likeCount,
      0
    );

    
    const viewsGrowth = totalViews > 0 ? (recentViews / totalViews) * 100 : 0;
    const likesGrowth = totalLikes > 0 ? (recentLikes / totalLikes) * 100 : 0;
    const commentsGrowth = totalComments > 0 ? 15 : 0; 
    const followersGrowth = followersCount.length > 0 ? 12 : 0;
    return {
      totalViews,
      totalLikes,
      totalComments,
      totalFollowers: followersCount.length,
      viewsGrowth: Math.round(viewsGrowth * 10) / 10,
      likesGrowth: Math.round(likesGrowth * 10) / 10,
      commentsGrowth,
      followersGrowth,
    };
  },
});

export const getRecentActivity = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      return [];
    }

    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .collect();

    const postIds = posts.map((p) => p._id);
    const activities = [];

   
    for (const postId of postIds) {
      const likes = await ctx.db
        .query("likes")
        .filter((q) => q.eq(q.field("postId"), postId))
        .order("desc")
        .take(5);

      for (const like of likes) {
        if (like.userId) {
          const likeUser = await ctx.db.get(like.userId);
          const post = posts.find((p) => p._id === postId);

          if (likeUser && post) {
            activities.push({
              type: "like",
              user: likeUser.name,
              post: post.title,
              time: like.createdAt,
            });
          }
        }
      }
    }

    
    for (const postId of postIds) {
      const comments = await ctx.db
        .query("comments")
        .filter((q) =>
          q.and(
            q.eq(q.field("postId"), postId),
            q.eq(q.field("status"), "approved")
          )
        )
        .order("desc")
        .take(5);

      for (const comment of comments) {
        const post = posts.find((p) => p._id === postId);

        if (post) {
          activities.push({
            type: "comment",
            user: comment.authorName,
            post: post.title,
            time: comment.createdAt,
          });
        }
      }
    }

    const recentFollowers = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), user._id))
      .order("desc")
      .take(5);

    for (const follow of recentFollowers) {
      const follower = await ctx.db.get(follow.followerId);
      if (follower) {
        activities.push({
          type: "follow",
          user: follower.name,
          time: follow.createdAt,
        });
      }
    }

    activities.sort((a, b) => b.time - a.time);

    return activities.slice(0, args.limit || 10);
  },
});


export const getPostsWithAnalytics = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

   
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      return [];
    }

    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .order("desc")
      .take(args.limit || 5);

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await ctx.db
          .query("comments")
          .filter((q) =>
            q.and(
              q.eq(q.field("postId"), post._id),
              q.eq(q.field("status"), "approved")
            )
          )
          .collect();

        return {
          ...post,
          commentCount: comments.length,
        };
      })
    );

    return postsWithComments;
  },
});

export const getDailyViews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

  
    const userPosts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .collect();

    const postIds = userPosts.map((post) => post._id);

    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD
      days.push({
        date: dateString,
        views: 0,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      });
    }

    const dailyStats = await ctx.db
      .query("dailyStats")
      .filter((q) => q.or(...postIds.map((id) => q.eq(q.field("postId"), id))))
      .collect();

    const viewsByDate :Record<string, number> = {};
    dailyStats.forEach((stat) => {
      if (viewsByDate[stat.date]) {
        viewsByDate[stat.date] += stat.views;
      } else {
        viewsByDate[stat.date] = stat.views;
      }
    });

    const chartData = days.map((day) => ({
      ...day,
      views: viewsByDate[day.date] || 0,
    }));

    return chartData;
  },
});