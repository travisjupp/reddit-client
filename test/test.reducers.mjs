import reducers from "../../reducers";


test("reducers", () => {
  let state;
  state = reducers(
    {
      subreddits: { status: "loading", subreddits: [], error: null },
      subredditPosts: {
        postsStatus: "loading",
        avatarsStatus: "uninitialized",
        posts: [],
        avatars: {},
        postsErrorState: null,
        avatarsErrorState: null,
      },
      subredditComments: { status: "uninitialized", comments: [], error: null },
    },
    {
      type: "subreddits/getSubredditPosts/pending",
      meta: {
        arg: "x",
        requestId: "awFyIK7y2meFP4JNpkDtl",
        requestStatus: "pending",
      },
    },
  );
  expect(state).toEqual({
    subreddits: { status: "loading", subreddits: [], error: null },
    subredditPosts: {
      postsStatus: "loading",
      avatarsStatus: "uninitialized",
      posts: [],
      avatars: {},
      postsErrorState: null,
      avatarsErrorState: null,
    },
    subredditComments: { status: "uninitialized", comments: [], error: null },
  });
});
