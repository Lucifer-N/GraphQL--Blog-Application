const Subscription = {
  comment: {
    subscribe(parent, args, { db, pubsub }, info) {
      const post = db.posts.find((post) => post.id === args.postId);
      if (!post) throw new Error("Post doesn't exist");
      return pubsub.asyncIterator(`comment ${args.postId}`);
    },
  },
  post: {
    subscribe(parent, args, { db, pubsub }, info) {
      return pubsub.asyncIterator(`post`);
    },
  },
};

export { Subscription as default };
