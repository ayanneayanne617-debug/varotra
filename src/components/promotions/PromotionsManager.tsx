import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { PromoCode, MarketingCampaign } from '../../types';
import { formatPrice } from '../../utils/currency';
import {
  Tag,
  Plus,
  Trash2,
  Check,
  Ticket,
  Clock,
  Percent,
  MessageSquare,
  Sparkles,
  Zap,
  Send,
  Smartphone,
  Eye,
  X,
  TrendingUp,
} from 'lucide-react';

export const PromotionsManager: React.FC = () => {
  const { promoCodes, updatePromoCodes, currency, activeStore } = useApp();
  const [promos, setPromos] = useState<PromoCode[]>(promoCodes);
  const [activeTab, setActiveTab] = useState<'coupons' | 'marketing'>('coupons');

  // Marketing Campaigns
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() =>
    StorageService.getMarketingCampaigns(activeStore.id)
  );
  const [selectedCampaignForPreview, setSelectedCampaignForPreview] = useState<MarketingCampaign | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Coupon Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');
  const [newValue, setNewValue] = useState(15);
  const [newMinOrder, setNewMinOrder] = useState(50000);
  const [newMaxUsage, setNewMaxUsage] = useState(100);

  // New Campaign Form State
  const [isAddingCampaign, setIsAddingCampaign] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampChannel, setNewCampChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [newCampType, setNewCampType] = useState<MarketingCampaign['type']>('abandoned_cart');
  const [newCampMsg, setNewCampMsg] = useState('');
  const [newCampTrigger, setNewCampTrigger] = useState('Dès abandon du panier');

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
    setToastMsg(`Code promo ${newP.code} activé avec succès !`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Toggle Campaign active/paused
  const handleToggleCampaign = (id: string) => {
    const updated = campaigns.map((c) =>
      c.id === id ? { ...c, status: (c.status === 'active' ? 'paused' : 'active') as any } : c
    );
    setCampaigns(updated);
    StorageService.saveMarketingCampaigns(activeStore.id, updated);
  };

  // Test send campaign
  const handleTestBroadcast = (campaign: MarketingCampaign) => {
    setSelectedCampaignForPreview(null);
    setToastMsg(
      `Message test de la campagne « ${campaign.title} » envoyé avec succès par ${campaign.channel.toUpperCase()} !`
    );
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Add custom campaign
  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle.trim()) return;

    const newCamp: MarketingCampaign = {
      id: `camp-${Date.now()}`,
      storeId: activeStore.id,
      title: newCampTitle.trim(),
      type: newCampType,
      channel: newCampChannel,
      status: 'active',
      messageTemplate:
        newCampMsg.trim() ||
        'Bonjour {{nom}}, profitez d’une offre exclusive chez {{boutique}} ! Rendez-vous sur notre site.',
      triggerCondition: newCampTrigger.trim(),
      sentCount: 1,
      conversionRate: 25.0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newCamp, ...campaigns];
    setCampaigns(updated);
    StorageService.saveMarketingCampaigns(activeStore.id, updated);
    setIsAddingCampaign(false);
    setNewCampTitle('');
    setNewCampMsg('');
    setToastMsg(`Nouvelle campagne marketing « ${newCamp.title} » activée !`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 pb-24">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{toastMsg}</span>
          </div>
          <button
            onClick={() => setToastMsg(null)}
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
            Promotions & Marketing Automatisé
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez vos coupons de réduction et déployez des campagnes de relance automatisées par WhatsApp et SMS
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Codes Promo ({promos.length})
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'marketing'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Marketing Automatisé ({campaigns.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TRADITIONAL COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="font-bold text-xs text-slate-600">
              {promos.filter(isPromoActive).length} code(s) actif(s) sur votre boutique
            </span>
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
                  <label className="block font-bold text-slate-700 mb-1">
                    Code promo (ex: MADA15) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="MADA15"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-slate-800 uppercase outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type de réduction</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (Ar)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {newType === 'percentage' ? 'Valeur (%)' : 'Montant en Ar'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Panier minimum (Ar)</label>
                  <input
                    type="number"
                    min={0}
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl shadow-xs transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          )}

          {/* Coupons List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promos.map((p) => {
              const active = isPromoActive(p);
              return (
                <div
                  key={p.id}
                  className={`bg-white p-5 rounded-3xl border transition shadow-xs flex flex-col justify-between ${
                    active ? 'border-slate-200/80' : 'border-slate-100 opacity-60 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            active ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-400'
                          }`}
                        >
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

                  <div className="flex justify-end pt-3 border-t border-slate-100 mt-3">
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
      )}

      {/* TAB 2: AUTOMATED MARKETING & CAMPAIGNS */}
      {activeTab === 'marketing' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Banner */}
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full border border-white/20">
                Marketing Automation WhatsApp & SMS
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Pilotez vos relances et convertissez automatiquement vos visiteurs
              </h3>
              <p className="text-xs text-orange-100 max-w-xl">
                Ces scénarios déclenchent automatiquement des messages personnalisés pour récupérer les paniers abandonnés, accueillir les nouveaux acheteurs et récompenser vos meilleurs clients.
              </p>
            </div>

            <button
              onClick={() => setIsAddingCampaign(true)}
              className="px-4 py-2.5 bg-white text-orange-900 hover:bg-orange-50 font-black text-xs rounded-xl shadow-xs transition shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Créer un scénario</span>
            </button>
          </div>

          {/* New Campaign Form */}
          {isAddingCampaign && (
            <form
              onSubmit={handleAddCampaign}
              className="bg-white p-5 rounded-3xl border border-orange-300 shadow-sm space-y-3 animate-in fade-in text-xs"
            >
              <div className="font-extrabold text-sm text-[#0F172A]">
                Créer un Scénario de Marketing Automatisé
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Titre du scénario *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCampTitle}
                    onChange={(e) => setNewCampTitle(e.target.value)}
                    placeholder="Ex: Offre Anniversaire Client"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Canal de diffusion</label>
                  <select
                    value={newCampChannel}
                    onChange={(e) => setNewCampChannel(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-orange-500"
                  >
                    <option value="whatsapp">WhatsApp Business</option>
                    <option value="sms">SMS Direct</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Déclencheur</label>
                  <input
                    type="text"
                    value={newCampTrigger}
                    onChange={(e) => setNewCampTrigger(e.target.value)}
                    placeholder="Ex: 2 heures après visite"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Modèle de message (Variables acceptées : {'{{nom}}'}, {'{{boutique}}'}, {'{{code}}'})
                </label>
                <textarea
                  rows={3}
                  value={newCampMsg}
                  onChange={(e) => setNewCampMsg(e.target.value)}
                  placeholder="Bonjour {{nom}}, nous vous offrons 15% de remise sur {{boutique}}..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:border-orange-500 resize-none font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCampaign(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-xl shadow-xs transition"
                >
                  Activer la campagne
                </button>
              </div>
            </form>
          )}

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className={`bg-white p-5 rounded-3xl border transition shadow-xs flex flex-col justify-between space-y-4 ${
                  camp.status === 'active'
                    ? 'border-slate-200/90'
                    : 'border-slate-200/60 opacity-60 bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                          camp.channel === 'whatsapp'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-sm text-[#0F172A]">{camp.title}</h3>
                          <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            {camp.channel}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Déclencheur : {camp.triggerCondition}</span>
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold">
                      <input
                        type="checkbox"
                        checked={camp.status === 'active'}
                        onChange={() => handleToggleCampaign(camp.id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span
                        className={camp.status === 'active' ? 'text-emerald-700' : 'text-slate-400'}
                      >
                        {camp.status === 'active' ? 'Actif' : 'Pause'}
                      </span>
                    </label>
                  </div>

                  {/* Message Preview Box */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-700 font-mono text-[11px] leading-relaxed">
                    « {camp.messageTemplate} »
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Envoyés</span>
                      <span className="font-bold text-slate-900">{camp.sentCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Conversion</span>
                      <span className="font-black text-emerald-700">
                        {camp.conversionRate}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCampaignForPreview(camp)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-[11px] transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Aperçu smartphone</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaign Simulation / Smartphone Preview Modal */}
      {selectedCampaignForPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden relative p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-[#0F172A]">
                  Aperçu Réception Client
                </h3>
              </div>
              <button
                onClick={() => setSelectedCampaignForPreview(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Smartphone simulated screen */}
            <div className="bg-slate-900 rounded-3xl p-3 text-white space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
                <span>09:41</span>
                <span>4G • 98%</span>
              </div>

              <div className="bg-emerald-950/80 border border-emerald-500/30 rounded-2xl p-3 text-xs space-y-1.5 shadow-md">
                <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold">
                  <span>{activeStore.name} ({selectedCampaignForPreview.channel.toUpperCase()})</span>
                  <span>À l'instant</span>
                </div>
                <p className="text-white text-xs leading-relaxed">
                  {selectedCampaignForPreview.messageTemplate
                    .replace('{{nom}}', 'Harilala')
                    .replace('{{boutique}}', activeStore.name)
                    .replace('{{code}}', 'REVIENS10')}
                </p>
                <span className="text-[10px] text-emerald-300/80 block text-right">✓✓ Distribué</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleTestBroadcast(selectedCampaignForPreview)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Tester l'envoi immédiat</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCampaignForPreview(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
