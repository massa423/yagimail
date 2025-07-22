export const generateMailDetailPath = (folderName: string, emailId: string): string => {
  return `/sp/folder/${encodeURIComponent(folderName)}/mail/${emailId}`;
};