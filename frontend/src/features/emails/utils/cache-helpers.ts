import { type InfiniteData } from '@tanstack/react-query';
import { type MailDetail, type MailFolder, type MailItem } from '@/types/mail';

type MailPages = InfiniteData<MailItem[], number>;

export function mapMailInPages(
  data: MailPages | undefined,
  predicate: (mail: MailItem) => boolean,
  update: (mail: MailItem) => MailItem,
): MailPages | undefined {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) =>
      page.map((mail) => (predicate(mail) ? update(mail) : mail)),
    ),
  };
}

export function removeFromPages(
  data: MailPages | undefined,
  ids: ReadonlySet<string>,
): MailPages | undefined {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => page.filter((mail) => !ids.has(mail.id))),
  };
}

export function setStarInPages(
  data: MailPages | undefined,
  mailId: string,
  isStarred: boolean,
): MailPages | undefined {
  return mapMailInPages(
    data,
    (m) => m.id === mailId,
    (m) => ({ ...m, isStarred }),
  );
}

export function flipStarInPages(
  data: MailPages | undefined,
  mailId: string,
): MailPages | undefined {
  return mapMailInPages(
    data,
    (m) => m.id === mailId,
    (m) => ({ ...m, isStarred: !m.isStarred }),
  );
}

export function setReadInPages(
  data: MailPages | undefined,
  mailIds: ReadonlySet<string>,
  isRead: boolean,
): MailPages | undefined {
  return mapMailInPages(
    data,
    (m) => mailIds.has(m.id),
    (m) => ({ ...m, isRead }),
  );
}

// Counts mails currently in cache that match given ids and would actually flip
// when set to `isRead` (i.e. their current isRead is the opposite). Used to
// compute the unread-count delta for the folder cache.
export function countAffectedRead(
  data: MailPages | undefined,
  mailIds: ReadonlySet<string>,
  isRead: boolean,
): number {
  if (!data) return 0;
  let count = 0;
  for (const page of data.pages) {
    for (const mail of page) {
      if (mailIds.has(mail.id) && mail.isRead !== isRead) {
        count++;
      }
    }
  }
  return count;
}

// Counts how many of the given mails are currently unread in the cache.
// Used when moving to trash to decrement folder.messagesUnread accordingly.
export function countUnreadIn(
  data: MailPages | undefined,
  mailIds: ReadonlySet<string>,
): number {
  if (!data) return 0;
  let count = 0;
  for (const page of data.pages) {
    for (const mail of page) {
      if (mailIds.has(mail.id) && !mail.isRead) {
        count++;
      }
    }
  }
  return count;
}

export function adjustFolder(
  folders: MailFolder[] | undefined,
  folderId: string,
  patch: (f: MailFolder) => MailFolder,
): MailFolder[] | undefined {
  if (!folders) return folders;
  return folders.map((f) => (f.id === folderId ? patch(f) : f));
}

// `setQueryData` on a missing key is a no-op in TanStack Query v5, so callers
// can update both list and detail cache unconditionally without defensive checks.
export function patchDetail(
  detail: MailDetail | null | undefined,
  patch: Partial<MailDetail>,
): MailDetail | null | undefined {
  if (!detail) return detail;
  return { ...detail, ...patch };
}
