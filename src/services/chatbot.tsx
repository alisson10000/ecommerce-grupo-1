import api from "../config/api";

// ⚠️ CONFIGURE AQUI A URL DA API DE CHATBOT
const CHATBOT_API_URL =
  process.env.REACT_APP_CHATBOT_API || "http://localhost:8000";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

class ChatbotService {
  /**
   * Envia uma mensagem para o chatbot e retorna a resposta
   * @param message - Texto da mensagem do usuário
   * @returns Resposta do chatbot
   */
  async sendMessage(message: string): Promise<string> {
    try {
      const response = await api.post(`${CHATBOT_API_URL}/chat`, {
        message: message,
        userId: this.getUserId(),
      });

      return (
        response.data.reply || "Desculpe, não consegui processar sua mensagem."
      );
    } catch (error) {
      console.error("Erro ao comunicar com chatbot:", error);
      throw new Error(
        "Erro ao conectar com o chatbot. Tente novamente mais tarde."
      );
    }
  }

  /**
   * Obtém o ID do usuário para rastreamento de conversa
   */
  private getUserId(): string {
    let userId = localStorage.getItem("chatUserId");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      localStorage.setItem("chatUserId", userId);
    }
    return userId;
  }

  /**
   * Salva histórico de chat no localStorage
   */
  saveChatHistory(messages: ChatMessage[]): void {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }

  /**
   * Carrega histórico de chat do localStorage
   */
  loadChatHistory(): ChatMessage[] {
    const history = localStorage.getItem("chatHistory");
    return history ? JSON.parse(history) : [];
  }

  /**
   * Limpa o histórico de chat
   */
  clearChatHistory(): void {
    localStorage.removeItem("chatHistory");
  }
}

export default new ChatbotService();
