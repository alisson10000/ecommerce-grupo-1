import React, { useState } from "react";
import ChatbotWindow from "./ChatbotWindow";
import { useTheme } from "../../ThemeContext";
import "./Chatbot.css";

const ChatbotWidget: React.FC = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão Flutuante */}
      <button
        className={`chatbot-button ${isDark ? "dark-mode" : "light-mode"} ${
          isOpen ? "active" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        title="Abrir assistente de chat"
      >
        <span className="chatbot-icon">💬</span>
      </button>

      {/* Janela do Chat */}
      <ChatbotWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatbotWidget;
