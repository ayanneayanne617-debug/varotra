import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';
import { ProductFormModal } from './ProductFormModal';
import { BulkProductImportModal } from './BulkProductImportModal';
import {
  Plus,
  Search,
  Filter,
  Copy,
  Edit2,
  Trash2,
  Download,
  Upload,
  ArrowUpDown,
  Check,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';

export const ProductsManager: React.FC = () => {
  const { products, categories, activeStore, currency, refreshProducts } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'stock'>('name');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Filter products
  const filtered = products
    .filter((p) => {
      const matchesCat = selectedCat === 'all' || p.category === selectedCat;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const matchesStock =
        stockFilter === 'all'
          ? true
          : stockFilter === 'low'
          ? p.stock <= p.lowStockAlert && p.stock > 0
          : p.stock <= 0;

      return matchesCat && matchesSearch && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      return 0;
    });

  const handleDelete = (id: string, name: string) => {
    setProductToDelete({ id, name });
  };

  const confirmDelete = () => {
    if (productToDelete) {
      StorageService.deleteProduct(productToDelete.id);
      refreshProducts();
      setProductToDelete(null);
      setNotification(`Produit « ${productToDelete.name} » supprimé avec succès.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDuplicate = (id: string) => {
    StorageService.duplicateProduct(id);
    refreshProducts();
    setNotification('Produit dupliqué avec succès.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportCSV = () => {
    const headers = ['Nom', 'Catégorie', 'Prix MGA', 'Stock', 'SKU', 'Seuil Alerte'];
    const rows = products.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price,
      p.stock,
      p.sku,
      p.lowStockAlert,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `catalogue_${activeStore.slug}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length > 1) {
        // Skip header
        let importedCount = 0;
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',');
          if (cols.length >= 3) {
            const name = cols[0].replace(/"/g, '').trim();
            const cat = cols[1]?.replace(/"/g, '').trim() || 'Divers';
            const price = Number(cols[2]) || 10000;
            const stock = Number(cols[3]) || 10;
            const sku = cols[4]?.trim() || `SKU-${Date.now()}-${i}`;

            StorageService.addProduct({
              storeId: activeStore.id,
              name,
              category: cat,
              price,
              costPrice: Math.round(price * 0.6),
              stock,
              lowStockAlert: 5,
              sku,
              description: `Produit importé : ${name}`,
              images: [
                'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
              ],
              tags: ['import'],
            });
            importedCount++;
          }
        }
        refreshProducts();
        setNotification(`${importedCount} produits importés avec succès depuis le CSV !`);
        setTimeout(() => setNotification(null), 4000);
      }
    };
    reader.readAsText(file);
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
            Gestion du Catalogue ({products.length} produits)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ajoutez, éditez vos articles, suivez les stocks et importez/exportez vos catalogues
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* CSV Mass Import Modal Trigger */}
          <button
            onClick={() => setIsBulkImportOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer transition shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Import CSV massif</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2.5 rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {/* ORANGE Add Button */}
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsFormModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-orange-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Ajouter un produit</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Chercher par nom, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category & Stock & Sort filters */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="all">Toutes les catégories</option>
            {categories
              .filter((c) => c.slug !== 'all')
              .map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="all">Tous les stocks</option>
            <option value="low">Stock faible</option>
            <option value="out">Rupture de stock</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="name">Trier par Nom</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="stock">Niveau de stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Produit</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4">Prix</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={prod.images[0]}
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div>
                      <div className="font-extrabold text-sm text-[#0F172A]">{prod.name}</div>
                      {prod.hasVariants && (
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          {prod.variants?.length} variantes
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-600">{prod.category}</td>
                  <td className="py-3 px-4 font-black text-emerald-600 text-sm">
                    {formatPrice(prod.price, currency)}
                  </td>
                  <td className="py-3 px-4">
                    {prod.stock <= 0 ? (
                      <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        Rupture
                      </span>
                    ) : prod.stock <= prod.lowStockAlert ? (
                      <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        Faible ({prod.stock})
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        {prod.stock} unités
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{prod.sku}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleDuplicate(prod.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        title="Dupliquer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setProductToEdit(prod);
                          setIsFormModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isFormModalOpen && (
        <ProductFormModal
          productToEdit={productToEdit}
          onClose={() => setIsFormModalOpen(false)}
          onSaved={() => refreshProducts()}
        />
      )}

      {/* Bulk CSV Import Modal */}
      {isBulkImportOpen && (
        <BulkProductImportModal
          onClose={() => setIsBulkImportOpen(false)}
          onImportComplete={(count) => {
            setNotification(`${count} produit${count > 1 ? 's' : ''} importé${count > 1 ? 's' : ''} avec succès dans le catalogue !`);
            setTimeout(() => setNotification(null), 4000);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#0F172A]">Confirmer la suppression</h3>
              <p className="text-xs text-slate-500 mt-1">
                Êtes-vous sûr de vouloir supprimer définitivement « <span className="font-bold text-slate-800">{productToDelete.name}</span> » ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
