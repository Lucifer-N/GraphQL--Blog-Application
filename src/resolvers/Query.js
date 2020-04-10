const Query = {
  users(parent, args, { db }, info) {
    if (args.query)
      return db.users.filter((p) =>
        p.name.toLowerCase().includes(args.query.toLowerCase())
      );
    return db.users;
  },
  posts(parent, args, { db }, info) {
    if (args.query)
      return db.posts.filter((p) => {
        return (
          p.title.toLowerCase().includes(args.query.toLowerCase()) ||
          p.body.toLowerCase().includes(args.query.toLowerCase())
        );
      });
    return db.posts;
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  me() {
    return {
      id: "1",
      name: "Nikhil",
      email: "nick@example.com",
      age: 28,
    };
  },
  post() {
    return {
      id: "101",
      title: "Post 1",
      body: "body 1",
      published: true,
    };
  },
};

export { Query as default };
