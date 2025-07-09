export const encodeRouterPath = (path: string): string => {
  return encodeURIComponent(path);
};

export const decodeRouterPath = (path: string): string => {
  return decodeURIComponent(path);
};

export const generateFolderPath = (folderName: string): string => {
  return `/sp/folder/${encodeRouterPath(folderName)}`;
};