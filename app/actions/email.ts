'use server'
import { render } from '@react-email/components';
import { ReactNode } from 'react';
import { Resend } from 'resend';
import { getCurrentUser } from './user';
import VerifyEmail from '@/emails/VerifyEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmailFromGrxnd (receivingEmail: string, subject: string, content: ReactNode) {
   try {
      const emailBody = await render(content);
      const { data, error } = await resend.emails.send({
         from: 'grxndapp@grxnd.app',
         to: receivingEmail,
         subject: subject,
         html: emailBody
      });
      return error ? false : true;
   } catch (err) {
      return false;
   }
}

export async function sendVerificationEmailFromGrxnd (receivingEmail: string) {
   try {
      const user = await getCurrentUser();
      if (!user) return false;
      const verifyAccountLink = `/verify-user/${user.userid}`;
      const emailBody = await render(VerifyEmail({ username: user.name, verifyLink: verifyAccountLink }));
      const { data, error } = await resend.emails.send({
         from: 'grxndapp@grxnd.app',
         to: receivingEmail,
         subject: "Verify Your Grxnd Account",
         html: emailBody
      });
      return error ? false : true;
   } catch (err) {
      return false;
   }
}