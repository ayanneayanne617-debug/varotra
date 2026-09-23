import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';
import { OrderStatus } from '../../types';
import {
  X,
  Search,
  Package,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
} from 'lucide-react';

const ORDER_STEPS: OrderStatus[] = [
  'Nouvelle',
  'Payée',
  'Préparation',
  'Expédiée',
  'Livrée',
];

export const OrderTrackingModal: React.FC = () => {
  const { trackingOrderNumber, setTrackingOrderNumber, orders, currency } = useApp();
  const [searchInput, setSearchInput] = useState(trackingOrderNumber || '');

  if (!trackingOrderNumber) return null;

  const currentOrder = orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === (searchInput || trackingOrderNumber).trim().toLowerCase()
  );

  const getStepIndex = (status: OrderStatus) => {
    return ORDER_STEPS.indexOf(status);
  };

  const currentStepIndex = currentOrder ? getStepIndex(currentOrder.status) : -1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-base text-[#0F172A]">Suivi de Commande</h2>
          </div>
          <button
            onClick={() => setTrackingOrderNumber(null)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Numéro de commande (ex: #ORD-2026-0101)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {currentOrder ? (
            <>
              {/* Status Header Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Statut actuel
                  </div>
                  <div className="text-lg font-black text-emerald-900 mt-0.5">
                    {currentOrder.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-500 font-mono">
                    {currentOrder.orderNumber}
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    {new Date(currentOrder.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>

              {/* Visual Progress Steps */}
              <div className="py-2">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-100 -translate-y-1/2 -z-10" />
                  <div
                    className="absolute left-0 top-1/2 h-1 bg-emerald-500 -translate-y-1/2 -z-10 transition-all duration-500"
                    style={{
                      width: `${Math.max(
                        0,
                        (currentStepIndex / (ORDER_STEPS.length - 1)) * 100
                      )}%`,
                    }}
                  />

                  {ORDER_STEPS.map((step, idx) => {
                    const isPassed = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                            isPassed
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                              : 'bg-white border-2 border-slate-200 text-slate-400'
                          } ${isCurrent ? 'scale-110 bg-emerald-500' : ''}`}
                        >
                          {isPassed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] font-bold mt-1 text-center max-w-[60px] leading-tight ${
                            isCurrent
                              ? 'text-emerald-700 font-extrabold'
                              : isPassed
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery & Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lieu de livraison</span>
                  </div>
                  <div className="text-slate-900 font-medium">
                    {currentOrder.customerAddress}, {currentOrder.city}
                  </div>
                  <div className="text-slate-500 text-[11px]">{currentOrder.customerPhone}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Paiement & Mode</span>
                  </div>
                  <div className="text-emerald-700 font-bold">{currentOrder.paymentMethod}</div>
                  <div className="text-slate-500 text-[11px]">
                    Réf: {currentOrder.paymentReference || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="font-bold text-xs text-slate-700">Articles commandés :</div>
                {currentOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1 border-b border-slate-50"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={it.productImage}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                      />
                      <div className="truncate">
                        <div className="font-bold text-slate-800 truncate">{it.productName}</div>
                        <div className="text-[10px] text-slate-500">Quantité : {it.quantity}</div>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatPrice(it.totalPrice, currency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-center pt-2 text-sm font-extrabold text-[#0F172A] border-t border-slate-200">
                <span>Total réglé :</span>
                <span className="text-emerald-600 text-base">
                  {formatPrice(currentOrder.total, currency)}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-sm text-slate-700">Aucune commande trouvée</div>
              <p className="text-xs text-slate-400">
                Veuillez vérifier le numéro de commande saisi ci-dessus.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
