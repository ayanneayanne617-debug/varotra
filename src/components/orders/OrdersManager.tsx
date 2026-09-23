import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatPrice } from '../../utils/currency';
import {
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Eye,
  Phone,
  MapPin,
  Check,
  ChevronDown,
} from 'lucide-react';

const STATUS_OPTIONS: OrderStatus[] = [
  'Nouvelle',
  'Paiement en attente',
  'Payée',
  'Préparation',
  'Expédiée',
  'Livrée',
  'Annulée',
  'Remboursée',
];

export const OrdersManager: React.FC = () => {
  const { orders, updateOrderStatus, currency } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrderDetail, setActiveOrderDetail] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Livrée':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Payée':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Préparation':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Expédiée':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Nouvelle':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Paiement en attente':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Annulée':
      case 'Remboursée':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Gestion des Commandes ({orders.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivez, traitez et mettez à jour le statut des commandes de vos clients
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Numéro, client, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
              selectedStatus === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Toutes ({orders.length})
          </button>
          {['Nouvelle', 'Préparation', 'Expédiée', 'Livrée'].map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Commande</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Paiement</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(ord.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{ord.customerName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{ord.customerPhone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700">{ord.paymentMethod}</span>
                    {ord.paymentReference && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        {ord.paymentReference}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-black text-emerald-600 text-sm">
                    {formatPrice(ord.total, currency)}
                  </td>
                  <td className="py-3 px-4">
                    {/* Live Status Selector */}
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl border outline-none cursor-pointer transition ${getStatusBadgeClass(
                        ord.status
                      )}`}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveOrderDetail(ord)}
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="Voir les détails de la commande"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrderDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A]">
                  Détail {activeOrderDetail.orderNumber}
                </h3>
                <p className="text-xs text-slate-400 font-mono">{activeOrderDetail.id}</p>
              </div>
              <button
                onClick={() => setActiveOrderDetail(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl space-y-1">
                <div className="font-bold text-slate-800">Client : {activeOrderDetail.customerName}</div>
                <div>Téléphone : {activeOrderDetail.customerPhone}</div>
                <div>Adresse : {activeOrderDetail.customerAddress}, {activeOrderDetail.city}</div>
                {activeOrderDetail.notes && (
                  <div className="text-orange-700 font-medium">Notes : {activeOrderDetail.notes}</div>
                )}
              </div>

              <div>
                <div className="font-bold text-slate-700 mb-2">Articles :</div>
                <div className="space-y-2">
                  {activeOrderDetail.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <img src={item.productImage} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <div className="font-semibold text-slate-800">{item.productName}</div>
                          <div className="text-[10px] text-slate-400">Quantité : {item.quantity}</div>
                        </div>
                      </div>
                      <span className="font-bold">{formatPrice(item.totalPrice, currency)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1 font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Sous-total :</span>
                  <span>{formatPrice(activeOrderDetail.subtotal, currency)}</span>
                </div>
                {activeOrderDetail.discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Réduction ({activeOrderDetail.promoCode}) :</span>
                    <span>-{formatPrice(activeOrderDetail.discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Livraison :</span>
                  <span>{formatPrice(activeOrderDetail.shippingFee, currency)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#0F172A] pt-1">
                  <span>Total :</span>
                  <span className="text-emerald-600">{formatPrice(activeOrderDetail.total, currency)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveOrderDetail(null)}
              className="w-full bg-[#0F172A] text-white font-bold py-2.5 rounded-xl"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
