// ChatView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { connectWebSocket, sendPrivateMessage } from "../socketService";
import axios from "axios";


export default function ChatView() {
  const { friendUsername } = useParams(); // lấy từ URL /chat/:friendUsername
  const username = localStorage.getItem("username"); // user hiện tại

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!friendUsername) return;

    // 1. Lấy lịch sử chat từ API
    axios.get(`http://localhost:8081/messages?user1=${username}&user2=${friendUsername}`)
      .then(res => setMessages(res.data));

    // 2. Kết nối WebSocket
    connectWebSocket(username, (msg) => {
      if (
        (msg.senderName === username && msg.recipientName === friendUsername) ||
        (msg.senderName === friendUsername && msg.recipientName === username)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    });
  }, [username, friendUsername]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const msg = {
      senderName: username,
      recipientName: friendUsername,
      content: text,
      timestamp: new Date(),
    };

    sendPrivateMessage(msg);
    setMessages(prev => [...prev, msg]);
    setText("");
  };

  if (!friendUsername) {
    return <div className="p-6 text-gray-500">Chọn 1 bạn bè để chat</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-6 border border-gray-300 rounded-lg shadow-md p-4 bg-white">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">
        Chat với <span className="text-blue-600">{friendUsername}</span>
      </h2>

      <div className="h-64 overflow-y-auto border border-gray-200 rounded-md mb-3 p-2 bg-gray-50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`my-1 p-2 rounded-lg text-sm max-w-[75%] ${
              m.senderName === username
                ? "bg-blue-500 text-white ml-auto text-right"
                : "bg-gray-200 text-gray-800 mr-auto text-left"
            }`}
          >
            <div className="font-medium">{m.senderName}</div>
            <div>{m.content}</div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
