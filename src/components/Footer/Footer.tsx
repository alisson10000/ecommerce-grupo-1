import React from 'react';
import { ClockIcon, PhoneIcon, EmailIcon, LocationIcon } from '../Icons/icons';

const Footer: React.FC = () => {
  return (
    <footer className="mt-4 bg-primary text-white py-4">
      <div className="container">
        {/* Grid principal */}
        <div className="row mb-4 justify-content-center">
          <div className="col-md-6 col-12">
            {/* Links Úteis */}
            <div>
              <h3 className="h5 fw-semibold mb-2">Links Úteis</h3>
              <ul className="list-unstyled small">
                <li>
                  <a href="/products" className="text-light text-decoration-none">
                    Produtos
                  </a>
                </li>
                <li>
                  <a href="/categories" className="text-light text-decoration-none">
                    Categorias
                  </a>
                </li>
                <li>
                  <a href="/clientes" className="text-light text-decoration-none">
                    Área do Cliente
                  </a>
                </li>
                <li>
                  <a href="/users" className="text-light text-decoration-none">
                    Portal do Vendedor
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-6 col-12">
            {/* Contato */}
            <div>
              <h3 className="h5 fw-semibold mb-2">Entre em Contato</h3>
              <ul className="list-unstyled small text-light">
                <li className="d-flex align-items-center mb-1">
                  <ClockIcon className="me-2" style={{ width: '16px', height: '16px' }} />
                  <span>Segunda a Sexta: 9h às 18h</span>
                </li>
                <li className="d-flex align-items-center mb-1">
                  <PhoneIcon className="me-2" style={{ width: '16px', height: '16px' }} />
                  <span>Tel: (24) 9999-9999</span>
                </li>
                <li className="d-flex align-items-center mb-1">
                  <EmailIcon className="me-2" style={{ width: '16px', height: '16px' }} />
                  <span>Email: contato@serratec.com</span>
                </li>
                <li className="d-flex align-items-center mb-1">
                  <LocationIcon className="me-2" style={{ width: '16px', height: '16px' }} />
                  <span>Petrópolis, RJ</span>
                </li>
              </ul>
              <div className="mt-2 d-flex gap-3">
                <a href="#" className="small text-light text-decoration-none">
                  LinkedIn
                </a>
                <a href="#" className="small text-light text-decoration-none">
                  Instagram
                </a>
                <a href="#" className="small text-light text-decoration-none">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória mais sutil */}
        <hr className="my-3" />
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small">
          <div className="fw-medium mb-2 mb-sm-0">
            © {new Date().getFullYear()} Serratec E-Commerce. Todos os direitos reservados.
          </div>
          <div className="d-flex gap-3 text-light">
            <a href="#" className="text-decoration-none">Termos de Uso</a>
            <a href="#" className="text-decoration-none">Política de Privacidade</a>
            <a href="#" className="text-decoration-none">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;