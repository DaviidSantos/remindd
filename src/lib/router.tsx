import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Anotacoes from "../pages/Anotacoes";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Anotacoes />
            }
        ]
    }
])