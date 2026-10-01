import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';
import {
  X,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Info,
  Check,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ParsedProduct {
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  costPrice: number;
  stock: number;
  lowStockAlert: number;
  sku: string;
  description: string;
  tags: string[];
  imageUrl: string;
  isValid: boolean;
  warnings: string[];
}

interface BulkProductImportModalProps {
  onClose: () => void;
  onImportComplete: (count: number) => void;
}

export const BulkProductImportModal: React.FC<BulkProductImportModalProps> = ({
  onClose,
  onImportComplete,
}) => {
  const { activeStore, categories, currency, refreshProducts } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importMode, setImportMode] = useState<'add_new' | 'update_sku'>('add_new');
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper to download the official CSV template
  const handleDownloadTemplate = () => {
    const headers = [
      'Nom',
      'Categorie',
      'Prix',
      'Prix_Barre',
      'Cout',
      'Stock',
      'Seuil_Alerte',
      'SKU',
      'Description',
      'Tags',
      'Image_URL',
    ];

    const sampleRows = [
      [
        '"Vanille Bourbon Noire Gourmet (10 gousses)"',
        '"Vanille & Épices"',
        '45000',
        '55000',
        '28000',
        '30',
        '5',
        '"VAN-BGR-10"',
        '"Gousses charnues de Sambava sélectionnées à la main, humidité 33%, arôme vanilline intense."',
        '"vanille, sambava, gourmet, bio"',
        '"https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80"',
      ],
      [
        '"Panier en Raphia Tressé Main - Grand Format"',
        '"Artisanat & Décoration"',
        '35000',
        '42000',
        '18000',
        '15',
        '3',
        '"ART-RAPH-01"',
        '"Panier tressé à la main avec poignées en cuir véritable et motifs géométriques traditionnels."',
        '"raphia, panier, fait main, artisanat"',
        '"https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80"',
      ],
      [
        '"Poivre Sauvage Voatsiperifery de Madagascar (100g)"',
        '"Vanille & Épices"',
        '28000',
        '0',
        '14000',
        '50',
        '10',
        '"EP-VOATS-100"',
        '"Poivre d’exception cueilli sur les lianes de la canopée tropicale. Notes boisées et florales uniques."',
        '"poivre, voatsiperifery, epices"',
        '"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"',
      ],
    ];

    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...sampleRows.map((r) => r.join(';'))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `modele_import_catalogue_varotra.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Robust CSV parser supporting quotes, commas, and semicolons
  const parseCSVText = (text: string) => {
    setErrorMsg(null);
    setIsParsing(true);

    try {
      const cleanText = text.replace(/^\uFEFF/, '').trim();
      const lines = cleanText.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);

      if (lines.length < 2) {
        setErrorMsg('Le fichier CSV est vide ou ne contient que la ligne d’en-tête.');
        setIsParsing(false);
        return;
      }

      // Detect delimiter from first line (comma or semicolon)
      const firstLine = lines[0];
      const delimiter = firstLine.split(';').length >= firstLine.split(',').length ? ';' : ',';

      // Parse line with quotes support
      const parseLine = (line: string): string[] => {
        const result: string[] = [];
        let cur = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              cur += '"';
              i++; // skip escaped quote
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === delimiter && !inQuotes) {
            result.push(cur.trim());
            cur = '';
          } else {
            cur += char;
          }
        }
        result.push(cur.trim());
        return result;
      };

      const headerCols = parseLine(lines[0]).map((h) =>
        h.toLowerCase().replace(/[^a-z0-9]/g, '')
      );

      // Find column indices
      const idxName = headerCols.findIndex((h) => h.includes('nom') || h.includes('name') || h.includes('titre'));
      const idxCat = headerCols.findIndex((h) => h.includes('cat'));
      const idxPrice = headerCols.findIndex((h) => h.includes('prix') || h.includes('price'));
      const idxOrigPrice = headerCols.findIndex((h) => h.includes('barre') || h.includes('orig'));
      const idxCost = headerCols.findIndex((h) => h.includes('cout') || h.includes('cost'));
      const idxStock = headerCols.findIndex((h) => h.includes('stock') || h.includes('quant'));
      const idxAlert = headerCols.findIndex((h) => h.includes('seuil') || h.includes('alert'));
      const idxSku = headerCols.findIndex((h) => h.includes('sku') || h.includes('ref'));
      const idxDesc = headerCols.findIndex((h) => h.includes('desc'));
      const idxTags = headerCols.findIndex((h) => h.includes('tag'));
      const idxImage = headerCols.findIndex((h) => h.includes('image') || h.includes('photo') || h.includes('url'));

      const defaultCategory = categories[1]?.name || 'Divers';
      const items: ParsedProduct[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = parseLine(lines[i]);
        if (cols.length === 0 || cols.every((c) => !c)) continue;

        const rawName = idxName >= 0 ? cols[idxName] : cols[0];
        const name = (rawName || `Produit #${i}`).replace(/^"|"$/g, '').trim();

        const rawCat = idxCat >= 0 ? cols[idxCat] : cols[1];
        const category = (rawCat || defaultCategory).replace(/^"|"$/g, '').trim();

        const rawPrice = idxPrice >= 0 ? cols[idxPrice] : cols[2];
        const cleanPrice = Number(String(rawPrice || '').replace(/[^0-9.]/g, '')) || 10000;

        const rawOrigPrice = idxOrigPrice >= 0 ? cols[idxOrigPrice] : undefined;
        const origPrice = rawOrigPrice ? Number(String(rawOrigPrice).replace(/[^0-9.]/g, '')) : undefined;

        const rawCost = idxCost >= 0 ? cols[idxCost] : undefined;
        const costPrice = rawCost
          ? Number(String(rawCost).replace(/[^0-9.]/g, ''))
          : Math.round(cleanPrice * 0.6);

        const rawStock = idxStock >= 0 ? cols[idxStock] : cols[3];
        const stock = rawStock ? Number(String(rawStock).replace(/[^0-9]/g, '')) : 10;

        const rawAlert = idxAlert >= 0 ? cols[idxAlert] : undefined;
        const lowStockAlert = rawAlert ? Number(String(rawAlert).replace(/[^0-9]/g, '')) : 5;

        const rawSku = idxSku >= 0 ? cols[idxSku] : cols[4];
        const warnings: string[] = [];

        let sku = (rawSku || '').replace(/^"|"$/g, '').trim();
        if (!sku) {
          sku = `SKU-AUTO-${Date.now().toString().slice(-4)}-${i}`;
          warnings.push('SKU généré automatiquement');
        }

        const rawDesc = idxDesc >= 0 ? cols[idxDesc] : '';
        const description = (rawDesc || `Produit de qualité supérieure ${name}`).replace(/^"|"$/g, '').trim();

        const rawTags = idxTags >= 0 ? cols[idxTags] : '';
        const tags = (rawTags || 'import, catalogue')
          .replace(/^"|"$/g, '')
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);

        const rawImage = idxImage >= 0 ? cols[idxImage] : '';
        const imageUrl =
          (rawImage || '').replace(/^"|"$/g, '').trim() ||
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';

        const isValid = Boolean(name && cleanPrice > 0);

        items.push({
          name,
          category,
          price: cleanPrice,
          originalPrice: origPrice && origPrice > 0 ? origPrice : undefined,
          costPrice,
          stock: Math.max(0, stock),
          lowStockAlert,
          sku,
          description,
          tags,
          imageUrl,
          isValid,
          warnings,
        });
      }

      setParsedProducts(items);
      setIsParsing(false);
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur lors du traitement du fichier CSV. Vérifiez l’encodage et les colonnes.');
      setIsParsing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        parseCSVText(text);
      };
      reader.readAsText(selected, 'UTF-8');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (!droppedFile.name.endsWith('.csv') && !droppedFile.type.includes('csv')) {
        setErrorMsg('Veuillez déposer un fichier au format .CSV');
        return;
      }
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        parseCSVText(text);
      };
      reader.readAsText(droppedFile, 'UTF-8');
    }
  };

  const handleExecuteImport = () => {
    if (parsedProducts.length === 0) return;

    setIsImporting(true);
    setImportProgress(10);

    const validItems = parsedProducts.filter((p) => p.isValid);

    const productsToInsert: Omit<Product, 'id' | 'createdAt'>[] = validItems.map((p) => ({
      storeId: activeStore.id,
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      costPrice: p.costPrice,
      stock: p.stock,
      lowStockAlert: p.lowStockAlert,
      sku: p.sku,
      images: [p.imageUrl],
      tags: p.tags,
      hasVariants: false,
      rating: 5.0,
      reviewCount: 1,
    }));

    setTimeout(() => {
      setImportProgress(60);
      const result = StorageService.bulkAddProducts(productsToInsert, importMode);
      setImportProgress(100);

      setTimeout(() => {
        refreshProducts();
        setIsImporting(false);
        onImportComplete(result.added + result.updated);
        onClose();
      }, 400);
    }, 400);
  };

  const validCount = parsedProducts.filter((p) => p.isValid).length;
  const invalidCount = parsedProducts.length - validCount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-[#0F172A]">
                Importation Massive de Produits (CSV)
              </h2>
              <p className="text-xs text-slate-500">
                Ajoutez ou mettez à jour des dizaines d’articles en quelques secondes
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
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs flex-1">
          {/* Step 1: Download Template Callout */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100/70 rounded-xl text-emerald-800 shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                  Besoin du modèle CSV prêt à l'emploi ?
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Téléchargez notre fichier modèle pré-formaté avec les colonnes requises (Nom, Catégorie, Prix, Stock, SKU, etc.).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold rounded-xl shadow-2xs transition shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Télécharger le modèle CSV</span>
            </button>
          </div>

          {/* Step 2: Upload Dropzone */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, text/csv, application/vnd.ms-excel"
            onChange={handleFileChange}
            className="hidden"
          />

          {!file && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/60 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                {isParsing ? (
                  <RefreshCw className="w-7 h-7 animate-spin" />
                ) : (
                  <Upload className="w-7 h-7" />
                )}
              </div>
              <div>
                <p className="font-extrabold text-slate-800 text-sm sm:text-base">
                  Glissez votre fichier CSV ici ou cliquez pour parcourir
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Formats supportés : Fichiers .csv séparés par virgule ou point-virgule (UTF-8)
                </p>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition"
              >
                Sélectionner un fichier CSV
              </button>
            </div>
          )}

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 3: Parsed Data Preview & Validation */}
          {parsedProducts.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
                    {parsedProducts.length}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800">
                      {file?.name || 'Fichier CSV importé'}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {validCount} ligne{validCount > 1 ? 's' : ''} valide{validCount > 1 ? 's' : ''}
                      </span>
                      {invalidCount > 0 && (
                        <span className="text-amber-700 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          {invalidCount} à corriger
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setParsedProducts([]);
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition"
                  >
                    Changer de fichier
                  </button>
                </div>
              </div>

              {/* Mode Options */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 space-y-2">
                <span className="font-extrabold text-slate-800 block text-xs">
                  Comportement lors de l'import :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                      importMode === 'add_new'
                        ? 'bg-emerald-50/50 border-emerald-500 text-emerald-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'add_new'}
                      onChange={() => setImportMode('add_new')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span>Ajouter tous les produits</span>
                      <p className="text-[10px] text-slate-500 font-normal">
                        Crée chaque ligne comme un nouvel article dans le catalogue.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                      importMode === 'update_sku'
                        ? 'bg-emerald-50/50 border-emerald-500 text-emerald-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'update_sku'}
                      onChange={() => setImportMode('update_sku')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span>Mettre à jour les doublons SKU</span>
                      <p className="text-[10px] text-slate-500 font-normal">
                        Si le code SKU existe déjà, met à jour le prix et le stock existant.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 sticky top-0 font-bold text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Produit</th>
                        <th className="py-2.5 px-3">Catégorie</th>
                        <th className="py-2.5 px-3">Prix</th>
                        <th className="py-2.5 px-3">Stock</th>
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3 text-right">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedProducts.map((p, index) => (
                        <tr
                          key={index}
                          className={`hover:bg-slate-50/70 transition ${
                            !p.isValid ? 'bg-rose-50/30' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-7 h-7 rounded-lg object-cover bg-slate-200 shrink-0"
                              />
                              <span className="font-bold text-slate-800 truncate max-w-[180px]">
                                {p.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{p.category}</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-700 whitespace-nowrap">
                            {formatPrice(p.price, currency)}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">{p.stock}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                            {p.sku}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            {p.isValid ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <Check className="w-3 h-3 text-emerald-600" /> Prêt
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                Nom ou prix manquant
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Progress bar when importing */}
              {isImporting && (
                <div className="space-y-1.5 bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-2xl">
                  <div className="flex justify-between font-bold text-emerald-900 text-xs">
                    <span>Importation en cours dans le catalogue...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold transition cursor-pointer"
          >
            Fermer
          </button>

          {parsedProducts.length > 0 && (
            <button
              type="button"
              disabled={isImporting || validCount === 0}
              onClick={handleExecuteImport}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white shadow-xs transition cursor-pointer ${
                validCount > 0 && !isImporting
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              {isImporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <span>Valider l’import de {validCount} produit{validCount > 1 ? 's' : ''}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
