import React, {
    FC,
    createContext,
    useContext,
    useState,
  } from "react";
  
  export interface ExplorerContextType {
    isExplorerOpen: boolean
    setIsExplorerOpen: (isOpen: boolean) => void
  }
  
  interface ExplorerContextProviderProps {
    children: React.ReactNode;
  }
  
  export const ExplorerContext = createContext<ExplorerContextType>({
    isExplorerOpen: true,
    setIsExplorerOpen: () => {}
  });
  
  export function useExplorerContext() {
    const context = useContext(ExplorerContext);
  
    if (!context)
      throw new Error(
        `Context 'ExplorerContext' is null. Did you use <ExplorerContextProvider>?`
      );
  
    return context;
  }
  
  export const ExplorerContextProvider: FC<ExplorerContextProviderProps> = ({
    children,
  }) => {
    const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  
    return (
      <ExplorerContext.Provider
        value={{
          isExplorerOpen,
          setIsExplorerOpen
        }}
      >
        {children}
      </ExplorerContext.Provider>
    );
  };
  