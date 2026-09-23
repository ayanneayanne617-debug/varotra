import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { StockMovement, Product } from '../../types';
import {
  Boxes,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  History,
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const { products, activeStore, refreshProducts } = useApp();
  const [movements, setMovements] = useState<StockMovement[]>(() =>
    StorageService.getStockMovements(activeStore.id)
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState(5);
  const [adjustType, setAdjustType] = useState<'Entrée' | 'Sortie' | 'Correction'>('Entrée');
  const [adjustReason, setAdjustReason] = useState('Réapprovisionnement fournisseur');

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.lowStockAlert && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const change = adjustType === 'Sortie' ? -Math.abs(adjustQty) : Math.abs(adjustQty);
    const newStock = Math.max(0, selectedProduct.stock + change);

    StorageService.updateProduct({
      ...selectedProduct,
      stock: newStock,
    });

    StorageService.addStockMovement({
      storeId: activeStore.id,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: adjustType,
      quantity: change,
      previousStock: selectedProduct.stock,
      newStock,
      reason: adjustReason,
    });

    refreshProducts();
    setMovements(StorageService.getStockMovements(activeStore.id));
    setSelectedProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Gestion des Stocks & Mouvements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Surveillez les seuils d'alerte, réapprovisionnez et consultez l'historique des entrées/sorties
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold">Stock Global Actuel</div>
            <div className="text-2xl font-black text-[#0F172A]">{totalStock} unités</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold">Articles en stock faible</div>
            <div className="text-2xl font-black text-amber-600">{lowStockCount} articles</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold">Ruptures de stock</div>
            <div className="text-2xl font-black text-rose-600">{outOfStockCount} articles</div>
          </div>
        </div>
      </div>

      {/* Products Stock Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#0F172A]">Niveau de Stock par Produit</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Produit</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Disponibilité</th>
                <th className="py-3 px-4">Stock Actuel</th>
                <th className="py-3 px-4">Seuil d'Alerte</th>
                <th className="py-3 px-4 text-right">Ajuster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 flex items-center gap-2.5">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-9 h-9 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <span className="font-extrabold text-slate-900">{p.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{p.sku}</td>
                  <td className="py-3 px-4">
                    {p.stock <= 0 ? (
                      <span className="text-rose-700 bg-rose-50 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                        Rupture de stock
                      </span>
                    ) : p.stock <= p.lowStockAlert ? (
                      <span className="text-amber-700 bg-amber-50 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                        Stock faible
                      </span>
                    ) : (
                      <span className="text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        En stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900 text-sm">{p.stock}</td>
                  <td className="py-3 px-4 text-slate-500">{p.lowStockAlert} unités</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-200 transition"
                    >
                      Ajuster le stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movements History */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-600" />
          <span>Historique Récent des Mouvements de Stock</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Produit</th>
                <th className="py-2.5">Type</th>
                <th className="py-2.5">Variation</th>
                <th className="py-2.5">Nouveau Stock</th>
                <th className="py-2.5">Motif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.slice(0, 10).map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="py-2 text-slate-500">
                    {new Date(m.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-2 font-bold text-slate-800">{m.productName}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        m.type === 'Entrée'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.type === 'Vente'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {m.type}
                    </span>
                  </td>
                  <td
                    className={`py-2 font-black ${
                      m.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </td>
                  <td className="py-2 font-mono font-bold text-slate-800">{m.newStock}</td>
                  <td className="py-2 text-slate-500">{m.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-[#0F172A]">
                Ajuster le stock : {selectedProduct.name}
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Type d'opération</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Entrée', 'Sortie', 'Correction'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAdjustType(t)}
                      className={`py-2 rounded-xl font-bold border transition ${
                        adjustType === t
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantité</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Motif du mouvement</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Ex: Arrivage cargaison, perte, inventaire physique..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded-xl transition"
                >
                  Confirmer le mouvement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
