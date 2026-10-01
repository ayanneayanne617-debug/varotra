import React, { useRef } from 'react';
import { Order } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';
import {
  X,
  Printer,
  Truck,
  CheckCircle,
  Package,
  QrCode,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface ShippingSlipModalProps {
  order: Order;
  onClose: () => void;
}

export const ShippingSlipModal: React.FC<ShippingSlipModalProps> = ({ order, onClose }) => {
  const { activeStore, currency } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isPaid = order.status === 'Payée' || order.status === 'Préparation' || order.status === 'Expédiée' || order.status === 'Livrée';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-[#0F172A]">
                Bordereau d’Expédition & Étiquette Colis
              </h2>
              <p className="text-xs text-slate-500">
                Commande {order.orderNumber} • Prêt pour expédition et remise au livreur
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le bordereau</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Packing Slip Area */}
        <div ref={printRef} className="overflow-y-auto p-6 sm:p-8 space-y-6 text-xs text-slate-800 print:p-0">
          {/* Slip Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <div className="text-base font-black text-[#0F172A] tracking-tight">
                {activeStore.name}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{activeStore.address}</p>
              <p className="text-[11px] text-slate-500 font-mono">Tél : {activeStore.phone}</p>
              <p className="text-[11px] text-slate-500">{activeStore.email}</p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block bg-slate-900 text-white text-[11px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                BORDEREAU LIVRAISON
              </span>
              <div className="font-mono font-bold text-sm text-slate-900 mt-1">
                {order.orderNumber}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Recipient Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="font-black text-slate-400 uppercase text-[10px] tracking-wider block mb-1.5">
                Destinataire (Client)
              </span>
              <div className="font-extrabold text-sm text-[#0F172A]">{order.customerName}</div>
              <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-semibold">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{order.customerEmail}</span>
              </div>
              <div className="text-xs text-slate-700 flex items-start gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  {order.customerAddress}, <strong>{order.city}</strong>
                </span>
              </div>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l sm:pl-4 border-slate-200 space-y-2">
              <span className="font-black text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
                Transporteur & Expédition
              </span>
              <div className="text-xs">
                <span className="font-bold text-slate-800">Transporteur assigné :</span>
                <span className="ml-1.5 text-emerald-800 font-extrabold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  {order.city.toLowerCase().includes('antananarivo') || order.city.toLowerCase().includes('tana')
                    ? 'Antananarivo Express Moto'
                    : 'Colis Express Provinces'}
                </span>
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-800">Mode de paiement :</span>
                <span className="ml-1.5 font-semibold text-slate-700">{order.paymentMethod}</span>
              </div>
              <div className="text-xs pt-1">
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    ACQUITTÉ (Ne pas encaisser)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    À ENCAISSER : {formatPrice(order.total, currency)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Article commandé</th>
                  <th className="py-2.5 px-3 text-center">Quantité</th>
                  <th className="py-2.5 px-3 text-right">Prix Unit.</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{item.productName}</div>
                      {item.variantName && (
                        <div className="text-[11px] text-slate-500 font-medium">
                          Option : {item.variantName}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                      x{item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      {formatPrice(item.unitPrice, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {formatPrice(item.totalPrice, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-1.5 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total articles :</span>
                <span>{formatPrice(order.subtotal, currency)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-medium">
                  <span>Réduction promo :</span>
                  <span>- {formatPrice(order.discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Frais de livraison :</span>
                <span>
                  {order.shippingFee === 0 ? 'Offerte' : formatPrice(order.shippingFee, currency)}
                </span>
              </div>
              <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
                <span>Total Commande :</span>
                <span className="text-emerald-700">{formatPrice(order.total, currency)}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Confirmation */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-6 text-[11px]">
            <div className="border border-dashed border-slate-300 rounded-xl p-3 h-24 flex flex-col justify-between">
              <span className="font-bold text-slate-500">Cachet & Signature Expéditeur</span>
              <span className="text-[10px] text-slate-400">Date : ______________</span>
            </div>

            <div className="border border-dashed border-slate-300 rounded-xl p-3 h-24 flex flex-col justify-between">
              <span className="font-bold text-slate-500">Signature Réceptionnaire (Client)</span>
              <span className="text-[10px] text-slate-400">Reçu conforme le : ______________</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 print:hidden">
          <span className="text-[11px] text-slate-500">
            Document certifié conforme par le système d'expédition automatique Varotra
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-xs transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
