import { v4 as uuidv4 } from "uuid";
const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.find((user) => user.email === args.data.email);
    if (emailTaken) throw new Error("Email already in use");

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);
    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);
    if (userIndex === -1) throw new Error("User doesn't exist");

    const { user } = db.users.splice(userIndex, 1);
    posts = db.posts.filter((post) => {
      const match = post.author === args.id;
      if (match) {
        comments = db.comments.filter(comment.post !== post.id);
      }
      return !match;
    });
    comments = db.comments.filter((comment) => comment.author !== args.id);
    return user;
  },
  updateUser(parent, args, { db }, info) {
    const user = db.users.find((user) => user.id === args.userId);
    if (!user) throw new Error("User doesn't exist");
    if (typeof args.data.email === "string") {
      const checkUser = db.users.find((user) => user.email === args.data.email);
      if (checkUser) throw new Error("Email already taken");

      user.email = args.data.email;
    }
    if (typeof args.data.name === "string") {
      user.name = args.data.name;
    }
    if (typeof args.data.age !== "undefined") {
      user.age = args.data.age;
    }

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);
    if (!userExist) throw new Error("User doesn't exist");

    const post = {
      id: uuidv4(),
      ...args.data,
    };
    db.posts.push(post);
    if (args.data.published) {
      pubsub.publish(`post`, { post: { mutation: "CREATED", data: post } });
    }
    return post;
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex === -1) throw new Error("Post doesn't exist");
    const { post } = db.posts.splice(postIndex, 1);

    comments = db.comments.filter((comment) => comment.post !== post.id);
    if (post.published) {
      pubsub.publish(`post`, { post: { mutation: "DELETED", data: post } });
    }
    return post;
  },
  updatePost(parent, args, { db }, info) {
    const post = db.posts.find((post) => post.id === args.postId);
    const originalPost = { ...post };

    if (!post) throw new Error("Post doesn't exist");
    if (typeof args.data.title === "string") {
      post.title = args.data.title;
    }
    if (typeof args.data.body === "string") {
      post.body = args.data.body;
    }
    if (typeof args.data.published === "boolean") {
      post.published = args.data.published;
      if (originalPost.published && !post.published) {
        pubsub.publish("post", {
          post: { mutation: "DELETED", data: originalPost },
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", { post: { mutation: "CREATED,data:post" } });
      }
    } else if (post.published) {
      pubsub.publish("post", { post: { mutation: "UPDATED", data: post } });
    }
    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);
    if (!userExist) throw new Error("User doesn't exist");

    const postExist = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );
    if (!postExist) throw new Error("Post does not exist or is not published");

    const comment = {
      id: uuidv4(),
      ...args.data,
    };
    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: { mutation: "CREATED", data: comment },
    });
    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );
    if (commentIndex === -1) throw new Error("Post doesn't exist");
    const { comment } = db.comments.splice(commentIndex, 1);
    pubsub.publish(`comment ${comment.post}`, {
      comment: { mutation: "DELETED", data: comment },
    });
    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const comment = db.comments.find((comment) => comment.id === args.id);
    if (!comment) throw new Error("Comment doesn't exist");
    if (typeof args.data.text === "string") {
      comment.text = args.data.text;
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: { mutation: "UPDATED", data: comment },
    });
    return comment;
  },
};

export { Mutation as default };
