import { Outlet } from "react-router-dom";
import Titlebar from "./components/Titlebar.tsx";
import { useState } from "react";
import Menu from "./components/Menu.tsx";

function App() {
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen">
      <Titlebar />
      <div className="flex h-full">
        <Menu
          isFileTreeOpen={isFileTreeOpen}
          openCloseFileTree={() => setIsFileTreeOpen(!isFileTreeOpen)}
        />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
