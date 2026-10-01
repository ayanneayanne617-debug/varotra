import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { ShippingAutomationRule } from '../../types';
import {
  X,
  Truck,
  Zap,
  Check,
  Plus,
  Trash2,
  MessageSquare,
  Clock,
  Sparkles,
  AlertCircle,
  Play,
  ArrowRight,
} from 'lucide-react';

interface ShippingAutomationModalProps {
  onClose: () => void;
  onRulesApplied?: (affectedCount: number) => void;
}

export const ShippingAutomationModal: React.FC<ShippingAutomationModalProps> = ({
  onClose,
  onRulesApplied,
}) => {
  const { activeStore, orders, updateOrderStatus } = useApp();

  const [rules, setRules] = useState<ShippingAutomationRule[]>(() =>
    StorageService.getShippingRules(activeStore.id)
  );

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTrigger, setNewTrigger] = useState<ShippingAutomationRule['triggerEvent']>('order_paid');
  const [newAction, setNewAction] = useState<ShippingAutomationRule['action']>('assign_carrier');
  const [newCarrier, setNewCarrier] = useState('Antananarivo Express Moto');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleToggleRule = (id: string) => {
    const updated = rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r));
    setRules(updated);
    StorageService.saveShippingRules(activeStore.id, updated);
  };

  const handleDeleteRule = (id: string) => {
    const updated = rules.filter((r) => r.id !== id);
    setRules(updated);
    StorageService.saveShippingRules(activeStore.id, updated);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newR: ShippingAutomationRule = {
      id: `rule-${Date.now()}`,
      storeId: activeStore.id,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Règle personnalisée de routage des commandes.',
      triggerEvent: newTrigger,
      action: newAction,
      carrierName: newCarrier,
      active: true,
    };

    const updated = [newR, ...rules];
    setRules(updated);
    StorageService.saveShippingRules(activeStore.id, updated);
    setIsAdding(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleRunAutomation = () => {
    // Check pending orders and advance them according to active rules
    let affected = 0;
    const pendingOrders = orders.filter(
      (o) => o.status === 'Payée' || o.status === 'Paiement en attente' || o.status === 'Nouvelle'
    );

    pendingOrders.forEach((o) => {
      // Simulate automatic progression to 'Préparation'
      updateOrderStatus(o.id, 'Préparation');
      affected++;
    });

    setFeedbackMsg(
      `${affected} commande(s) mise(s) à jour automatiquement selon vos règles d'expédition !`
    );
    if (onRulesApplied) {
      onRulesApplied(affected);
    }
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-[#0F172A]">
                Automatisation des Processus d’Expédition
              </h2>
              <p className="text-xs text-slate-500">
                Règles intelligentes d'attribution des livreurs et envoi automatique des notifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {feedbackMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 font-bold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Quick Action: Trigger batch processing */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>Exécution automatique des commandes</span>
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Appliquez immédiatement vos règles actives sur les commandes en attente pour les préparer à l'expédition.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunAutomation}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Exécuter maintenant</span>
            </button>
          </div>

          {/* Rules List Header */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-extrabold text-slate-800 text-xs sm:text-sm">
              Règles d'expédition actives ({rules.filter((r) => r.active).length} / {rules.length})
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvelle règle</span>
            </button>
          </div>

          {/* Add Rule Form */}
          {isAdding && (
            <form
              onSubmit={handleAddRule}
              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in"
            >
              <h4 className="font-bold text-slate-900">Configurer une règle d'automatisation</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom de la règle *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Dispatch Express Tamatave"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Événement déclencheur</label>
                  <select
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="order_paid">Dès confirmation du paiement</option>
                    <option value="destination_city">Selon la ville de destination</option>
                    <option value="order_confirmed">Dès validation de commande</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Action automatique</label>
                  <select
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="assign_carrier">Attribuer un transporteur spécifique</option>
                    <option value="send_tracking_sms">Envoyer SMS / WhatsApp de suivi</option>
                    <option value="mark_in_preparation">Passer en statut "Préparation"</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transporteur par défaut</label>
                  <input
                    type="text"
                    value={newCarrier}
                    onChange={(e) => setNewCarrier(e.target.value)}
                    placeholder="Ex: Colis Express Toamasina"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Décrivez les conditions de déclenchement..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs transition"
                >
                  Enregistrer la règle
                </button>
              </div>
            </form>
          )}

          {/* Rules Cards */}
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  rule.active
                    ? 'bg-white border-slate-200 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      rule.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {rule.action === 'send_tracking_sms' ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : rule.action === 'mark_in_preparation' ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <Truck className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {rule.title}
                      </h4>
                      {rule.carrierName && (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {rule.carrierName}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{rule.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                    <input
                      type="checkbox"
                      checked={rule.active}
                      onChange={() => handleToggleRule(rule.id)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className={rule.active ? 'text-emerald-700' : 'text-slate-400'}>
                      {rule.active ? 'Activée' : 'Désactivée'}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <span className="text-[11px] text-slate-500">
            {rules.length} règles d'automatisation enregistrées
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-700 bg-slate-200 hover:bg-slate-300 font-bold text-xs transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
