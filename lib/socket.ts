import { io } from "socket.io-client";

const socketIoServerUrl = "https://grxnd-quiz-rooms.onrender.com";
const socket = io(socketIoServerUrl);
export default socket;