import { FC, useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { useFileTreeContext } from "../context/FileTreeContext";

interface ActionProps {
  icon: IconType;
  title: string;
  placeholder: string;
  buttonText: string;
  errorMessage: string;
  action: (
    setIsOpen: (isOpen: boolean) => void,
    setIsError: (isError: boolean) => void,
    input: string | undefined,
    currentNode: string
  ) => Promise<void>;
}

const Action: FC<ActionProps> = ({
  icon: Icon,
  title,
  placeholder,
  buttonText,
  errorMessage,
  action,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const { currentNode, readFileTree } = useFileTreeContext();

  const [input, setInput] = useState<string | undefined>();
  const componentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        componentRef.current &&
        !componentRef.current.contains(e.target as Node | null)
      ) {
        setIsError(false);
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await action(setIsOpen, setIsError, input, currentNode!);
    readFileTree();
  };

  return (
    <div ref={componentRef}>
      <button
        className="p-1 hover:bg-zinc-300 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon className="h-4 text-zinc-600" />
      </button>

      {isOpen && (
        <div className="absolute top-12 p-3 border rounded-md bg-zinc-50 shadow-md left-0 right-0 w-11/12 mx-auto flex flex-col z-50 gap-4">
          <h4 className="text-zinc-800 font-medium text-xs text-start">
            {title}
          </h4>

          <form className="flex flex-col gap-4" onSubmit={formSubmit}>
            <div className="relative">
              <input
                onChange={(e) => setInput(e.currentTarget.value)}
                type="text"
                autoFocus={true}
                placeholder={placeholder}
                className="w-full p-1.5 rounded-md bg-zinc-50 border focus:border-zinc-400 focus:outline-none text-xs text-zinc-800"
                id="input"
              />
              {isError && (
                <span className="text-xs text-red-600 absolute -top-1.5 right-3 px-2 bg-zinc-900">
                  {errorMessage}
                </span>
              )}
            </div>

            <button className="px-4 py-1.5 text-xs text-zinc-50 bg-zinc-900 rounded-md font-medium hover:bg-zinc-50 hover:text-zinc-900 border border-zinc-100 hover:border-zinc-800 z-50">
              {buttonText}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Action;
