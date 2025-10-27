declare module '*.css'

type SubjectTopicsListByLevels = {
   national5: string[];
   higher: string[];
   advancedHigher: string[];
};

type SubjectTopicsList = Record<string, SubjectTopicsListByLevels>;

type User = {
   id: number;
   userid: string;
   name: string;
   email: string;
   password: string;
   oauth_provider: string;
   user_role: "user" | "admin";
   is_subscribed: boolean;
   createdAt: Date;
}

type UserGraphDetails = {
   name: string;
   oauth_provider: string;
   is_subscribed: boolean;
   createdAt: Date;
}

type UserDetails = {
   userid: string;
   name: string;
   email: string;
   oauth_provider: string;
   user_role: "user" | "admin";
   is_subscribed: boolean;
   createdAt: Date;
}

type QuizT = {
   id: number;
   userid: string;
   subjectLevel: string;
   subject: string;
   topic: string;
   score: number;
   createdAt: Date;
}
type QuizT = quizzesTable.$in

type Note = {
   id: number;
   userid: string;
   noteid: string;
   noteJson: string;
   createdAt: Date;
}