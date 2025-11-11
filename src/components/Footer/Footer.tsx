import React from "react";
import { ClockIcon, PhoneIcon, EmailIcon, LocationIcon } from "../Icons/icons";

const Footer: React.FC = () => {
  return (
    <footer
      className="mt-5 text-white py-4 shadow-inner"
      style={{
        background: "linear-gradient(90deg, #0d6efd, #004aad)", // 🔵 Gradiente azul institucional
      }}
    >
      <div className="container-fluid"> {/* ✅ ALTERADO de container para container-fluid */}
        {/* GRID PRINCIPAL */}
        <div className="row mb-4 justify-content-center">
          {/* LINKS ÚTEIS */}
          <div className="col-12 col-md-5 mb-3">
            <h5 className="fw-semibold mb-2">Links Úteis</h5>
            <ul className="list-unstyled small mb-0">
              <li className="mb-1">
                <a href="/products" className="link-light text-decoration-none">
                  Produtos
                </a>
              </li>
              <li className="mb-1">
                <a href="/categories" className="link-light text-decoration-none">
                  Categorias
                </a>
              </li>
              <li className="mb-1">
                <a href="/clientes" className="link-light text-decoration-none">
                  Área do Cliente
                </a>
              </li>
              <li className="mb-1">
                <a href="/users" className="link-light text-decoration-none">
                  Portal do Vendedor
                </a>
              </li>
            </ul>
          </div>

          {/* CONTATO */}
          <div className="col-12 col-md-5 mb-3">
            <h5 className="fw-semibold mb-2">Entre em Contato</h5>
            <ul className="list-unstyled small mb-0">
              <li className="d-flex align-items-center mb-1">
                <ClockIcon className="me-2" style={{ width: 16, height: 16 }} />
                Segunda a Sexta: 9h às 18h
              </li>
              <li className="d-flex align-items-center mb-1">
                <PhoneIcon className="me-2" style={{ width: 16, height: 16 }} />
                Tel: (24) 9999-9999
              </li>
              <li className="d-flex align-items-center mb-1">
                <EmailIcon className="me-2" style={{ width: 16, height: 16 }} />
                contato@serratec.com
              </li>
              <li className="d-flex align-items-center mb-1">
                <LocationIcon className="me-2" style={{ width: 16, height: 16 }} />
                Petrópolis, RJ
              </li>
            </ul>

            {/* REDES SOCIAIS */}
            <div className="mt-2 d-flex gap-3 small">
              <a href="#" className="link-light text-decoration-none">
                LinkedIn
              </a>
              <a href="#" className="link-light text-decoration-none">
                Instagram
              </a>
              <a href="#" className="link-light text-decoration-none">
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* LINHA DIVISÓRIA + DIREITOS */}
        <hr className="border-light opacity-25" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center text-white-50 small">
          <div className="fw-medium mb-2 mb-sm-0">
            © {new Date().getFullYear()} Serratec E-Commerce. Todos os direitos reservados.
          </div>

          <div className="d-flex gap-3">
            <a href="#" className="link-light text-decoration-none">
              Termos de Uso
            </a>
            <a href="#" className="link-light text-decoration-none">
              Política de Privacidade
            </a>
            <a href="#" className="link-light text-decoration-none">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
