// Tipagem dos produtos compatível com o backend em Spring Boot
export interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  categoria?: {
    id: number;
    nome: string;
  };
  foto?: string; // URL da imagem do produto (ex: http://localhost:8080/uploads/produtos/1.jpg)
}

// Tipagem simples de usuário (vendedor ou cliente logado)
export interface User {
  name: string;
}

// Item de carrinho herda de Product
export interface CartItem extends Product {
  quantity: number;
}
