import { v4 } from "uuid";
import crypto from "crypto";

export function uuid () {
   return v4();
}

export function createTournamentCode () {
   const alphabets = "qaplytwxndojkbmsfuzrcviehg";
   const time = `${Date.now()}`.split("").toReversed().slice(0,4);
   
   let letters = '';
   for (let i = 0; i < 3; i++) {
      letters += `${alphabets[Math.floor(Math.random() * alphabets.length)]}`;
   }

   return `${letters}${time.join("")}`;
}

export function hashPwd (pwd: string) {
   return crypto.createHash('sha1').update(pwd).digest('hex');
}