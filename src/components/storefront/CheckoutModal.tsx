import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';
import { Order } from '../../types';
import {
  X,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  Mail,
  FileText,
  CreditCard,
  Truck,
  ArrowLeft,
  Check,
  ShieldCheck,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    appliedPromo,
    deliveryZones,
    paymentConfigs,
    activeStore,
    currency,
    createOrder,
    setTrackingOrderNumber,
    t,
  } = useApp();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Antananarivo');
  const [notes, setNotes] = useState('');

  // Delivery selection
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    deliveryZones[0]?.id || ''
  );

  // Payment selection
  const [selectedPayment, setSelectedPayment] = useState<Order['paymentMethod']>('Mvola');
  const [payerPhone, setPayerPhone] = useState('');
  const [paymentRef, setPaymentRef] = useState('');

  // Processing state & Success state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const currentZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];
  const freeThreshold = currentZone?.freeAboveAmount || activeStore.theme.freeShippingThreshold || 150000;
  const isFreeDelivery = cartSubtotal >= freeThreshold;
  const shippingCost = isFreeDelivery ? 0 : currentZone?.price || 5000;
  const totalAmount = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const activePaymentConfig = paymentConfigs.find((p) => p.name === selectedPayment);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrder({
        storeId: activeStore.id,
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || `${phone.replace(/\s+/g, '')}@client.mg`,
        customerAddress: address.trim(),
        city: city.trim(),
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          variantName: item.variantName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        subtotal: cartSubtotal,
        discountAmount,
        promoCode: appliedPromo?.code,
        shippingFee: shippingCost,
        total: totalAmount,
        paymentMethod: selectedPayment,
        paymentReference: paymentRef.trim() || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        status:
          selectedPayment === 'Paiement à la livraison'
            ? 'Nouvelle'
            : 'Payée',
        notes: notes.trim(),
      });

      setIsSubmitting(false);
      setCompletedOrder(newOrder);
    }, 1000);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  const handleTrackCreatedOrder = () => {
    if (completedOrder) {
      setTrackingOrderNumber(completedOrder.orderNumber);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-base sm:text-lg text-[#0F172A]">
              {completedOrder ? t.orderSuccessTitle : t.checkoutTitle}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">
                  {t.orderSuccessTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  {t.orderSuccessText}
                </p>
              </div>

              {/* Order Summary Pill */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>{t.orderNumber} :</span>
                  <span className="font-mono text-emerald-700">{completedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Destinataire :</span>
                  <span className="font-semibold text-slate-900">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Téléphone :</span>
                  <span className="font-semibold text-slate-900">{completedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Adresse :</span>
                  <span className="font-semibold text-slate-900">
                    {completedOrder.customerAddress}, {completedOrder.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Paiement :</span>
                  <span className="font-semibold text-emerald-600">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-slate-200 text-[#0F172A]">
                  <span>Total :</span>
                  <span className="text-emerald-600">{formatPrice(completedOrder.total, currency)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={handleTrackCreatedOrder}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-xs"
                >
                  {t.trackOrder}
                </button>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition"
                >
                  {t.backToStore}
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Order items preview snippet */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Résumé de votre commande ({cart.length} articles)
                </div>
                <div className="max-h-32 overflow-y-auto divide-y divide-slate-100 space-y-1 text-xs">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantName}`}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="truncate max-w-[240px]">
                        <span className="font-semibold text-slate-800">{item.productName}</span>
                        {item.variantName && (
                          <span className="text-[10px] text-emerald-600 ml-1">
                            ({item.variantName})
                          </span>
                        )}
                        <span className="text-slate-400 ml-1">x{item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatPrice(item.totalPrice, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Customer details */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>{t.contactInfo}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Harilala Randria"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.phone} (Mvola / Orange / Airtel) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+261 34 00 000 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.deliveryAddress} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Lot IVK 23 Bis, Ankadifotsy"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.city} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Antananarivo"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.email} (optionnel)
                  </label>
                  <input
                    type="email"
                    placeholder="client@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Step 2: Shipping Zone Selection */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Zone de livraison</span>
                </h3>

                <div className="grid grid-cols-1 gap-2">
                  {deliveryZones.map((z) => (
                    <label
                      key={z.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        selectedZoneId === z.id
                          ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="shipping_zone"
                          checked={selectedZoneId === z.id}
                          onChange={() => setSelectedZoneId(z.id)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{z.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Délai estimé : {z.estimatedDeliveryTime}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-emerald-600">
                        {cartSubtotal >= (z.freeAboveAmount || 150000) ? (
                          <span className="text-emerald-700 uppercase">Gratuit</span>
                        ) : (
                          formatPrice(z.price, currency)
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 3: Payment Method Selection */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>{t.paymentMethod}</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Mvola', label: 'Mvola (Telma)', color: 'border-emerald-500 bg-emerald-50' },
                    { id: 'Orange Money', label: 'Orange Money', color: 'border-orange-500 bg-orange-50' },
                    { id: 'Airtel Money', label: 'Airtel Money', color: 'border-red-500 bg-red-50' },
                    { id: 'Paiement à la livraison', label: 'À la livraison', color: 'border-slate-400 bg-slate-50' },
                    { id: 'Carte bancaire', label: 'Carte Bancaire', color: 'border-blue-500 bg-blue-50' },
                    { id: 'PayPal', label: 'PayPal', color: 'border-indigo-500 bg-indigo-50' },
                  ].map((method) => {
                    const isSelected = selectedPayment === method.id;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id as any)}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-start justify-center gap-1 ${
                          isSelected
                            ? `${method.color} ring-2 ring-emerald-500/30 text-slate-900 shadow-xs`
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{method.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Specific instructions for selected payment */}
                {activePaymentConfig && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                    <p className="text-slate-600 leading-relaxed">
                      {activePaymentConfig.instructions}
                    </p>
                    {activePaymentConfig.accountNumber && (
                      <div className="flex items-center gap-2 font-mono font-bold text-emerald-700">
                        <span>Compte marchand :</span>
                        <span>{activePaymentConfig.accountNumber}</span>
                        {activePaymentConfig.accountName && (
                          <span className="text-slate-500 text-[11px]">
                            ({activePaymentConfig.accountName})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Special instructions / notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.orderNotes}
                </label>
                <textarea
                  placeholder="Instructions d’accès, digicode ou horaire de livraison souhaité..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-emerald-500 h-16 resize-none"
                />
              </div>

              {/* Final Price Breakdown & Submit */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{t.subtotal}</span>
                  <span className="font-bold">{formatPrice(cartSubtotal, currency)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-rose-600 font-bold">
                    <span>{t.discount}</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{t.shippingFee}</span>
                  <span className="font-bold">
                    {shippingCost === 0 ? 'Gratuit' : formatPrice(shippingCost, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#0F172A] pt-1 border-t border-slate-100">
                  <span>{t.total}</span>
                  <span className="text-emerald-600 text-lg">
                    {formatPrice(totalAmount, currency)}
                  </span>
                </div>

                {/* Orange Action CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg shadow-orange-600/25 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t.processing}</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t.confirmOrder} ({formatPrice(totalAmount, currency)})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
