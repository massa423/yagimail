import { useState, useCallback } from 'react';
import { emails as initialEmails, type MailItem } from '../lib/data/emails';

export const useEmailState = () => {
  const [emails, setEmails] = useState<MailItem[]>(initialEmails);

  const toggleStar = useCallback((emailId: string) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === emailId
          ? { ...email, isStarred: !email.isStarred }
          : email,
      ),
    );
  }, []);

  const getEmailById = useCallback(
    (emailId: string) => {
      return emails.find((email) => email.id === emailId);
    },
    [emails],
  );

  return {
    emails,
    toggleStar,
    getEmailById,
  };
};
