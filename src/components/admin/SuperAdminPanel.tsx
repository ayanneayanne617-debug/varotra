import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { Store, SubscriptionPlan } from '../../types';
import { formatPrice } from '../../utils/currency';
import {
  ShieldCheck,
  Building2,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle,
  XCircle,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

export const SuperAdminPanel: React.FC = () => {
  const { allStores, switchStore, setViewMode, refreshAllStores, currency } = useApp();
  const [search, setSearch] = useState('');

  const plans = StorageService.getSubscriptionPlans();

  // Platform aggregated metrics
  const totalStores = allStores.length;
  const activeStores = allStores.filter((s) => s.status === 'active').length;

  // Aggregate mock gross platform merchandise value (GMV)
  const platformGMV = 48250000;
  const platformCommissions = Math.round(platformGMV * 0.02);

  const handleToggleStoreStatus = (store: Store) => {
    const updated: Store = {
      ...store,
      status: store.status === 'active' ? 'suspended' : 'active',
    };
    StorageService.updateStore(updated);
    refreshAllStores();
  };

  const handleChangePlan = (store: Store, newPlan: string) => {
    const updated: Store = {
      ...store,
      plan: newPlan,
      planId: (newPlan.toUpperCase() === 'ENTREPRISE'
        ? 'BUSINESS'
        : newPlan.toUpperCase() === 'STARTER'
        ? 'BASIC'
        : newPlan.toUpperCase() === 'GRATUIT'
        ? 'FREE'
        : 'PRO') as any,
    };
    StorageService.updateStore(updated);
    refreshAllStores();
  };

  const filteredStores: Store[] = allStores.filter(
    (s: Store) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.subdomain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
              Plateforme SaaS
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Console Super Administrateur
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervision globale de toutes les boutiques marchandes, abonnements et commissions
          </p>
        </div>
      </div>

      {/* Global SaaS KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-bold mb-1">Total Boutiques</div>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A]">{totalStores}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{activeStores} actives</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-bold mb-1">Volume Global (GMV)</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600">
            {formatPrice(platformGMV, currency)}
          </div>
          <div className="text-[11px] text-slate-400">Transactions cumulées</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-bold mb-1">Commissions SaaS (2%)</div>
          <div className="text-xl sm:text-2xl font-black text-orange-600">
            {formatPrice(platformCommissions, currency)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">Revenus perçus</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-bold mb-1">Plans Souscrits</div>
          <div className="text-xl sm:text-2xl font-black text-purple-600">Starter & Pro</div>
          <div className="text-[11px] text-slate-400">Abonnements récurrents</div>
        </div>
      </div>

      {/* SaaS Subscription Plans Overview */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <span>Grille Tarifaire des Abonnements SaaS Varotra</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {plans.map((p: SubscriptionPlan) => (
            <div
              key={p.name}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-sm text-[#0F172A]">{p.name}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {p.commissionRate}% comm.
                  </span>
                </div>
                <div className="text-base font-black text-emerald-600 mt-1">
                  {p.priceMonthlyMGA === 0
                    ? 'Gratuit'
                    : `${formatPrice(p.priceMonthlyMGA, currency)} / mois`}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Max {p.productLimit > 1000 ? 'Illimités' : p.productLimit} produits
                </div>

                <ul className="space-y-1.5 mt-3 text-slate-600">
                  {p.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Store Directory & Management */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>Boutiques Enregistrées sur la Plateforme ({allStores.length})</span>
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrer les boutiques..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Boutique</th>
                <th className="pb-3">Sous-domaine</th>
                <th className="pb-3">Abonnement</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStores.map((st: Store) => (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="py-3 flex items-center gap-2.5">
                    <img
                      src={st.logo}
                      alt=""
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="font-black text-slate-900">{st.name}</div>
                      <div className="text-[10px] text-slate-400">{st.email}</div>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-emerald-700 font-semibold">{st.subdomain}</td>
                  <td className="py-3">
                    <select
                      value={st.plan || st.planId}
                      onChange={(e) => handleChangePlan(st, e.target.value)}
                      className="bg-slate-100 border border-slate-200 text-xs font-bold rounded-lg px-2 py-1 text-slate-800 cursor-pointer"
                    >
                      <option value="Gratuit">Gratuit</option>
                      <option value="Starter">Starter</option>
                      <option value="Pro">Pro</option>
                      <option value="Entreprise">Entreprise</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        st.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {st.status === 'active' ? 'Active' : 'Suspendue'}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        switchStore(st.id);
                        setViewMode('storefront');
                      }}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Voir boutique
                    </button>
                    <button
                      onClick={() => handleToggleStoreStatus(st)}
                      className={`text-xs font-bold px-2 py-1 rounded-lg transition ${
                        st.status === 'active'
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {st.status === 'active' ? 'Suspendre' : 'Réactiver'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
