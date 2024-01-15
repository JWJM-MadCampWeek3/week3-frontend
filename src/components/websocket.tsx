import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext<{ socket: WebSocket | null, setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>> }>({
  socket: null,
  setSocket: () => {}
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Clean up the socket when the context provider unmounts
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};
