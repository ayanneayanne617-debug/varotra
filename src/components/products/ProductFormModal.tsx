import React, { useState, useRef } from 'react';
import { Product, ProductVariant } from '../../types';
import { StorageService } from '../../services/storage';
import { useApp } from '../../context/AppContext';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Layers,
  DollarSign,
  Barcode,
  Check,
  UploadCloud,
  RefreshCw,
  AlertCircle,
  FileImage,
} from 'lucide-react';

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
  
  // Direct device image upload state
  const [imageUrl, setImageUrl] = useState(productToEdit?.images[0] || '');
  const [imageFileName, setImageFileName] = useState(
    productToEdit?.images[0] ? 'Image actuelle' : ''
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tagsStr, setTagsStr] = useState(productToEdit?.tags?.join(', ') || 'nouveau, qualité');

  // Variants
  const [hasVariants, setHasVariants] = useState(productToEdit?.hasVariants || false);
  const [variants, setVariants] = useState<ProductVariant[]>(
    productToEdit?.variants || [
      { id: 'v1', name: 'Taille M - Vert', size: 'M', color: 'Vert', price: 25000, stock: 10, sku: 'VAR-01' },
      { id: 'v2', name: 'Taille L - Orange', size: 'L', color: 'Orange', price: 28000, stock: 10, sku: 'VAR-02' },
    ]
  );

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageError("Format non supporté. Veuillez importer un fichier image (JPG, PNG, WebP, GIF, SVG).");
      return;
    }

    setImageError(null);
    setIsProcessingImage(true);
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawData = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        // Optimize image to prevent localStorage quota exhaustion (max dimension 1200px)
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setImageUrl(compressed);
        } else {
          setImageUrl(rawData);
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        setImageUrl(rawData);
        setIsProcessingImage(false);
      };
      img.src = rawData;
    };
    reader.onerror = () => {
      setImageError("Erreur lors de la lecture du fichier depuis votre appareil.");
      setIsProcessingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImageFileName('');
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

    // If no image is provided, provide a clean fallback photo
    const finalImageUrl =
      imageUrl.trim() ||
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';

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
        images: [finalImageUrl],
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
        images: [finalImageUrl],
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

          {/* Direct Device Image Import & Tags */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-slate-700">
                  Image du produit (Import direct depuis l'appareil)
                </label>
                {imageUrl && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" /> Image sélectionnée
                  </span>
                )}
              </div>

              {/* Hidden Native File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {imageUrl ? (
                /* Uploaded Image Preview & Management Card */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`p-3.5 bg-slate-50 border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 transition ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300/80 shadow-xs group">
                      <img
                        src={imageUrl}
                        alt="Aperçu du produit"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-[10px] font-bold"
                      >
                        Changer
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <FileImage className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <p className="font-bold text-slate-800 truncate text-xs">
                          {imageFileName || 'Image du produit'}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Fichier chargé avec succès depuis votre appareil
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold underline mt-1 text-left block"
                      >
                        Remplacer par une autre photo
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs shadow-2xs transition"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                      Changer
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      title="Supprimer cette image"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Dropzone to select from device */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50 scale-[1.01]'
                      : 'border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/30'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shadow-xs">
                    {isProcessingImage ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <UploadCloud className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-xs sm:text-sm">
                      {isProcessingImage
                        ? "Importation et optimisation de l'image..."
                        : "Importer une image depuis votre appareil"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Cliquez pour choisir un fichier ou glissez-déposez ici (JPG, PNG, WEBP)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-50 px-3 py-1.5 rounded-xl shadow-2xs transition"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                    Parcourir les fichiers
                  </button>
                </div>
              )}

              {imageError && (
                <div className="mt-1.5 flex items-center gap-1.5 text-rose-600 text-[11px] font-medium bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{imageError}</span>
                </div>
              )}
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
