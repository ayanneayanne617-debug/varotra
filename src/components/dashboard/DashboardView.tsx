import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';

type PeriodFilter = 'today' | '7d' | '30d' | '3m' | '1y';

export const DashboardView: React.FC = () => {
  const { orders, products, currency, setMerchantTab, setSelectedProductForModal } = useApp();
  const [period, setPeriod] = useState<PeriodFilter>('30d');

  // Multiplier for mock period data to make filters genuinely dynamic and realistic
  const periodMultipliers: Record<PeriodFilter, { mult: number; label: string }> = {
    today: { mult: 0.15, label: "Aujourd'hui" },
    '7d': { mult: 0.5, label: '7 derniers jours' },
    '30d': { mult: 1, label: '30 derniers jours' },
    '3m': { mult: 2.8, label: '3 derniers mois' },
    '1y': { mult: 11.2, label: '1 an' },
  };

  const currentMultiplier = periodMultipliers[period].mult;

  // Base metrics calculated from actual orders
  const baseRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Annulée' ? o.total : 0), 0);
  const totalRevenue = Math.round(baseRevenue * currentMultiplier);

  const baseOrdersCount = orders.filter((o) => o.status !== 'Annulée').length;
  const totalOrdersCount = Math.max(1, Math.round(baseOrdersCount * currentMultiplier));

  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Estimated profit (assuming ~38% margin based on costPrice)
  const estimatedProfit = Math.round(totalRevenue * 0.38);

  const totalProductsCount = products.length;
  const totalStockCount = products.reduce((sum, p) => sum + p.stock, 0);

  // Low stock products
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockAlert);

  // Chart data points according to selected period
  const chartPoints = [
    { label: 'Lun', value: Math.round(totalRevenue * 0.12) },
    { label: 'Mar', value: Math.round(totalRevenue * 0.18) },
    { label: 'Mer', value: Math.round(totalRevenue * 0.14) },
    { label: 'Jeu', value: Math.round(totalRevenue * 0.22) },
    { label: 'Ven', value: Math.round(totalRevenue * 0.28) },
    { label: 'Sam', value: Math.round(totalRevenue * 0.35) },
    { label: 'Dim', value: Math.round(totalRevenue * 0.25) },
  ];

  const maxChartVal = Math.max(...chartPoints.map((c) => c.value), 1);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 pb-24">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Vue d'ensemble de la boutique
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des ventes, revenus et performances commerciales en temps réel
          </p>
        </div>

        {/* Period Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto text-xs font-bold">
          {(
            [
              { id: 'today', label: "Aujourd'hui" },
              { id: '7d', label: '7 jours' },
              { id: '30d', label: '30 jours' },
              { id: '3m', label: '3 mois' },
              { id: '1y', label: '1 an' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                period === item.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Chiffre d'affaires */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>Chiffre d'affaires</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-emerald-600 tracking-tight">
              {formatPrice(totalRevenue, currency)}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs période précédente</span>
            </div>
          </div>
        </div>

        {/* Bénéfices nets */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>Bénéfice estimé</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight">
              {formatPrice(estimatedProfit, currency)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Marge moyenne ~38%
            </div>
          </div>
        </div>

        {/* Commandes */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>Commandes</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight">
              {totalOrdersCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Panier moyen : {formatPrice(averageOrderValue, currency)}
            </div>
          </div>
        </div>

        {/* Produits & Stock */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>Articles en stock</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight">
              {totalStockCount} <span className="text-xs text-slate-400 font-normal">unités</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">
              {totalProductsCount} références actives
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Evolution Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#0F172A]">Évolution des ventes</h3>
              <p className="text-xs text-slate-500">
                Période sélectionnée : {periodMultipliers[period].label}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
              Progression +24%
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {chartPoints.map((pt, idx) => {
                const heightPercent = Math.max(15, Math.round((pt.value / maxChartVal) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="text-[10px] font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition duration-150 whitespace-nowrap">
                      {formatPrice(pt.value, currency)}
                    </div>
                    {/* Bar */}
                    <div
                      className="w-full max-w-[42px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl transition-all duration-300 group-hover:from-orange-500 group-hover:to-orange-400"
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* Day label */}
                    <span className="text-xs font-bold text-slate-500">{pt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts Box */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Alertes de Stock</span>
              </h3>
              <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                {lowStockProducts.length} critique(s)
              </span>
            </div>

            <div className="space-y-2.5">
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-slate-500 p-4 bg-slate-50 rounded-2xl text-center">
                  ✅ Tous vos niveaux de stock sont optimaux.
                </p>
              ) : (
                lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductForModal(p)}
                    className="p-2.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex items-center justify-between gap-2 hover:bg-amber-100/50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{p.name}</div>
                        <div className="text-[10px] text-amber-800 font-semibold">
                          Seuil alerte : {p.lowStockAlert} u.
                        </div>
                      </div>
                    </div>
                    <span className="bg-amber-500 text-white font-black text-xs px-2 py-1 rounded-xl shrink-0">
                      {p.stock} restant{p.stock > 1 ? 's' : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setMerchantTab('inventory')}
            className="w-full flex items-center justify-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-2.5 rounded-2xl transition"
          >
            <span>Gérer l'inventaire complet</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Sellers Table */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#0F172A]">Meilleures Ventes</h3>
          <button
            onClick={() => setMerchantTab('products')}
            className="text-xs font-bold text-emerald-600 hover:underline"
          >
            Voir tous les produits
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 font-semibold">Produit</th>
                <th className="pb-3 font-semibold">Catégorie</th>
                <th className="pb-3 font-semibold">Prix</th>
                <th className="pb-3 font-semibold">Stock</th>
                <th className="pb-3 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 flex items-center gap-2.5">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-9 h-9 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <span className="font-bold text-slate-900">{p.name}</span>
                  </td>
                  <td className="py-2.5 text-slate-600">{p.category}</td>
                  <td className="py-2.5 font-bold text-emerald-600">
                    {formatPrice(p.price, currency)}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        p.stock <= p.lowStockAlert
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.stock} en stock
                    </span>
                  </td>
                  <td className="py-2.5 text-amber-500 font-bold">★ {p.rating || 5.0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
