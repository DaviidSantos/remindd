import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Notes from "../pages/Notes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Notes />,
      },
    ],
  },
]);
