'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { emails as initialEmails, type MailItem } from '../lib/data/emails';

interface EmailContextType {
  emails: MailItem[];
  toggleStar: (emailId: string) => void;
  getEmailById: (emailId: string) => MailItem | undefined;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

interface EmailProviderProps {
  children: ReactNode;
}

export const EmailProvider = ({ children }: EmailProviderProps) => {
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

  const value = {
    emails,
    toggleStar,
    getEmailById,
  };

  return (
    <EmailContext.Provider value={value}>{children}</EmailContext.Provider>
  );
};

export const useEmailContext = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmailContext must be used within an EmailProvider');
  }
  return context;
};
