import type { CommentType } from "../types";

// Mock initial data
export const MOCK_COMMENTS: CommentType[] = [
  {
    id: "1",
    userId: "u2",
    user: {
      id: "u2",
      name: "Mitu Aktar",
      avatarUrl: "",
      email: "mitu@example.com",
    },
    content: "Un komon সত্যি ই আমারও....",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1w ago
    parentId: null,
    likes: ["u1", "u3"],
    dislikes: [],
    replies: [
      {
        id: "1-1",
        userId: "u5",
        user: {
          id: "u5",
          name: "Rahim Uddin",
          avatarUrl: "",
          email: "rahim@example.com",
        },
        content: "আমারও একই মত 👍",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        parentId: "1",
        likes: ["u2"],
        dislikes: [],
        replies: [],
      },
    ],
  },
  {
    id: "2",
    userId: "u3",
    user: {
      id: "u3",
      name: "Mahi Bai",
      avatarUrl: "",
      email: "mahi@example.com",
    },
    content: "Un Komon alhamdulillah",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 2w ago
    parentId: null,
    likes: ["u2"],
    dislikes: [],
    replies: [
      {
        id: "2-1",
        userId: "u4",
        user: {
          id: "u4",
          name: "Nested User",
          avatarUrl: "",
          email: "nested@e.com",
        },
        content: "This is a reply",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        parentId: "2",
        likes: [],
        dislikes: [],
        replies: [
          {
            id: "2-1-1",
            userId: "u6",
            user: {
              id: "u6",
              name: "Deep Commenter",
              avatarUrl: "",
              email: "deep@example.com",
            },
            content: "Reply to a reply 🙂",
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            parentId: "2-1",
            likes: ["u3"],
            dislikes: [],
            replies: [
              {
                id: "2-1-1-1",
                userId: "u7",
                user: {
                  id: "u7",
                  name: "Ultra Nested",
                  avatarUrl: "",
                  email: "ultra@example.com",
                },
                content: "Deeply nested reply 🔥",
                createdAt: new Date().toISOString(),
                parentId: "2-1-1",
                likes: [],
                dislikes: [],
                replies: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    userId: "u8",
    user: {
      id: "u8",
      name: "Sadia Khan",
      avatarUrl: "",
      email: "sadia@example.com",
    },
    content: "এই পোস্টটা অনেক helpful ছিল ❤️",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    parentId: null,
    likes: ["u1", "u2", "u3"],
    dislikes: [],
    replies: [],
  },
];

export const sortOptions = [
  { label: "Most Relevant", value: "most-liked" },
  { label: "Newest", value: "newest" },
  { label: "Most Disliked", value: "most-disliked" },
];
