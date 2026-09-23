import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { Customer } from '../../types';
import { formatPrice } from '../../utils/currency';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  UserPlus,
} from 'lucide-react';

export const CustomersManager: React.FC = () => {
  const { activeStore, currency } = useApp();
  const [customers, setCustomers] = useState<Customer[]>(() =>
    StorageService.getCustomers(activeStore.id)
  );
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Fichier Clients ({customers.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Consultez les coordonnées, l'historique d'achat et la valeur à vie (LTV) de vos acheteurs
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => (
          <div
            key={c.id}
            className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
                  {c.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F172A]">{c.name}</h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{c.city}</span>
                  </div>
                </div>
              </div>

              <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2 py-0.5 rounded-full">
                {c.totalOrders} cmd{c.totalOrders > 1 ? 's' : ''}
              </span>
            </div>

            <div className="text-xs space-y-1 text-slate-600 bg-slate-50 p-2.5 rounded-2xl">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <a href={`tel:${c.phone}`} className="hover:text-emerald-700 font-semibold">
                  {c.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate">{c.email}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Adresse : {c.address}</div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Total dépensé (LTV) :</span>
              <span className="font-black text-emerald-600">
                {formatPrice(c.totalSpent, currency)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
