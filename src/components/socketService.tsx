// socketService.js
import socketIOClient from "socket.io-client";

const API_URL = "http://143.248.219.4:8080";
const socket = socketIOClient(`${API_URL}/socket.io`);

const connectToSocket = () => {
  console.log("connect to socket");
  socket.connect();
  console.log(socket.id);
};

const test = () => {
  console.log("test");
  socket.emit("test");
  console.log(socket.id);
}

// const joinRoom = () => {
//   const room_id = 'yourRoomId'; // Replace with the actual room ID
//   socket.emit('join_room', { room_id });
//   console.log(socket.id)
// };

const handleLeaveRoom = () => {
  const room_id = 'yourRoomId'; // Replace with the actual room ID
  socket.emit('leave_room', { room_id });
};

const joinRoom = (rooms: string[]) => {
  console.log("join_room");
  rooms.map((room_id) => {
    socket.emit("join_room", {room_id});
    console.log(socket.id);
  });
}

const emitEvent = (eventName, data) => {
  console.log("emit_event", eventName);
  socket.emit(eventName, data);
  console.log(socket.id);
};

export { connectToSocket, test, joinRoom, emitEvent };
