"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, BottomNavigation } from "../../../../components";
import { MailList } from "../../../../features/emails";
import { emails, type MailItem } from "../../../../lib/data/emails";
import { decodeRouterPath } from "../../../../utils/navigation";

interface FolderPageProps {
  params: {
    folderName: string;
  };
}

export default function FolderPage({ params }: FolderPageProps) {
  const router = useRouter();
  const folderName = decodeRouterPath(params.folderName);
  const [activeNavItem, setActiveNavItem] = useState("home");

  const [emailList] = useState<MailItem[]>(emails);

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
    router.push(`/sp/folder/${encodeURIComponent(folderName)}/mail/${emailId}`);
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
        emails={emailList}
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
