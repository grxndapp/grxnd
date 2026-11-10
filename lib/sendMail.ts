"use server"
import { render } from "@react-email/components";
import { ReactNode } from "react";
import nodemailer from "nodemailer";
import CancelledSubscriptionEmail from "@/emails/CancelledSubscriptionEmail";
import WelcomeToGrxndEmail from "@/emails/WelcomeEmail";

export default async function sendMail (to: string, subject: string, content: ReactNode) {
   try {
      const emailBody = await render(content);
      const transporter = nodemailer.createTransport({
         service: "gmail",
         secure: true,
         host: "smtp.gmail.com",
         port: 465,
         auth: {
            user: 'grxndapp@gmail.com',
            pass: process.env.GOOGLE_APP_PASSWORD!
         },
      });
   
      await transporter.sendMail({
         from: `"Grxnd Team" <grxndapp@gmail.com>`,
         to, subject, html: emailBody
      });
      return true;
   } catch (e) {
      return false;
   }
}

export async function sendSubscriptionCancellationEmail (user: Partial<User>) {
   try {
      await sendMail(
         user.email!, `Your Grxnd Subscription Has Been Cancelled`,
         CancelledSubscriptionEmail({ username: user.name! })
      );
   } catch (err) {
      console.error(err);
   }
}

export async function sendSubscriptionSuccessEmail (user: Partial<User>) {
   try {
      await sendMail(
         user.email!, `Your Grxnd Subscription Is Active`,
         WelcomeToGrxndEmail({ username: user.name! })
      );
   } catch (err) {
      console.error(err);
   }
}