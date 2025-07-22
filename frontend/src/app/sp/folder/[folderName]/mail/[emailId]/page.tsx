"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, BottomNavigation } from "../../../../../../components";
import { emails } from "../../../../../../lib/data/emails";
import { decodeRouterPath } from "../../../../../../utils/navigation";
import { MailDetail } from "../../../../../../features/emails";

interface MailDetailPageProps {
  params: {
    folderName: string;
    emailId: string;
  };
}

export default function MailDetailPage({ params }: MailDetailPageProps) {
  const router = useRouter();
  const folderName = decodeRouterPath(params.folderName);
  const emailId = params.emailId;
  const [activeNavItem, setActiveNavItem] = useState("home");

  // Find the specific email by ID
  const email = emails.find(e => e.id === emailId);

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">メールが見つかりません</p>
      </div>
    );
  }

  const handleBackClick = () => {
    router.push(`/sp/folder/${encodeURIComponent(folderName)}`);
  };

  const handleNavClick = (itemId: string) => {
    setActiveNavItem(itemId);
    if (itemId === "home") {
      router.push("/sp");
    }
  };

  const handleReplyClick = () => {
    console.log("Reply clicked for email:", emailId);
  };

  const handleForwardClick = () => {
    console.log("Forward clicked for email:", emailId);
  };

  const handleDeleteClick = () => {
    console.log("Delete clicked for email:", emailId);
  };

  const handleStarToggle = () => {
    console.log("Star toggled for email:", emailId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={email.subject}
        showBackButton={true}
        onBackClick={handleBackClick}
      />

      <MailDetail
        email={email}
        onReplyClick={handleReplyClick}
        onForwardClick={handleForwardClick}
        onDeleteClick={handleDeleteClick}
        onStarToggle={handleStarToggle}
      />

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavClick}
      />

      <div className="h-16"></div>
    </div>
  );
}