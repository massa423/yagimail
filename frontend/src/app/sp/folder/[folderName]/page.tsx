"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import MailList from "../../components/MailList";
import { emails as email_data, type MailItem } from "../../../lib/data/emails";

interface FolderPageProps {
  params: {
    folderName: string;
  };
}

export default function FolderPage({ params }: FolderPageProps) {
  const router = useRouter();
  const folderName = decodeURIComponent(params.folderName);
  const [activeNavItem, setActiveNavItem] = useState("home");

  const [emails] = useState<MailItem[]>(email_data);

  const handleBackClick = () => {
    router.push("/sp");
  };

  const handleNavClick = (itemId: string) => {
    setActiveNavItem(itemId);
    if (itemId === "home") {
      router.push("/sp");
    }
  };

  const handleMailClick = (emailId: string) => {
    console.log("Mail clicked:", emailId);
  };

  const handleStarClick = (emailId: string) => {
    console.log("Star clicked:", emailId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={folderName}
        showBackButton={true}
        onBackClick={handleBackClick}
      />

      <MailList
        emails={emails}
        onMailClick={handleMailClick}
        onStarClick={handleStarClick}
      />

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavClick}
      />

      <div className="h-16"></div>
    </div>
  );
}
