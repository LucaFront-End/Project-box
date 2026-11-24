import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../ui/BrandLogo';
import { useBox } from '../../context/BoxContext';

export const Footer: React.FC = () => {
  const { openDistributorModal, openSearch, openDrawer } = useBox();

  return (
    <footer
      data-theme="dark"
      className="bg-[#070709] text-white border-t border-white/10 pt-16 pb-12"
    >
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <BrandLogo variant="light" size="lg" />
            </Link>
            <p className="text-xs sm:text-sm text-silver leading-relaxed max-w-[320px]">
              Tienda en línea B2B y B2C en México con stock sincronizado en videovigilancia, redes, control de acceso, radiocomunicación y energía solar.
            </p>
            <div className="text-xs text-silver/80 space-y-0.5 font-mono">
              <p>Envíos asegurados a todo México · Facturación fiscal</p>
              <p>Contacto comercial · hola@projectbox.mx</p>
            </div>
          </div>

          {/* Link Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs sm:text-[13px]">
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                Especialidades
              </p>
              <ul className="space-y-2 text-silver">
                <li>
                  <Link to="/especialidad/seguridad" className="hover:text-white transition-colors">
                    Videovigilancia & Seguridad IA
                  </Link>
                </li>
                <li>
                  <Link to="/especialidad/redes" className="hover:text-white transition-colors">
                    Redes & Conectividad 10G
                  </Link>
                </li>
                <li>
                  <Link to="/especialidad/energia" className="hover:text-white transition-colors">
                    Energía Solar & UPS
                  </Link>
                </li>
                <li>
                  <Link to="/especialidad/computo" className="hover:text-white transition-colors">
                    Cómputo, Servidores & Racks
                  </Link>
                </li>
                <li>
                  <Link to="/especialidad/iluminacion" className="hover:text-white transition-colors">
                    Iluminación LED Industrial
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                Tienda & Carrito
              </p>
              <ul className="space-y-2 text-silver">
                <li>
                  <Link to="/tienda" className="hover:text-white transition-colors">
                    Tienda completa
                  </Link>
                </li>
                <li>
                  <Link to="/sistema/PB-NET-01" className="hover:text-white transition-colors">
                    Núcleo UniFi 10G (PB-NET-01)
                  </Link>
                </li>
                <li>
                  <Link to="/sistema/PB-SEC-02" className="hover:text-white transition-colors">
                    Perímetro IA 4K (PB-SEC-02)
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openSearch('')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Buscador de SKUs (⌘K)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openDrawer}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Mi Carrito
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                Operación & B2B
              </p>
              <ul className="space-y-2 text-silver">
                <li>
                  <button
                    type="button"
                    onClick={openDistributorModal}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Programa de Distribuidores
                  </button>
                </li>
                <li>Envíos asegurados nacionales</li>
                <li>Políticas de garantía y RMA</li>
                <li>Transferencia SPEI / Efectivo</li>
                <li>Mercado Pago & Mercado Crédito</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Payment Chips */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-silver/70">
          <p>
            © {new Date().getFullYear()} PROJECT BOX. · Infraestructura preparada para Wix Headless.
          </p>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
            {['SPEI', 'VISA / MC', 'MERCADO PAGO', 'MERCADO CRÉDITO', 'ENVÍO ASEGURADO MX'].map(
              (chip) => (
                <span
                  key={chip}
                  className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/70"
                >
                  {chip}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
