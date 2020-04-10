let users = [
  {
    id: "1",
    name: "Nikhil",
    email: "nick@example.com",
    age: 21,
  },
  {
    id: "2",
    name: "Nikki",
    email: "nikki@exapmle.com",
    age: 21,
  },
  {
    id: "3",
    name: "Ravi",
    email: "ravi@exapmle.com",
    age: 23,
  },
];

let posts = [
  { id: "101", title: "post1", body: "body1", published: true, author: "1" },
  { id: "102", title: "post2", body: "body2", published: false, author: "3" },
  { id: "103", title: "post3", body: "body3", published: true, author: "1" },
];

let comments = [
  { id: "101", text: "Comment1", author: "1", post: "101" },
  { id: "102", text: "Comment2", author: "2", post: "102" },
  { id: "103", text: "Comment3", author: "3", post: "103" },
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };
