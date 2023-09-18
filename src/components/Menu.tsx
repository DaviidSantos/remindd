import { FC } from "react";
import { LuFolderTree } from "react-icons/lu";
import {
  PiNotePencil,
  PiClockCounterClockwiseLight,
  PiQuestionLight,
} from "react-icons/pi";
import { HiOutlineCog } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

interface MenuProps {
  isFileTreeOpen: boolean;
  openCloseFileTree: () => void;
}

const Menu: FC<MenuProps> = ({ isFileTreeOpen, openCloseFileTree }) => {
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
    <aside className="h-full w-9 bg-white/95 flex flex-col justify-between border-r ">
      <div>
        <button
          className={`w-full p-2 flex justify-center hover:bg-zinc-100/90 group ${
            isFileTreeOpen ? "bg-zinc-300/75" : ""
          }`}
          onClick={openCloseFileTree}
        >
          <LuFolderTree className="text-zinc-800" />
        </button>
      </div>

      <nav className="flex flex-col text-zinc-800 w-full">
        {routes.map((route) => (
          <Link
            to={route.href}
            className={`flex justify-center hover:bg-zinc-300/75 p-2 ${
              route.isActive ? "bg-zinc-300/75" : ""
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
