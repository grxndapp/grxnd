import { redirect } from "next/navigation"
import {
  createErrorReturn,
  createSuccessReturn,
  DalError,
  DalReturn,
  ThrowableDalError,
} from "./types"
import { usersTable } from "@/db/schemas"
import { getCurrentUser } from "@/app/actions/user"
import { DrizzleQueryError } from "drizzle-orm"


export async function dalRequireAuthRedirect() {
   const user = await getCurrentUser();
   if (user == null) redirect("/sign-in");
   return {
      userid: user.userid,
      name: user.name,
      email: user.email,
      oauth_provider: user.oauth_provider,
      user_role: user.user_role,
      is_subscribed: user.is_subscribed,
      createdAt: user.createdAt
   };
}

export async function dalRequireSubscriber() {
   const user = await getCurrentUser();
   if (user == null) redirect("/sign-in");
   if (!user.is_subscribed) redirect("/pricing");
}

export async function dalRequireAdmin() {
   const user = await getCurrentUser();
   if (user == null) redirect("/sign-in");
   if (user.user_role == "user") redirect("/home");
}

export async function dalRequireAdminAuth<T, E extends DalError>(
  operation: (user: typeof usersTable.$inferSelect) => Promise<DalReturn<T, E>>,
) {
   const user = await getCurrentUser();

   if (user == null) return createErrorReturn({ type: "no-user" });
   if (user.user_role == "user") return createErrorReturn({ type: "no-access" });

   return await operation(user);
}

export async function dalCheckUserSubscription(): Promise<"no-user" | "not-subscribed" | "subscribed"> {
   const user = await getCurrentUser();
   if (user == null) return "no-user";
   if (!user.is_subscribed) return "not-subscribed";
   return "subscribed"
}

export async function dalRequireSubscribedAuth<T, E extends DalError>(
  operation: (user: typeof usersTable.$inferSelect) => Promise<DalReturn<T, E>>,
) {
   const user = await getCurrentUser();

   if (user == null) return createErrorReturn({ type: "no-user" });
   if (!user.is_subscribed) redirect("/pricing");

   return await operation(user);
}

export async function dalRequireAuth<T, E extends DalError>(
  operation: (user: typeof usersTable.$inferSelect) => Promise<DalReturn<T, E>>,
  { allowedRoles }: { allowedRoles?: string[] } = {},
) {
   const user = await getCurrentUser();

   if (user == null) return createErrorReturn({ type: "no-user" });
   if (allowedRoles && !allowedRoles.includes(user.user_role)) return createErrorReturn({ type: "no-access" });

   return await operation(user);
}

export async function dalDbOperation<T>(operation: () => Promise<T>) {
   try {
      const data = await operation();
      return createSuccessReturn(data);
   } catch (e) {
      if (e instanceof ThrowableDalError) {
         return createErrorReturn(e.dalError)
      }
      if (e instanceof DrizzleQueryError) {
         return createErrorReturn({ type: "drizzle-error", error: e })
      }
      return createErrorReturn({ type: "unknown-error", error: e })
   }
}

export function dalFormatErrorMessage(error: DalError) {
   const type = error.type

   switch (error.type) {
      case "no-user":
         return "You must be logged in to perform this action."
      case "no-access":
         return "You do not have permission to perform this action."
      case "drizzle-error":
         return `A database error occurred`
      case "unknown-error":
         return `An unknown error occurred`
      default:
         throw new Error(`Unhandled error type: ${type as never}`)
   }
}