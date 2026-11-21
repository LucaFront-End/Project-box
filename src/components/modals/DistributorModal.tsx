import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { useBox } from '../../context/BoxContext';
import { catalogProvider } from '../../services/wixHeadlessAdapter';
import { VerticalId } from '../../types/commerce';
import { VERTICALS } from '../../data/catalog';

export const DistributorModal: React.FC = () => {
  const { isDistributorModalOpen, closeDistributorModal } = useBox();
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [primaryVertical, setPrimaryVertical] = useState<VerticalId>('seguridad');
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await catalogProvider.submitDistributorLead({
      fullName,
      company,
      email,
      phone,
      primaryVertical,
    });
    setTicketId(res.ticketId);
    setSubmitting(false);
  };

  const resetAndClose = () => {
    setTicketId(null);
    closeDistributorModal();
  };

  return (
    <AnimatePresence>
      {isDistributorModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[75] bg-studio/65 backdrop-blur-md flex items-center justify-center p-4"
          onClick={resetAndClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[520px] rounded-3xl bg-white border border-obsidian/10 shadow-[0_32px_90px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <div className="px-7 py-6 border-b border-obsidian/[0.08] flex items-start justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-signal">
                  Programa B2B · Integradores México
                </p>
                <h3 className="text-xl font-semibold text-obsidian tracking-tight mt-1">
                  Alta de Distribuidor Certificado
                </h3>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                aria-label="Cerrar modal"
                className="p-1.5 rounded-full hover:bg-alabaster text-graphite"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {ticketId ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="font-mono text-xs text-signal uppercase tracking-wider">
                  Solicitud {ticketId}
                </p>
                <h4 className="text-xl font-semibold text-obsidian tracking-tight">
                  Tu cuenta está en validación ejecutiva.
                </h4>
                <p className="text-sm text-graphite leading-relaxed">
                  Nuestro equipo de ingeniería comercial en Guadalajara te asignará lista de
                  precios de distribuidor, crédito y acceso a certificaciones técnicas.
                </p>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="mt-2 h-10 px-6 rounded-full bg-obsidian text-white text-sm font-medium"
                >
                  Volver a PROJECT BOX.
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-obsidian mb-1.5">
                      Nombre completo
                    </label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ing. Alejandro Vega"
                      className="w-full h-10 px-3.5 rounded-xl bg-alabaster border border-obsidian/10 text-sm text-obsidian focus:outline-none focus:border-signal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-obsidian mb-1.5">
                      Razón social / Empresa
                    </label>
                    <input
                      required
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Integraciones del Pacífico S.A."
                      className="w-full h-10 px-3.5 rounded-xl bg-alabaster border border-obsidian/10 text-sm text-obsidian focus:outline-none focus:border-signal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-obsidian mb-1.5">
                      Correo corporativo
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="proyectos@empresa.mx"
                      className="w-full h-10 px-3.5 rounded-xl bg-alabaster border border-obsidian/10 text-sm text-obsidian focus:outline-none focus:border-signal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-obsidian mb-1.5">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="33 0000 0000"
                      className="w-full h-10 px-3.5 rounded-xl bg-alabaster border border-obsidian/10 text-sm text-obsidian focus:outline-none focus:border-signal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-obsidian mb-1.5">
                    Vertical principal de integración
                  </label>
                  <select
                    value={primaryVertical}
                    onChange={(e) => setPrimaryVertical(e.target.value as VerticalId)}
                    className="w-full h-10 px-3.5 rounded-xl bg-alabaster border border-obsidian/10 text-sm text-obsidian focus:outline-none focus:border-signal"
                  >
                    {VERTICALS.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <p className="text-[11px] text-graphite">
                    Descuentos B2B desde el primer proyecto · Sin compra mínima
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="shrink-0 h-11 px-6 rounded-full bg-signal hover:bg-signal-glow text-white text-sm font-medium transition-colors"
                  >
                    {submitting ? 'Enviando...' : 'Solicitar acceso B2B'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
