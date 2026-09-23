import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PromoCode } from '../../types';
import { formatPrice } from '../../utils/currency';
import { Tag, Plus, Trash2, Check, Ticket, Clock, Percent } from 'lucide-react';

export const PromotionsManager: React.FC = () => {
  const { promoCodes, updatePromoCodes, currency, activeStore } = useApp();
  const [promos, setPromos] = useState<PromoCode[]>(promoCodes);

  const [isAdding, setIsAdding] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');
  const [newValue, setNewValue] = useState(15);
  const [newMinOrder, setNewMinOrder] = useState(50000);
  const [newMaxUsage, setNewMaxUsage] = useState(100);

  const isPromoActive = (p: PromoCode) =>
    p.active !== undefined ? p.active : p.enabled !== undefined ? p.enabled : true;

  const handleToggle = (id: string) => {
    const updated = promos.map((p) => {
      if (p.id === id) {
        const nextState = !isPromoActive(p);
        return { ...p, active: nextState, enabled: nextState };
      }
      return p;
    });
    setPromos(updated);
    updatePromoCodes(updated);
  };

  const handleDelete = (id: string) => {
    const updated = promos.filter((p) => p.id !== id);
    setPromos(updated);
    updatePromoCodes(updated);
  };

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const newP: PromoCode = {
      id: `promo-${Date.now()}`,
      storeId: activeStore.id,
      code: newCode.trim().toUpperCase(),
      discountType: newType,
      discountValue: Number(newValue),
      minOrderAmount: Number(newMinOrder),
      maxUses: Number(newMaxUsage),
      maxUsage: Number(newMaxUsage),
      currentUses: 0,
      currentUsage: 0,
      active: true,
      enabled: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
    };

    const updated = [newP, ...promos];
    setPromos(updated);
    updatePromoCodes(updated);
    setNewCode('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Codes Promo & Réductions ({promos.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Créez des coupons marketing en pourcentage ou montant fixe avec seuils d'achat minimum
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Créer un code promo</span>
        </button>
      </div>

      {/* Creation Form */}
      {isAdding && (
        <form
          onSubmit={handleAddPromo}
          className="bg-white p-5 rounded-3xl border border-emerald-300 shadow-sm space-y-3 animate-in fade-in text-xs"
        >
          <div className="font-extrabold text-sm text-[#0F172A]">Nouveau Coupon Promo</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Code promo (ex: MADA15) *</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Ex: PROMO2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold uppercase outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Type de remise</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-semibold"
              >
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (Ar)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Valeur ({newType === 'percentage' ? '%' : 'Ar'}) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={newValue}
                onChange={(e) => setNewValue(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Montant minimum d'achat (Ar)</label>
              <input
                type="number"
                min={0}
                value={newMinOrder}
                onChange={(e) => setNewMinOrder(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition"
            >
              Enregistrer le code
            </button>
          </div>
        </form>
      )}

      {/* Promos Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((p) => {
          const active = isPromoActive(p);
          return (
            <div
              key={p.id}
              className={`bg-white p-5 rounded-3xl border transition shadow-xs flex flex-col justify-between space-y-3 ${
                active ? 'border-slate-200' : 'border-slate-200/50 opacity-60 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-mono font-black text-base text-[#0F172A] tracking-wider">
                        {p.code}
                      </h3>
                      <div className="text-[11px] font-bold text-emerald-600">
                        {p.discountType === 'percentage'
                          ? `-${p.discountValue}% de réduction`
                          : `-${formatPrice(p.discountValue, currency)} de réduction`}
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => handleToggle(p.id)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className={active ? 'text-emerald-700' : 'text-slate-400'}>
                      {active ? 'Actif' : 'Off'}
                    </span>
                  </label>
                </div>

                <div className="mt-3 bg-slate-50 p-3 rounded-2xl text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Panier minimum :</span>
                    <span className="font-bold text-slate-900">
                      {formatPrice(p.minOrderAmount || 0, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilisations :</span>
                    <span className="font-bold text-slate-900">
                      {p.currentUses ?? p.currentUsage ?? 0} / {p.maxUses ?? p.maxUsage ?? 100}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
