import {
  PiNotePencil,
  PiClockCounterClockwiseLight,
  PiQuestionLight,
} from "react-icons/pi";
import { HiOutlineCog } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useExplorerContext } from "../context/ExplorerContext";
import { BsFolder2 } from "react-icons/bs";

const Menu = () => {
  const { isExplorerOpen, setIsExplorerOpen } = useExplorerContext();
  const location = useLocation();

  const routes = [
    {
      href: "/",
      icon: <PiNotePencil className="h-5" />,
      tooltip: "Anotações",
      isActive: location.pathname === "/",
    },
    {
      href: "/repeticao",
      icon: <PiClockCounterClockwiseLight className="h-5" />,
      tooltip: "Repetição Espaçada",
      isActive: location.pathname === "/repeticao",
    },
    {
      href: "/ajuda",
      icon: <PiQuestionLight className="h-5" />,
      tooltip: "Ajuda",
      isActive: location.pathname === "/ajuda",
    },
    {
      href: "/configuracoes",
      icon: <HiOutlineCog className="h-5" />,
      tooltip: "Configurações",
      isActive: location.pathname === "/configuracoes",
    },
  ];

  return (
    <aside className="h-full w-9 bg-black/75 flex flex-col justify-between">
      <div>
        <button
          className={`w-full p-2 flex justify-center hover:bg-zinc-800/75 group `}
          onClick={() => setIsExplorerOpen(!isExplorerOpen)}
        >
          <BsFolder2 className="text-zinc-300" />
        </button>
      </div>

      <nav className="flex flex-col text-zinc-300 w-full">
        {routes.map((route) => (
          <Link
            to={route.href}
            className={`flex justify-center hover:bg-zinc-800/75 p-2 ${
              route.isActive ? "bg-zinc-800/75" : ""
            }`}
          >
            {route.icon}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Menu;
