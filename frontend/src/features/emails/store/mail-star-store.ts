import { create } from 'zustand';

type MailStarStore = {
  starredMap: Record<string, boolean>;
  initStars: (emails: { id: string; isStarred: boolean }[]) => void;
  toggleStar: (mailId: string) => void;
  setStar: (mailId: string, isStarred: boolean) => void;
};

export const useMailStarStore = create<MailStarStore>((set) => ({
  starredMap: {},
  initStars: (emails) =>
    set((state) => {
      const map = { ...state.starredMap };
      for (const { id, isStarred } of emails) {
        if (!(id in map)) map[id] = isStarred;
      }
      return { starredMap: map };
    }),
  toggleStar: (mailId) =>
    set((state) => ({
      starredMap: { ...state.starredMap, [mailId]: !state.starredMap[mailId] },
    })),
  setStar: (mailId, isStarred) =>
    set((state) => ({
      starredMap: { ...state.starredMap, [mailId]: isStarred },
    })),
}));
