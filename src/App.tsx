import { Outlet } from "react-router-dom";
import Titlebar from "./components/Titlebar.tsx";
import Menu from "./components/Menu.tsx";
import { ExplorerContextProvider } from "./context/ExplorerContext.tsx";

function App() {
  return (
    <div
      className="flex flex-col h-screen"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Titlebar />
      <div className="flex h-full">
        <ExplorerContextProvider>
          <Menu
            
          />
          <Outlet />
        </ExplorerContextProvider>
      </div>
    </div>
  );
}

export default App;
