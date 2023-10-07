import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Notes from "../pages/Notes";
import Cards from "../pages/Cards";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Notes />,
      },
      {
        path: "repeticao",
        element: <Cards />,
      },
    ],
  },
]);
