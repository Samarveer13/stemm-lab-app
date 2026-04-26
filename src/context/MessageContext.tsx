import React, { createContext, useContext, useState } from "react";

interface MessageContextType {
  message: string | null;
  sendMessage: (msg: string) => void;
  clearMessage: () => void;
}

const MessageContext = createContext<MessageContextType>({
  message: null,
  sendMessage: () => {},
  clearMessage: () => {},
});

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  function sendMessage(msg: string) {
    console.log("Broadcast message:", msg);
    setMessage(msg);
  }

  function clearMessage() {
    setMessage(null);
  }

  return (
    <MessageContext.Provider value={{ message, sendMessage, clearMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export const useMessage = () => useContext(MessageContext);