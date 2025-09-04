import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NewPost from "./newPost";
import Post from "./post";
import EditPost from "./editPost";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/newpost",
    element: <NewPost />,
  },
  {
    path: "/post/:id",
    element: <Post />,
  },
  {
    path: "/editpost/:id",
    element: <EditPost />,
  },
]);

export default router;
