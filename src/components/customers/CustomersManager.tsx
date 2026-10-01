import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { Customer, LoyaltyTier, PromoCode } from '../../types';
import { formatPrice } from '../../utils/currency';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  Award,
  Crown,
  Sparkles,
  Gift,
  Check,
  Plus,
  Ticket,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const CustomersManager: React.FC = () => {
  const { activeStore, currency, promoCodes, updatePromoCodes } = useApp();
  const [customers, setCustomers] = useState<Customer[]>(() =>
    StorageService.getCustomers(activeStore.id)
  );
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'directory' | 'loyalty'>('directory');
  const [notification, setNotification] = useState<string | null>(null);

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

  const getTierBadge = (tier?: LoyaltyTier) => {
    switch (tier) {
      case 'Platine':
        return {
          icon: Crown,
          bg: 'bg-purple-100 text-purple-900 border-purple-200',
          label: '💎 Platine VIP',
          discount: '-15% permanent',
        };
      case 'Or':
        return {
          icon: Award,
          bg: 'bg-amber-100 text-amber-900 border-amber-200',
          label: '🥇 Or',
          discount: '-10% + Livraison gratuite',
        };
      case 'Argent':
        return {
          icon: Award,
          bg: 'bg-slate-200 text-slate-800 border-slate-300',
          label: '🥈 Argent',
          discount: '-5% permanent',
        };
      case 'Bronze':
      default:
        return {
          icon: Award,
          bg: 'bg-orange-100 text-orange-900 border-orange-200',
          label: '🥉 Bronze',
          discount: 'Membre débutant',
        };
    }
  };

  const handleAwardBonusPoints = (customerId: string, amount: number) => {
    const updated = StorageService.updateCustomerLoyalty(customerId, amount);
    if (updated) {
      setCustomers(StorageService.getCustomers(activeStore.id));
      setNotification(`+${amount} points de fidélité attribués à ${updated.name} !`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const handleGenerateLoyaltyVoucher = (customer: Customer) => {
    const points = customer.loyaltyPoints || 0;
    if (points < 50) {
      setNotification(`Le client doit avoir au moins 50 points pour émettre un bon d'achat.`);
      setTimeout(() => setNotification(null), 3500);
      return;
    }

    const voucherValue = Math.round(points * 100); // 1 pt = 100 Ar discount voucher
    const voucherCode = `FID-${customer.name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    // Create promo code
    const newPromo: PromoCode = {
      id: `promo-${Date.now()}`,
      storeId: activeStore.id,
      code: voucherCode,
      discountType: 'fixed',
      discountValue: voucherValue,
      minOrderAmount: voucherValue * 2,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      maxUses: 1,
      currentUses: 0,
      active: true,
      enabled: true,
    };

    updatePromoCodes([newPromo, ...promoCodes]);
    StorageService.updateCustomerLoyalty(customer.id, -points);
    setCustomers(StorageService.getCustomers(activeStore.id));

    setNotification(
      `Bon d'achat de ${formatPrice(voucherValue, currency)} créé (Code: ${voucherCode}) pour ${customer.name} !`
    );
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 pb-24">
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-200 hover:text-white font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Clients & Programme de Fidélité ({customers.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des acheteurs, cumul des points fidélité et attribution des récompenses VIP
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fichier Clients
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'loyalty'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Club Fidélité VIP</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-bold hidden sm:block">
          {filteredCustomers.length} client{filteredCustomers.length > 1 ? 's' : ''} trouvé{filteredCustomers.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* VIEW 1: DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((c) => {
            const tierInfo = getTierBadge(c.loyaltyTier);
            return (
              <div
                key={c.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
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

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierInfo.bg}`}
                    >
                      {tierInfo.label}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
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
                    <div className="text-[11px] text-slate-500 pt-0.5">
                      Adresse : {c.address}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Points Fidélité</span>
                    <span className="font-black text-emerald-700 text-sm">
                      {c.loyaltyPoints || 0} pts
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-bold">Total Dépensé</span>
                    <span className="font-black text-slate-900 text-sm">
                      {formatPrice(c.totalSpent, currency)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: LOYALTY CLUB & REWARDS */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Loyalty Program Overview & Tiers Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  Règles du Club Varotra
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1.5">
                  Programme de Fidélité Automatisé
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Vos clients cumulent automatiquement <strong>1 point pour chaque 1 000 Ar dépensés</strong>. Les points débloquent des remises permanentes et des bons d'achat.
                </p>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 shrink-0 text-center">
                <span className="text-xs text-slate-300 block">Total Points Cumulés</span>
                <span className="text-2xl font-black text-emerald-400">
                  {customers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0)} pts
                </span>
              </div>
            </div>

            {/* 4 Loyalty Tiers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
                <span className="font-extrabold text-sm text-orange-400 flex items-center gap-1.5">
                  <span>🥉 Bronze</span>
                  <span className="text-[10px] text-slate-300">(0 - 99 pts)</span>
                </span>
                <p className="text-[11px] text-slate-200">
                  Statut initial de bienvenue. Accès prioritaire aux ventes privées de la boutique.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
                <span className="font-extrabold text-sm text-slate-200 flex items-center gap-1.5">
                  <span>🥈 Argent</span>
                  <span className="text-[10px] text-slate-300">(100 - 299 pts)</span>
                </span>
                <p className="text-[11px] text-slate-200">
                  <strong>-5% de réduction</strong> permanente sur tout le catalogue.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
                <span className="font-extrabold text-sm text-amber-400 flex items-center gap-1.5">
                  <span>🥇 Or VIP</span>
                  <span className="text-[10px] text-slate-300">(300 - 599 pts)</span>
                </span>
                <p className="text-[11px] text-slate-200">
                  <strong>-10% de remise</strong> + <strong>Livraison offerte</strong> systématique.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
                <span className="font-extrabold text-sm text-purple-300 flex items-center gap-1.5">
                  <span>💎 Platine Prestige</span>
                  <span className="text-[10px] text-slate-300">(600+ pts)</span>
                </span>
                <p className="text-[11px] text-slate-200">
                  <strong>-15% de remise</strong> + Cadeau d'anniversaire personnalisé.
                </p>
              </div>
            </div>
          </div>

          {/* Loyalty Management Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-3 p-5">
            <h3 className="font-extrabold text-base text-[#0F172A]">
              Gestion des Points & Récompenses par Client
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Palier Actuel</th>
                    <th className="py-3 px-4">Dépenses Cumulées</th>
                    <th className="py-3 px-4">Solde Points</th>
                    <th className="py-3 px-4 text-right">Actions Récompenses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map((c) => {
                    const tierInfo = getTierBadge(c.loyaltyTier);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{c.name}</div>
                          <div className="text-[11px] text-slate-500">{c.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${tierInfo.bg}`}
                          >
                            {tierInfo.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-slate-700">
                          {formatPrice(c.totalSpent, currency)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-black text-emerald-700 text-sm">
                            {c.loyaltyPoints || 0} pts
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Award bonus points */}
                            <button
                              type="button"
                              onClick={() => handleAwardBonusPoints(c.id, 50)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-[11px] transition cursor-pointer"
                              title="Offrir 50 points bonus de fidélité"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+50 pts</span>
                            </button>

                            {/* Convert to voucher */}
                            <button
                              type="button"
                              onClick={() => handleGenerateLoyaltyVoucher(c)}
                              className="flex items-center gap-1 px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-xl font-bold text-[11px] transition cursor-pointer"
                              title="Convertir les points en code promo"
                            >
                              <Gift className="w-3.5 h-3.5 text-orange-600" />
                              <span>Émettre Bon</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
