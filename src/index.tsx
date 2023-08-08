import useWebSocket from "mkdm-react-websocket-hook";
import { useEffect, useState } from "react";

interface SocketChat {
  url: string;
  corsOrigin: string;
  socketServerPath: string;
  stateUpdateCallback: () => any;
  receiver: string;
  user: string;
}

function useSocketChat({
  url,
  corsOrigin,
  socketServerPath,
  stateUpdateCallback,
  receiver,
  user,
}: SocketChat) {
  const { emit, listen, stopListening } = useWebSocket({
    url,
    corsOrigin,
    socketServerPath,
    stateUpdateCallback,
  });
  const [messages, setMessages] = useState([]);

  // send message
  const sendMessage = (message: string) => {
    emit(user + ":" + receiver, message);
  };

  // get messages
  const getMessages = () => {
    emit("get_messages", {
      sender: user,
      receiver: receiver,
    });
  };

  useEffect(() => {
    listen(user + ":" + receiver, (data: any) => {
      setMessages(messages.concat(data));
    });
  }, []);

  useEffect(() => {
    getMessages();

    return () => {
      stopListening(user + ":" + receiver);
    };
  }, [messages]);

  return {
    sendMessage,
    messages,
    stateUpdateCallback,
  };
}
export { useSocketChat };
