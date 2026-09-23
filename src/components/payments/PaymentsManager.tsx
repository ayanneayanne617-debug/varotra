import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethodConfig } from '../../types';
import { CreditCard, Check, Smartphone, Banknote, ShieldCheck } from 'lucide-react';

export const PaymentsManager: React.FC = () => {
  const { paymentConfigs, updatePaymentConfigs } = useApp();
  const [configs, setConfigs] = useState<PaymentMethodConfig[]>(paymentConfigs);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (id: string) => {
    const updated = configs.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c));
    setConfigs(updated);
  };

  const handleUpdateField = (id: string, field: keyof PaymentMethodConfig, value: any) => {
    const updated = configs.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    setConfigs(updated);
  };

  const handleSaveAll = () => {
    updatePaymentConfigs(configs);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const getMethodType = (cfg: PaymentMethodConfig) => {
    if (cfg.type) return cfg.type;
    if (cfg.name === 'Mvola' || cfg.name === 'Orange Money' || cfg.name === 'Airtel Money') {
      return 'mobile_money';
    }
    if (cfg.name === 'Paiement à la livraison') {
      return 'cash_on_delivery';
    }
    if (cfg.name === 'PayPal') {
      return 'paypal';
    }
    return 'card';
  };

  const getMethodBadge = (cfg: PaymentMethodConfig) => {
    const t = getMethodType(cfg);
    switch (t) {
      case 'mobile_money':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">Mobile Money</span>;
      case 'cash_on_delivery':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">Espèces</span>;
      case 'card':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">Carte Bancaire</span>;
      case 'paypal':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">Portefeuille Digital</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Passerelles de Paiement & Mobile Money
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configurez vos comptes de réception Mvola, Orange Money, Airtel Money, Cartes et Paiement à la livraison
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-orange-600/20 transition cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Paramètres Enregistrés !</span>
            </>
          ) : (
            <span>Enregistrer la configuration</span>
          )}
        </button>
      </div>

      {/* Methods Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configs.map((cfg) => (
          <div
            key={cfg.id}
            className={`bg-white p-5 rounded-3xl border transition shadow-xs space-y-3 ${
              cfg.enabled ? 'border-slate-200' : 'border-slate-200/50 opacity-60 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-800">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#0F172A]">{cfg.name}</h3>
                  <div>{getMethodBadge(cfg)}</div>
                </div>
              </div>

              {/* Toggle switch */}
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold">
                <input
                  type="checkbox"
                  checked={cfg.enabled}
                  onChange={() => handleToggle(cfg.id)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className={cfg.enabled ? 'text-emerald-700' : 'text-slate-400'}>
                  {cfg.enabled ? 'Actif' : 'Désactivé'}
                </span>
              </label>
            </div>

            {/* Config Fields */}
            <div className="space-y-2.5 text-xs pt-2">
              {getMethodType(cfg) !== 'cash_on_delivery' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Numéro de compte / Tél marchand
                    </label>
                    <input
                      type="text"
                      value={cfg.accountNumber || ''}
                      onChange={(e) => handleUpdateField(cfg.id, 'accountNumber', e.target.value)}
                      placeholder="Ex: 034 00 000 00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom du titulaire</label>
                    <input
                      type="text"
                      value={cfg.accountName || ''}
                      onChange={(e) => handleUpdateField(cfg.id, 'accountName', e.target.value)}
                      placeholder="Ex: Randria SARL"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Instructions client lors de la commande
                </label>
                <textarea
                  rows={2}
                  value={cfg.instructions}
                  onChange={(e) => handleUpdateField(cfg.id, 'instructions', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
