import { referralChannels, studentTypes } from "@/app/sign-in/onboardingUtil";
import { cookies } from "next/headers";

export function parseSignupData (raw: string | undefined): {referralChannel: ReferralChannel; studentType: StudentType;} | null {
   if (!raw) return null;

   try {
      const data = JSON.parse(decodeURIComponent(raw));
      if (!data || typeof data !== "object") return null;

      const allowedSources = referralChannels.map(c => c.channel);
      const allowedStudentTypes = studentTypes.map(s => s.studentType);

      if (!allowedSources.includes(data.referralSource)) return null;
      if (!allowedSources.includes(data.studentType)) return null;

      return {
         referralChannel: data.referralChannel,
         studentType: data.studentType,
      };
   } catch {
      return null;
   }
}