export const getNodeName = (filePath: string) => {
    if (!filePath) {
      return "";
    }
  
    const parts = filePath.split("\\");
    const lastPart = parts[parts.length - 1];
    return lastPart;
  };