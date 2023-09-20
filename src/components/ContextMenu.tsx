import { FC, ReactNode, Children, useState, useEffect, useRef } from "react";

interface ContextMenuProps {
  children: ReactNode;
}

const ContextMenu: FC<ContextMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const items = Children.toArray(children);
  const menu = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menu.current &&
        !menu.current.contains(e.target as Node | null)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div onAuxClick={() => setIsOpen(true)} className="relative">
      {items[0]}

      {isOpen && (
        <div
          className="absolute top-8 p-1 border rounded-md bg-zinc-50 shadow-md left-0 right-0 w-11/12 mx-auto z-50"
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
