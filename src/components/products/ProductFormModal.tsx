import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types';
import { StorageService } from '../../services/storage';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, Image, Layers, DollarSign, Barcode, Check } from 'lucide-react';

interface ProductFormModalProps {
  productToEdit?: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  productToEdit,
  onClose,
  onSaved,
}) => {
  const { activeStore, categories } = useApp();

  const [name, setName] = useState(productToEdit?.name || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [category, setCategory] = useState(
    productToEdit?.category || categories[1]?.name || 'Vanille & Épices'
  );
  const [price, setPrice] = useState(productToEdit?.price || 25000);
  const [originalPrice, setOriginalPrice] = useState(productToEdit?.originalPrice || 0);
  const [costPrice, setCostPrice] = useState(productToEdit?.costPrice || 15000);
  const [stock, setStock] = useState(productToEdit?.stock ?? 20);
  const [lowStockAlert, setLowStockAlert] = useState(productToEdit?.lowStockAlert ?? 5);
  const [sku, setSku] = useState(productToEdit?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [imageUrl, setImageUrl] = useState(
    productToEdit?.images[0] ||
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
  );
  const [tagsStr, setTagsStr] = useState(productToEdit?.tags?.join(', ') || 'nouveau, qualité');

  // Variants
  const [hasVariants, setHasVariants] = useState(productToEdit?.hasVariants || false);
  const [variants, setVariants] = useState<ProductVariant[]>(
    productToEdit?.variants || [
      { id: 'v1', name: 'Taille M - Vert', size: 'M', color: 'Vert', price: 25000, stock: 10, sku: 'VAR-01' },
      { id: 'v2', name: 'Taille L - Orange', size: 'L', color: 'Orange', price: 28000, stock: 10, sku: 'VAR-02' },
    ]
  );

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: `var-${Date.now()}`,
        name: `Option ${variants.length + 1}`,
        size: 'M',
        color: 'Vert',
        price,
        stock: 5,
        sku: `${sku}-V${variants.length + 1}`,
      },
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (productToEdit) {
      StorageService.updateProduct({
        ...productToEdit,
        name: name.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        costPrice: Number(costPrice),
        stock: Number(stock),
        lowStockAlert: Number(lowStockAlert),
        sku: sku.trim(),
        images: [imageUrl.trim()],
        tags,
        hasVariants,
        variants: hasVariants ? variants : [],
      });
    } else {
      StorageService.addProduct({
        storeId: activeStore.id,
        name: name.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        costPrice: Number(costPrice),
        stock: Number(stock),
        lowStockAlert: Number(lowStockAlert),
        sku: sku.trim(),
        images: [imageUrl.trim()],
        tags,
        hasVariants,
        variants: hasVariants ? variants : [],
        rating: 5.0,
        reviewCount: 1,
      });
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="font-extrabold text-base sm:text-lg text-[#0F172A]">
            {productToEdit ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Nom & Catégorie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nom du produit *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Vanille Bourbon Gourmet"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Catégorie *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
              >
                {categories
                  .filter((c) => c.slug !== 'all')
                  .map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description détaillée</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez les atouts, l'origine et les spécificités du produit..."
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Pricing Row: Prix actuel, Prix barré, Coût d'achat */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Prix de vente (Ar) *</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-emerald-600 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ancien prix (Barré)</label>
              <input
                type="number"
                min={0}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                placeholder="Optionnel"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-500 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Coût d'achat (Marge)</label>
              <input
                type="number"
                min={0}
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Stock & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Stock disponible *</label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Seuil alerte stock faible</label>
              <input
                type="number"
                min={1}
                value={lowStockAlert}
                onChange={(e) => setLowStockAlert(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Code SKU / Référence</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Photo URL & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">URL de l'image</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tags (séparés par virgule)</label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="bio, vanille, export"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Variants Toggle & Editor */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Ce produit a plusieurs variantes (Taille, Couleur, etc.)</span>
              </label>

              {hasVariants && (
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" />
                  Ajouter option
                </button>
              )}
            </div>

            {hasVariants && (
              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                {variants.map((v, i) => (
                  <div key={v.id} className="grid grid-cols-5 gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Nom (ex: Taille L)"
                      value={v.name}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[i].name = e.target.value;
                        setVariants(copy);
                      }}
                      className="col-span-2 bg-white border border-slate-200 rounded-lg px-2 py-1"
                    />
                    <input
                      type="number"
                      placeholder="Prix"
                      value={v.price}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[i].price = Number(e.target.value);
                        setVariants(copy);
                      }}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={v.stock}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[i].stock = Number(e.target.value);
                        setVariants(copy);
                      }}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(v.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 flex justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-xl shadow-xs transition"
            >
              Enregistrer le produit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
