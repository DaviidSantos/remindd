import { FC, ReactNode } from "react";
import { VscChromeClose } from "react-icons/vsc";

interface ModalProps {
  title: string;
  shouldShow: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ title, shouldShow, onClose, children }) => {
  return shouldShow ? (
    <div
      className="fixed z-[1] left-0 top-0 w-full h-full overflow-auto bg-black/50 shadow"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-md mx-auto overflow-hidden w-4/12 my-[19%] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center py-1 px-6 bg-secondary-600 ">
          <h4 className="text-white text-sm">{title}</h4>
          <button onClick={onClose}>
            <VscChromeClose className="h-3 text-white hover:text-zinc-300" />
          </button>
        </div>
        <div className="p-2">{children}</div>
      </div>
    </div>
  ) : null;
};

export default Modal;
