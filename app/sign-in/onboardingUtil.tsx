import { BookCopy, GraduationCap, HandMetal, UsersRound } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa6"

type OnboardingObjectChannel = {
   icon: React.ReactNode;
   channel: ReferralChannel;
   label: string;
}

type OnboardingObjectStudentTypes = {
   icon: React.ReactNode;
   studentType: StudentType;
   label: string;
}

const iconProps = { size: 24 };

export const referralChannels: OnboardingObjectChannel[] = [
   { label: "TikTok", icon: <><FaTiktok {...iconProps} /></>, channel: "tiktok" },
   { label: "Instagram", icon: <><FaInstagram {...iconProps} /></>, channel: "instagram" },
   { label: "Friends", icon: <><UsersRound {...iconProps} /></>, channel: "friends" },
   { label: "Other", icon: <><HandMetal {...iconProps} /></>, channel: "other" },
]

export const studentTypes: OnboardingObjectStudentTypes[] = [
   { label: "High School", icon: <><BookCopy {...iconProps} /></>, studentType: "high-school" },
   { label: "University", icon: <><GraduationCap {...iconProps} /></>, studentType: "uni" },
]