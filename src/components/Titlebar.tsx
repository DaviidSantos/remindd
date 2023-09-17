import { appWindow } from "@tauri-apps/api/window";
import { useState } from "react";
import { VscChromeMinimize, VscChromeRestore, VscChromeMaximize, VscChromeClose } from "react-icons/vsc";

const Titlebar = () => {
    const [winState, setWinState] = useState("restored");

    const handleClose = () => {
      appWindow.close();
    };
  
    const handleMinimize = () => {
      appWindow.minimize();
    };
  
    const handleMaximizeRestore = () => {
      if (winState === "maximized") {
        appWindow.unmaximize();
        setWinState("restored");
      } else {
        appWindow.maximize();
        setWinState("maximized");
      }
    };
    return (
      <div
        data-tauri-drag-region
        className="w-full flex items-center justify-between bg-white border-b border-b-zinc-300"
      >
        <div className="flex items-center gap-3">
          <svg
            className="h-6 text-zinc-900"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.0417 35C14.625 35 13.4236 34.4722 12.4375 33.4167C11.4514 32.3611 10.8889 31.1667 10.75 29.8333C9.11111 29.6944 7.74306 29.0069 6.64583 27.7708C5.54861 26.5347 5 25.0278 5 23.25C5 22.6389 5.07639 22.0486 5.22917 21.4792C5.38194 20.9097 5.61111 20.3611 5.91667 19.8333C5.61111 19.3333 5.38194 18.8056 5.22917 18.25C5.07639 17.6944 5 17.0972 5 16.4583C5 14.7917 5.57639 13.3611 6.72917 12.1667C7.88194 10.9722 9.25 10.2778 10.8333 10.0833C10.8889 8.66667 11.4236 7.46528 12.4375 6.47917C13.4514 5.49306 14.6667 5 16.0833 5C16.8889 5 17.6042 5.14583 18.2292 5.4375C18.8542 5.72917 19.4444 6.15278 20 6.70833C20.5556 6.15278 21.1389 5.72917 21.75 5.4375C22.3611 5.14583 23.0694 5 23.875 5C25.2639 5 26.4583 5.49306 27.4583 6.47917C28.4583 7.46528 29 8.66667 29.0833 10.0833C30.6944 10.2222 32.0833 10.8958 33.25 12.1042C34.4167 13.3125 35 14.7639 35 16.4583C35 17.0972 34.9167 17.7014 34.75 18.2708C34.5833 18.8403 34.3472 19.375 34.0417 19.875C34.3472 20.4306 34.5833 21.0139 34.75 21.625C34.9167 22.2361 35 22.8333 35 23.4167C35 25.1944 34.4514 26.6736 33.3542 27.8542C32.2569 29.0347 30.8889 29.6944 29.25 29.8333C29.1111 31.1667 28.5417 32.3611 27.5417 33.4167C26.5417 34.4722 25.3472 35 23.9583 35C23.125 35 22.4028 34.8611 21.7917 34.5833C21.1806 34.3056 20.5833 33.8889 20 33.3333C19.4167 33.8889 18.8194 34.3056 18.2083 34.5833C17.5972 34.8611 16.875 35 16.0417 35ZM21.25 10V30C21.25 30.6944 21.5208 31.2847 22.0625 31.7708C22.6042 32.2569 23.25 32.5 24 32.5C24.7222 32.5 25.3472 32.1806 25.875 31.5417C26.4028 30.9028 26.6944 30.25 26.75 29.5833C26.1111 29.3611 25.5139 29.0625 24.9583 28.6875C24.4028 28.3125 23.9306 27.8472 23.5417 27.2917C23.3194 26.9861 23.2361 26.6736 23.2917 26.3542C23.3472 26.0347 23.5278 25.7639 23.8333 25.5417C24.1389 25.3194 24.4514 25.2361 24.7708 25.2917C25.0903 25.3472 25.3611 25.5278 25.5833 25.8333C25.9444 26.3333 26.3889 26.7153 26.9167 26.9792C27.4444 27.2431 28.0278 27.375 28.6667 27.375C29.7222 27.375 30.625 27.0139 31.375 26.2917C32.125 25.5694 32.5 24.6111 32.5 23.4167C32.5 23.1667 32.4722 22.9097 32.4167 22.6458C32.3611 22.3819 32.3056 22.1111 32.25 21.8333C31.75 22.1944 31.2014 22.4653 30.6042 22.6458C30.0069 22.8264 29.3889 22.9167 28.75 22.9167C28.3889 22.9167 28.0903 22.7986 27.8542 22.5625C27.6181 22.3264 27.5 22.0278 27.5 21.6667C27.5 21.3056 27.6181 21.0069 27.8542 20.7708C28.0903 20.5347 28.3889 20.4167 28.75 20.4167C29.8056 20.4167 30.6944 20.0278 31.4167 19.25C32.1389 18.4722 32.5 17.5417 32.5 16.4583C32.5 15.4028 32.1111 14.5 31.3333 13.75C30.5556 13 29.6667 12.5972 28.6667 12.5417C28.3889 13.2083 27.9931 13.7986 27.4792 14.3125C26.9653 14.8264 26.375 15.2083 25.7083 15.4583C25.375 15.5972 25.0556 15.5903 24.75 15.4375C24.4444 15.2847 24.2361 15.0417 24.125 14.7083C24.0139 14.375 24.0278 14.0486 24.1667 13.7292C24.3056 13.4097 24.5417 13.1944 24.875 13.0833C25.375 12.9167 25.7847 12.5833 26.1042 12.0833C26.4236 11.5833 26.5833 11.0139 26.5833 10.375C26.5833 9.56944 26.3194 8.88889 25.7917 8.33333C25.2639 7.77778 24.6389 7.5 23.9167 7.5C23.1944 7.5 22.5694 7.74306 22.0417 8.22917C21.5139 8.71528 21.25 9.30556 21.25 10ZM18.75 30V10C18.75 9.30556 18.4931 8.71528 17.9792 8.22917C17.4653 7.74306 16.8333 7.5 16.0833 7.5C15.3611 7.5 14.7292 7.77778 14.1875 8.33333C13.6458 8.88889 13.375 9.56944 13.375 10.375C13.375 11.0139 13.5278 11.5764 13.8333 12.0625C14.1389 12.5486 14.5417 12.875 15.0417 13.0417C15.375 13.1528 15.6181 13.3681 15.7708 13.6875C15.9236 14.0069 15.9444 14.3194 15.8333 14.625C15.6944 14.9583 15.4653 15.2083 15.1458 15.375C14.8264 15.5417 14.5 15.5556 14.1667 15.4167C13.5 15.1944 12.9167 14.8264 12.4167 14.3125C11.9167 13.7986 11.5278 13.2083 11.25 12.5417C10.2778 12.625 9.40972 13.0347 8.64583 13.7708C7.88194 14.5069 7.5 15.4028 7.5 16.4583C7.5 17.5417 7.86111 18.4722 8.58333 19.25C9.30556 20.0278 10.1944 20.4167 11.25 20.4167C11.6111 20.4167 11.9097 20.5347 12.1458 20.7708C12.3819 21.0069 12.5 21.3056 12.5 21.6667C12.5 22.0278 12.3819 22.3264 12.1458 22.5625C11.9097 22.7986 11.6111 22.9167 11.25 22.9167C10.6111 22.9167 9.99306 22.8194 9.39583 22.625C8.79861 22.4306 8.25 22.1667 7.75 21.8333C7.66667 22.0556 7.60417 22.2917 7.5625 22.5417C7.52083 22.7917 7.5 23.0417 7.5 23.2917C7.5 24.4861 7.86806 25.4653 8.60417 26.2292C9.34028 26.9931 10.2361 27.375 11.2917 27.375C11.9028 27.375 12.4792 27.2361 13.0208 26.9583C13.5625 26.6806 14.0139 26.3056 14.375 25.8333C14.5972 25.5556 14.875 25.3819 15.2083 25.3125C15.5417 25.2431 15.8472 25.3194 16.125 25.5417C16.4028 25.7639 16.5764 26.0417 16.6458 26.375C16.7153 26.7083 16.6389 27.0139 16.4167 27.2917C16.0278 27.8472 15.5625 28.3125 15.0208 28.6875C14.4792 29.0625 13.8889 29.3611 13.25 29.5833C13.3056 30.25 13.5972 30.9028 14.125 31.5417C14.6528 32.1806 15.2917 32.5 16.0417 32.5C16.7917 32.5 17.4306 32.2569 17.9583 31.7708C18.4861 31.2847 18.75 30.6944 18.75 30Z"
              fill="black"
            />
          </svg>
          <h4 className="text-zinc-900 font-bold text-sm -ml-2">Remind</h4>
        </div>
  
        <div className="flex justify-end">
          <button onClick={handleMinimize} className="hover:bg-zinc-300">
            <VscChromeMinimize className="w-10 h-6 p-1.5 text-zinc-900" />
          </button>
          <button
            onClick={handleMaximizeRestore}
            className="hover:bg-zinc-300"
          >
            {winState === "maximized" ? (
              <VscChromeRestore className="w-10 h-6 p-1.5 text-zinc-900" />
            ) : (
              <VscChromeMaximize className="w-10 h-6 p-1.5 text-zinc-900" />
            )}
          </button>
          <button onClick={handleClose} className="hover:bg-red-600 group">
            <VscChromeClose className="w-10 h-6 p-1.5 text-zinc-900 group-hover:text-white" />
          </button>
        </div>
      </div>
    );
}

export default Titlebar