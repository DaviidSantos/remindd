import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Notes from "../pages/Notes";
import Cards from "../pages/Cards";
import Revisao from "../pages/Revisao";

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
      {
        path: "revisao/:card_id",
        element: <Revisao />
      }
    ],
  },
]);
