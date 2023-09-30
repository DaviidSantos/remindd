import { FC, ReactNode, Children, useEffect, useRef } from "react";
import { useFileTreeContext } from "../context/FileTreeContext";

interface ContextMenuProps {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  path: string;
}

const ContextMenu: FC<ContextMenuProps> = ({ children, path, isOpen, setIsOpen }) => {
  const { setCurrentNode } = useFileTreeContext();
  const items = Children.toArray(children);
  const menu = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menu.current && !menu.current.contains(e.target as Node | null)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      onAuxClick={() => {
        setIsOpen(true);
        setCurrentNode(path);
      }}
      className="relative"
    >
      {items[0]}

      {isOpen && (
        <div
          className="absolute top-8 p-1 border border-zinc-800 shadow rounded-md bg-zinc-900 shadow left-0 right-0 w-11/12 mx-auto z-50"
          ref={menu}
        >
          {items
            .filter((_, index) => index !== 0)
            .map((item) => (
              <>{item}</>
            ))}
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
