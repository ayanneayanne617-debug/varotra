import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryZone } from '../../types';
import { formatPrice } from '../../utils/currency';
import { Truck, Plus, Trash2, Edit2, Check, MapPin } from 'lucide-react';

export const ShippingManager: React.FC = () => {
  const { deliveryZones, updateDeliveryZones, currency, activeStore } = useApp();
  const [zones, setZones] = useState<DeliveryZone[]>(deliveryZones);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZonePrice, setNewZonePrice] = useState(5000);
  const [newZoneEstimate, setNewZoneEstimate] = useState('24h à 48h');
  const [newZoneThreshold, setNewZoneThreshold] = useState(150000);
  const [isAdding, setIsAdding] = useState(false);

  const handleToggleZone = (id: string) => {
    const updated = zones.map((z) => (z.id === id ? { ...z, enabled: !z.enabled } : z));
    setZones(updated);
    updateDeliveryZones(updated);
  };

  const handleDeleteZone = (id: string) => {
    const updated = zones.filter((z) => z.id !== id);
    setZones(updated);
    updateDeliveryZones(updated);
  };

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;

    const newZ: DeliveryZone = {
      id: `zone-${Date.now()}`,
      storeId: activeStore.id,
      name: newZoneName.trim(),
      price: Number(newZonePrice),
      estimatedDeliveryTime: newZoneEstimate.trim(),
      freeAboveAmount: Number(newZoneThreshold),
      enabled: true,
    };

    const updated = [...zones, newZ];
    setZones(updated);
    updateDeliveryZones(updated);
    setNewZoneName('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Zones & Frais de Livraison
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configurez les tarifs d'expédition à Madagascar, les délais et les seuils de gratuité
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Ajouter une zone</span>
        </button>
      </div>

      {/* Add New Zone Form */}
      {isAdding && (
        <form
          onSubmit={handleAddZone}
          className="bg-white p-5 rounded-3xl border border-emerald-300 shadow-sm space-y-3 animate-in fade-in"
        >
          <div className="font-extrabold text-sm text-[#0F172A]">Nouvelle Zone d'expédition</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nom de la zone *</label>
              <input
                type="text"
                required
                placeholder="Ex: Tamatave & Côte Est"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Frais de port (Ar)</label>
              <input
                type="number"
                required
                min={0}
                value={newZonePrice}
                onChange={(e) => setNewZonePrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Délai estimé</label>
              <input
                type="text"
                required
                placeholder="Ex: 2 à 4 jours"
                value={newZoneEstimate}
                onChange={(e) => setNewZoneEstimate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Livraison offerte dès (Ar)</label>
              <input
                type="number"
                min={0}
                value={newZoneThreshold}
                onChange={(e) => setNewZoneThreshold(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-xl text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Enregistrer la zone
            </button>
          </div>
        </form>
      )}

      {/* Zones list cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#0F172A]">{zone.name}</h3>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={zone.enabled}
                    onChange={() => handleToggleZone(zone.id)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className={zone.enabled ? 'text-emerald-700' : 'text-slate-400'}>
                    {zone.enabled ? 'Actif' : 'Désactivé'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mt-3 bg-slate-50 p-3 rounded-2xl">
                <div>
                  <div className="text-slate-400">Tarif standard :</div>
                  <div className="font-black text-emerald-600 text-sm">
                    {zone.price === 0 ? 'Gratuit' : formatPrice(zone.price, currency)}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400">Délai estimé :</div>
                  <div className="font-bold text-slate-800">{zone.estimatedDeliveryTime}</div>
                </div>

                {zone.freeAboveAmount && (
                  <div className="col-span-2 pt-1 border-t border-slate-200/60 text-slate-600">
                    Livraison offerte dès :{' '}
                    <span className="font-bold text-slate-900">
                      {formatPrice(zone.freeAboveAmount, currency)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleDeleteZone(zone.id)}
                className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer la zone</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
