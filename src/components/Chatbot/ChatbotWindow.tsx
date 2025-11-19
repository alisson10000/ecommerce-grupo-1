import React, { useState, useRef, useEffect } from "react";
import chatbotService, { ChatMessage } from "../../services/chatbot";
import { useTheme } from "../../ThemeContext";
import "./Chatbot.css";

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotWindow: React.FC<ChatbotWindowProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carrega histórico ao abrir
  useEffect(() => {
    if (isOpen) {
      const history = chatbotService.loadChatHistory();
      setMessages(history);
    }
  }, [isOpen]);

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Adiciona mensagem do usuário
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Envia para o chatbot
      const botReply = await chatbotService.sendMessage(input);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botReply,
        sender: "bot",
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      chatbotService.saveChatHistory(finalMessages);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Desculpe, houve um erro ao processar sua mensagem. Tente novamente.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Deseja limpar o histórico do chat?")) {
      setMessages([]);
      chatbotService.clearChatHistory();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`chatbot-window ${isDark ? "dark-mode" : "light-mode"}`}>
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-title">
          <span>Assistente Inteligente</span>
        </div>
        <div className="chatbot-controls">
          <button
            className="btn-clear"
            onClick={handleClearChat}
            title="Limpar histórico"
          >
            🗑️
          </button>
          <button className="btn-close" onClick={onClose}>
            
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chatbot-messages">
        {messages.length === 0 ? (
          <div className="chatbot-empty">
            <p>Olá! Como posso ajudá-lo?</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`chatbot-message ${msg.sender}`}>
              <div className="message-content">
                {msg.sender === "bot" && <span className="bot-icon">🤖</span>}
                <p>{msg.text}</p>
              </div>
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
        {isLoading && (
          <div className="chatbot-message bot">
            <div className="message-content">
              <span className="bot-icon">🤖</span>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="chatbot-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={isLoading}
          className="chatbot-input"
        />
        <button type="submit" disabled={isLoading} className="chatbot-send">
          📤
        </button>
      </form>
    </div>
  );
};

export default ChatbotWindow;
