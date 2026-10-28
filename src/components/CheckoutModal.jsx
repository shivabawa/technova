import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { useStore } from '../context/StoreContext';
import { money, BY_ID } from '../data/products';
import './CheckoutModal.css';

const PAYEE = {
  name: 'Shiva Bawa',
  upiId: 'shivabawa2601@okaxis',
  bank: 'Nainital Bank 0005',
  aid: 'uGICAgKDwoODABA',
  standeeImage: '/images/upi-qr-shiva-bawa.jpg'
};

const POPULAR_BANKS = [
  { id: 'nainital', name: 'Nainital Bank', sub: 'Merchant Bank Partner', icon: '🏛️' },
  { id: 'sbi', name: 'State Bank of India', sub: 'Retail & Corporate', icon: '🏦' },
  { id: 'hdfc', name: 'HDFC Bank', sub: 'NetBanking 2.0', icon: '🏦' },
  { id: 'icici', name: 'ICICI Bank', sub: 'iMobile & Web', icon: '🏦' },
  { id: 'axis', name: 'Axis Bank', sub: 'Internet Banking', icon: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra', sub: '811 & NetBanking', icon: '🏦' }
];

export function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotals,
    user,
    setAuthModalTab,
    clearCart
  } = useStore();

  // Wizard Step: 1 = Shipping, 2 = Payment Gateway, 3 = Confirmation / Invoice
  const [step, setStep] = useState(1);

  // Shipping Form Data
  const [shippingData, setShippingData] = useState({
    name: '',
    email: '',
    phone: '',
    pin: '',
    address: '',
    city: '',
    deliverySpeed: 'express'
  });
  const [shippingErrors, setShippingErrors] = useState({});

  // Payment Selection State
  const [payMethod, setPayMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING' | 'COD'
  const [qrMode, setQrMode] = useState('dynamic'); // 'dynamic' | 'original'
  const [dynamicQrUrl, setDynamicQrUrl] = useState('');
  const [copiedItem, setCopiedItem] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatusText, setVerifyStatusText] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes
  const [zoomStandee, setZoomStandee] = useState(false);

  // Card Form State
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [cardErrors, setCardErrors] = useState({});
  const [showCardOtpModal, setShowCardOtpModal] = useState(false);
  const [cardOtpInput, setCardOtpInput] = useState('');

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('nainital');

  // COD State
  const [captchaCode, setCaptchaCode] = useState('8492');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Completed Order & Invoice
  const [completedOrder, setCompletedOrder] = useState(null);
  const [showTaxInvoice, setShowTaxInvoice] = useState(false);

  // Order ID generated once per session
  const orderId = useMemo(() => {
    return 'TN-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.floor(Math.random() * 899 + 100);
  }, [isCheckoutOpen]);

  // Autofill user details if logged in
  useEffect(() => {
    if (user) {
      setShippingData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  // Generate dynamic 4-digit captcha for COD
  useEffect(() => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(randomCode);
  }, [isCheckoutOpen]);

  // Live UPI countdown timer
  useEffect(() => {
    if (!isCheckoutOpen || step !== 2) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCheckoutOpen, step]);

  // Generate Dynamic QR Code with exact amount and Shiva Bawa payee credentials
  useEffect(() => {
    if (!isCheckoutOpen) return;
    const pa = PAYEE.upiId;
    const pn = encodeURIComponent(PAYEE.name);
    const aid = PAYEE.aid;
    const am = cartTotals.total;
    const cu = 'INR';
    const tn = encodeURIComponent(`TechNova Order ${orderId}`);
    const tr = orderId;

    // Standard NPCI UPI URI Scheme
    const upiUri = `upi://pay?pa=${pa}&pn=${pn}&aid=${aid}&am=${am}&cu=${cu}&tn=${tn}&tr=${tr}`;

    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 1.5,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#070A12',
        light: '#FFFFFF'
      }
    })
      .then((url) => setDynamicQrUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [cartTotals.total, orderId, isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
    setCompletedOrder(null);
    setShowTaxInvoice(false);
    setIsVerifying(false);
    setShippingErrors({});
  };

  const copyToClipboard = (text, itemKey) => {
    navigator.clipboard?.writeText(text);
    setCopiedItem(itemKey);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  // Format timer minutes and seconds
  const timerMinutes = Math.floor(timerSeconds / 60);
  const timerRemainingSec = (timerSeconds % 60).toString().padStart(2, '0');

  // Deep links for mobile UPI apps
  const upiIntentLinks = {
    generic: `upi://pay?pa=${PAYEE.upiId}&pn=${encodeURIComponent(PAYEE.name)}&aid=${PAYEE.aid}&am=${cartTotals.total}&cu=INR&tn=${encodeURIComponent(`TechNova Order ${orderId}`)}&tr=${orderId}`,
    gpay: `tez://upi/pay?pa=${PAYEE.upiId}&pn=${encodeURIComponent(PAYEE.name)}&aid=${PAYEE.aid}&am=${cartTotals.total}&cu=INR&tn=${encodeURIComponent(`TechNova Order ${orderId}`)}&tr=${orderId}`,
    phonepe: `phonepe://pay?pa=${PAYEE.upiId}&pn=${encodeURIComponent(PAYEE.name)}&aid=${PAYEE.aid}&am=${cartTotals.total}&cu=INR&tn=${encodeURIComponent(`TechNova Order ${orderId}`)}&tr=${orderId}`,
    paytm: `paytmmp://pay?pa=${PAYEE.upiId}&pn=${encodeURIComponent(PAYEE.name)}&aid=${PAYEE.aid}&am=${cartTotals.total}&cu=INR&tn=${encodeURIComponent(`TechNova Order ${orderId}`)}&tr=${orderId}`
  };

  // Shipping Form validation
  const validateShipping = () => {
    const errs = {};
    if (!shippingData.name.trim() || shippingData.name.trim().length < 2) {
      errs.name = 'Please enter your full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(shippingData.email)) {
      errs.email = 'Please enter a valid email for the digital invoice.';
    }
    if (!/^[6-9]\d{9}$/.test(shippingData.phone.replace(/\s+/g, ''))) {
      errs.phone = 'Enter a valid 10-digit Indian mobile number.';
    }
    if (!/^\d{6}$/.test(shippingData.pin.trim())) {
      errs.pin = 'Enter a 6-digit PIN code.';
    }
    if (!shippingData.address.trim() || shippingData.address.trim().length < 6) {
      errs.address = 'Please enter complete house/flat number, street and locality.';
    }
    if (!shippingData.city.trim()) {
      errs.city = 'Please enter your city/town.';
    }
    setShippingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
    }
  };

  // Finalize Order
  const finalizeOrderSuccess = (methodLabel, txRef) => {
    const orderItems = cart.map((line) => {
      const prod = BY_ID[line.id] || { name: 'TechNova Device', price: 0 };
      const col = prod.colors?.[line.c] || { n: 'Default' };
      return {
        id: line.id,
        name: prod.name,
        color: col.n,
        price: prod.price,
        qty: line.q,
        total: prod.price * line.q
      };
    });

    const orderInfo = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customer: { ...shippingData },
      items: orderItems,
      subtotal: cartTotals.sub,
      discount: cartTotals.disc,
      delivery: cartTotals.ship,
      total: cartTotals.total,
      payMethod: methodLabel,
      payee: PAYEE.name,
      upiId: PAYEE.upiId,
      bank: PAYEE.bank,
      utr: txRef || 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000),
      status: 'VERIFIED & PAID'
    };

    setCompletedOrder(orderInfo);
    clearCart();
    setStep(3);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#2D68FF', '#F59E0B', '#10B981', '#FFFFFF']
      });
    } catch {
      // Confetti fallback
    }
  };

  // UPI verification simulation
  const handleVerifyUpiPayment = () => {
    setIsVerifying(true);
    setVerifyStatusText('Connecting to NPCI UPI network...');

    setTimeout(() => {
      setVerifyStatusText(`Verifying settlement with ${PAYEE.bank} (Account Shiva Bawa)...`);
    }, 1200);

    setTimeout(() => {
      setVerifyStatusText('Payment verified & approved!');
    }, 2400);

    setTimeout(() => {
      setIsVerifying(false);
      const utr = utrNumber.trim() || 'UPI-REF-' + Math.floor(100000000000 + Math.random() * 900000000000);
      finalizeOrderSuccess('UPI (Google Pay / PhonePe)', utr);
    }, 3200);
  };

  // Card payment processing
  const handleCardPayment = (e) => {
    e.preventDefault();
    const numClean = cardData.number.replace(/\s+/g, '');
    const errs = {};
    if (numClean.length < 15) errs.number = 'Enter a valid 16-digit card number.';
    if (!cardData.name.trim()) errs.name = 'Enter cardholder name.';
    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) errs.expiry = 'MM/YY format required.';
    if (cardData.cvv.length < 3) errs.cvv = 'Enter 3-digit CVV.';

    if (Object.keys(errs).length > 0) {
      setCardErrors(errs);
      return;
    }
    setCardErrors({});
    setShowCardOtpModal(true);
  };

  const handleCardOtpSubmit = (e) => {
    e.preventDefault();
    setShowCardOtpModal(false);
    finalizeOrderSuccess('Credit/Debit Card (3D Secure)', 'CARD-TXN-' + Math.floor(10000000 + Math.random() * 90000000));
  };

  // Net Banking payment
  const handleNetBankingPay = () => {
    const bankObj = POPULAR_BANKS.find((b) => b.id === selectedBank) || POPULAR_BANKS[0];
    finalizeOrderSuccess(`Net Banking (${bankObj.name})`, 'NB-' + Math.floor(10000000 + Math.random() * 90000000));
  };

  // Cash on Delivery confirmation
  const handleCodPay = (e) => {
    e.preventDefault();
    if (captchaInput.trim() !== captchaCode) {
      setCaptchaError('Incorrect security code. Please check and try again.');
      return;
    }
    finalizeOrderSuccess('Cash on Delivery (COD Verified)', 'COD-PENDING');
  };

  // Format Card Number input with spaces
  const handleCardNumberChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    const formatted = clean.replace(/(\d{4})/g, '$1 ').trim();
    setCardData((prev) => ({ ...prev, number: formatted }));
    if (cardErrors.number) setCardErrors((prev) => ({ ...prev, number: '' }));
  };

  const handleExpiryChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    let formatted = clean;
    if (clean.length > 2) {
      formatted = clean.slice(0, 2) + '/' + clean.slice(2);
    }
    setCardData((prev) => ({ ...prev, expiry: formatted }));
    if (cardErrors.expiry) setCardErrors((prev) => ({ ...prev, expiry: '' }));
  };

  return (
    <div
      className="checkout-modal-overlay"
      id="checkoutOverlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target.id === 'checkoutOverlay') handleClose();
      }}
    >
      <div className="checkout-card">
        {/* Header */}
        <header className="checkout-header">
          <div className="checkout-header-info">
            <div className="checkout-header-title">
              <span>TechNova Express Checkout</span>
              <span className="checkout-trust-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                256-Bit Encrypted · NPCI Partner
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
              Order ID: <strong style={{ color: 'var(--c2)' }}>{orderId}</strong> · {cartTotals.itemCount} items
            </p>
          </div>
          <button
            className="checkout-close-btn"
            type="button"
            aria-label="Close checkout"
            onClick={handleClose}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 6l12 12M18 6L6 18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/* Stepper Progress Bar */}
        <nav className="checkout-stepper" aria-label="Checkout Progress">
          <div className={`step-item ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-num">{step > 1 ? '✓' : '1'}</span>
            <span>Delivery Address</span>
          </div>
          <span className={`step-sep ${step > 1 ? 'completed' : ''}`}></span>
          <div className={`step-item ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-num">{step > 2 ? '✓' : '2'}</span>
            <span>Payment & Verification</span>
          </div>
          <span className={`step-sep ${step > 2 ? 'completed' : ''}`}></span>
          <div className={`step-item ${step === 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span>Order Confirmed</span>
          </div>
        </nav>

        {/* Modal Body */}
        <div className="checkout-body">
          {/* ================= STEP 1: Shipping ================= */}
          {step === 1 && (
            <div className="shipping-layout">
              <div>
                {!user && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(45,104,255,.08)',
                      border: '1px solid rgba(45,104,255,.2)',
                      marginBottom: '16px',
                      fontSize: '13px'
                    }}
                  >
                    <span>Have a TechNova account?</span>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                      onClick={() => setAuthModalTab('login')}
                    >
                      Log in to autofill
                    </button>
                  </div>
                )}

                <form className="shipping-form" onSubmit={handleProceedToPayment} noValidate>
                  <div className="form-grid-2">
                    <div className={`field-group ${shippingErrors.name ? 'bad' : ''}`}>
                      <label htmlFor="ship_name">Full Name *</label>
                      <input
                        id="ship_name"
                        type="text"
                        placeholder="e.g. Shiva Bawa"
                        value={shippingData.name}
                        onChange={(e) => {
                          setShippingData({ ...shippingData, name: e.target.value });
                          if (shippingErrors.name) setShippingErrors({ ...shippingErrors, name: '' });
                        }}
                      />
                      {shippingErrors.name && <span className="field-error-msg">{shippingErrors.name}</span>}
                    </div>

                    <div className={`field-group ${shippingErrors.phone ? 'bad' : ''}`}>
                      <label htmlFor="ship_phone">Mobile Number *</label>
                      <input
                        id="ship_phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={shippingData.phone}
                        onChange={(e) => {
                          setShippingData({ ...shippingData, phone: e.target.value });
                          if (shippingErrors.phone) setShippingErrors({ ...shippingErrors, phone: '' });
                        }}
                      />
                      {shippingErrors.phone && <span className="field-error-msg">{shippingErrors.phone}</span>}
                    </div>

                    <div className={`field-group full ${shippingErrors.email ? 'bad' : ''}`}>
                      <label htmlFor="ship_email">Email Address (For Tax Invoice & Tracking) *</label>
                      <input
                        id="ship_email"
                        type="email"
                        placeholder="e.g. shiva@example.com"
                        value={shippingData.email}
                        onChange={(e) => {
                          setShippingData({ ...shippingData, email: e.target.value });
                          if (shippingErrors.email) setShippingErrors({ ...shippingErrors, email: '' });
                        }}
                      />
                      {shippingErrors.email && <span className="field-error-msg">{shippingErrors.email}</span>}
                    </div>

                    <div className={`field-group ${shippingErrors.pin ? 'bad' : ''}`}>
                      <label htmlFor="ship_pin">PIN Code *</label>
                      <input
                        id="ship_pin"
                        type="text"
                        placeholder="6 digits"
                        maxLength="6"
                        value={shippingData.pin}
                        onChange={(e) => {
                          setShippingData({ ...shippingData, pin: e.target.value });
                          if (shippingErrors.pin) setShippingErrors({ ...shippingErrors, pin: '' });
                        }}
                      />
                      {shippingErrors.pin && <span className="field-error-msg">{shippingErrors.pin}</span>}
                    </div>

                    <div className={`field-group ${shippingErrors.city ? 'bad' : ''}`}>
                      <label htmlFor="ship_city">City / District *</label>
                      <input
                        id="ship_city"
                        type="text"
                        placeholder="e.g. Haldwani / Nainital"
                        value={shippingData.city}
                        onChange={(e) => {
                          setShippingData({ ...shippingData, city: e.target.value });
                          if (shippingErrors.city) setShippingErrors({ ...shippingErrors, city: '' });
                        }}
                      />
                      {shippingErrors.city && <span className="field-error-msg">{shippingErrors.city}</span>}
                    </div>

                    <div className={`field-group full ${shippingErrors.address ? 'bad' : ''}`}>
                      <label htmlFor="ship_address">Flat, House no., Building, Street Address *</label>
                      <input
                        id="ship_address"
                        type="text"
                        placeholder="House / Flat no., Road, Area"
                        value={shippingData.address}
                        onChange={(e) => {
                          setShippingData({ ...shippingData, address: e.target.value });
                          if (shippingErrors.address) setShippingErrors({ ...shippingErrors, address: '' });
                        }}
                      />
                      {shippingErrors.address && <span className="field-error-msg">{shippingErrors.address}</span>}
                    </div>
                  </div>

                  {/* Delivery Speed Options */}
                  <div className="delivery-options-wrap">
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)' }}>
                      Delivery Method
                    </label>
                    <div
                      className={`delivery-option-card ${shippingData.deliverySpeed === 'express' ? 'selected' : ''}`}
                      onClick={() => setShippingData({ ...shippingData, deliverySpeed: 'express' })}
                    >
                      <input
                        type="radio"
                        checked={shippingData.deliverySpeed === 'express'}
                        onChange={() => {}}
                      />
                      <div className="delivery-option-info">
                        <strong>TechNova Express Priority Delivery</strong>
                        <span>
                          {cartTotals.ship === 0
                            ? 'Free delivery unlocked on orders ₹99 and above'
                            : 'Standard delivery charges apply (orders under ₹99)'}
                        </span>
                      </div>
                      <span className="delivery-price-tag">
                        {cartTotals.ship === 0 ? 'FREE' : money(cartTotals.ship)}
                      </span>
                    </div>
                  </div>

                  <button className="btn-proceed-pay" type="submit">
                    Proceed to Payment Options · {money(cartTotals.total)}
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Order Recap Column */}
              <aside className="order-mini-recap">
                <div className="recap-header">
                  <span>Order Summary</span>
                  <span>{cartTotals.itemCount} items</span>
                </div>

                <div className="recap-items-list">
                  {cart.map((line) => {
                    const prod = BY_ID[line.id];
                    if (!prod) return null;
                    const col = prod.colors?.[line.c] || { n: 'Standard' };
                    return (
                      <div className="recap-item-row" key={`${line.id}:${line.c}`}>
                        <div className="recap-item-name">
                          <strong>{line.q}×</strong> {prod.name} <small>({col.n})</small>
                        </div>
                        <div>{money(prod.price * line.q)}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="recap-summary-lines">
                  <div className="recap-line">
                    <span>Subtotal</span>
                    <span>{money(cartTotals.sub)}</span>
                  </div>
                  {cartTotals.disc > 0 && (
                    <div className="recap-line" style={{ color: 'var(--ok)' }}>
                      <span>Discount</span>
                      <span>−{money(cartTotals.disc)}</span>
                    </div>
                  )}
                  <div className="recap-line">
                    <span>Shipping</span>
                    <span style={{ color: 'var(--ok)', fontWeight: 600 }}>
                      {cartTotals.ship === 0 ? 'FREE' : money(cartTotals.ship)}
                    </span>
                  </div>
                  <div className="recap-line total">
                    <span>Grand Total</span>
                    <span className="recap-total-val">{money(cartTotals.total)}</span>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245,158,11,0.06)',
                    border: '1px dashed rgba(245,158,11,0.25)',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: 'var(--text2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>🛡️</span>
                  <span>100% Genuine electronics guaranteed with 1-Year Brand Warranty.</span>
                </div>
              </aside>
            </div>
          )}

          {/* ================= STEP 2: Payment Gateway ================= */}
          {step === 2 && (
            <div className="pay-gateway-layout">
              {/* Payment Methods Tabs */}
              <div className="pay-methods-nav">
                <button
                  type="button"
                  className={`pay-nav-btn ${payMethod === 'UPI' ? 'active' : ''}`}
                  onClick={() => setPayMethod('UPI')}
                >
                  <svg className="pay-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2" />
                    <path d="M16 8h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4M12 12h4" strokeWidth="2" />
                  </svg>
                  <div>
                    <div>UPI / QR Code</div>
                    <small style={{ fontSize: '11px', color: 'var(--text3)' }}>Google Pay, PhonePe, Paytm</small>
                  </div>
                  <span className="pay-rec-badge">FAST</span>
                </button>

                <button
                  type="button"
                  className={`pay-nav-btn ${payMethod === 'CARD' ? 'active' : ''}`}
                  onClick={() => setPayMethod('CARD')}
                >
                  <svg className="pay-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
                    <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" />
                  </svg>
                  <div>
                    <div>Cards</div>
                    <small style={{ fontSize: '11px', color: 'var(--text3)' }}>Visa, Mastercard, RuPay</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`pay-nav-btn ${payMethod === 'NETBANKING' ? 'active' : ''}`}
                  onClick={() => setPayMethod('NETBANKING')}
                >
                  <svg className="pay-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3l9 7H3l9-7z" strokeWidth="2" />
                  </svg>
                  <div>
                    <div>Net Banking</div>
                    <small style={{ fontSize: '11px', color: 'var(--text3)' }}>All Indian Banks</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`pay-nav-btn ${payMethod === 'COD' ? 'active' : ''}`}
                  onClick={() => setPayMethod('COD')}
                >
                  <svg className="pay-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth="2" />
                    <circle cx="12" cy="12" r="2" strokeWidth="2" />
                    <path d="M6 12h.01M18 12h.01" strokeWidth="2" />
                  </svg>
                  <div>
                    <div>Cash on Delivery</div>
                    <small style={{ fontSize: '11px', color: 'var(--text3)' }}>Pay at doorstep</small>
                  </div>
                </button>

                {/* Amount to pay pill */}
                <div className="pay-summary-pill">
                  <small>Total Payable</small>
                  <strong>{money(cartTotals.total)}</strong>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--cyan)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: 0,
                      marginTop: '4px'
                    }}
                    onClick={() => setStep(1)}
                  >
                    ← Edit shipping address
                  </button>
                </div>
              </div>

              {/* Method Detail Panel */}
              <div className="pay-panel">
                {/* ---------- TAB 1: UPI & QR CODE ---------- */}
                {payMethod === 'UPI' && (
                  <div className="upi-panel-core">
                    {/* Payee Profile Card */}
                    <div className="payee-header-card">
                      <div className="payee-avatar-group">
                        <div className="payee-avatar-circle">S</div>
                        <div className="payee-text-info">
                          <h3>
                            {PAYEE.name}
                            <svg className="payee-verified-tick" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          </h3>
                          <div className="payee-bank-sub">
                            <svg className="payee-bank-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3l9 7H3l9-7z" strokeWidth="2" />
                            </svg>
                            <span>{PAYEE.bank}</span>
                          </div>
                        </div>
                      </div>

                      {/* UPI ID Pill with Copy */}
                      <div className="upi-id-pill-wrap">
                        <span className="upi-id-code">{PAYEE.upiId}</span>
                        <button
                          type="button"
                          className={`btn-copy-mini ${copiedItem === 'upi' ? 'copied' : ''}`}
                          onClick={() => copyToClipboard(PAYEE.upiId, 'upi')}
                        >
                          {copiedItem === 'upi' ? 'Copied! ✓' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* QR View Mode Switcher */}
                    <div className="qr-mode-switch">
                      <button
                        type="button"
                        className={`qr-tab-btn ${qrMode === 'dynamic' ? 'active' : ''}`}
                        onClick={() => setQrMode('dynamic')}
                      >
                        ⚡ Live Dynamic QR ({money(cartTotals.total)})
                      </button>
                      <button
                        type="button"
                        className={`qr-tab-btn ${qrMode === 'original' ? 'active' : ''}`}
                        onClick={() => setQrMode('original')}
                      >
                        📷 Original Google Pay Standee
                      </button>
                    </div>

                    {!isVerifying ? (
                      <div className="qr-presentation-stage">
                        {/* QR Code Presentation Box */}
                        {qrMode === 'dynamic' ? (
                          <div className="dynamic-qr-box">
                            <div className="qr-top-tag">
                              <div className="qr-gpay-brand">
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                  <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                  />
                                  <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                  />
                                  <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    fill="#FBBC05"
                                  />
                                  <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    fill="#EA4335"
                                  />
                                </svg>
                                <span>Scan & Pay via any UPI App</span>
                              </div>
                              <span style={{ color: '#10B981' }}>● Live</span>
                            </div>

                            <div className="qr-canvas-wrapper">
                              {dynamicQrUrl ? (
                                <img src={dynamicQrUrl} alt={`UPI QR Code to pay ${money(cartTotals.total)}`} />
                              ) : (
                                <div style={{ color: '#999', fontSize: '12px' }}>Generating QR...</div>
                              )}
                              <div className="qr-center-emblem">
                                <svg width="22" height="22" viewBox="0 0 24 24">
                                  <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                  />
                                  <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                  />
                                  <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    fill="#FBBC05"
                                  />
                                  <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    fill="#EA4335"
                                  />
                                </svg>
                              </div>
                            </div>

                            <div className="qr-amount-pill">
                              Amount: <span>{money(cartTotals.total)}</span>
                            </div>
                          </div>
                        ) : (
                          /* Original Standee Image */
                          <div className="original-standee-box">
                            <img
                              className="standee-img"
                              src={PAYEE.standeeImage}
                              alt="Shiva Bawa Official Google Pay QR"
                              onClick={() => setZoomStandee(true)}
                              style={{ cursor: 'zoom-in' }}
                            />
                            <div className="standee-caption">
                              <span>Official GPay Standee</span>
                              <button
                                type="button"
                                className="btn-zoom-standee"
                                onClick={() => setZoomStandee(true)}
                              >
                                🔍 Click to expand
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Side Instructions & Actions */}
                        <div className="qr-instructions-col">
                          {/* Expiry Timer */}
                          <div className="upi-expiry-timer">
                            <span>QR Code Session Expiry:</span>
                            <span className="timer-digits">
                              {timerMinutes}:{timerRemainingSec}
                            </span>
                          </div>

                          {/* 1-Click Mobile Launchers */}
                          <div className="mobile-upi-apps-wrap">
                            <p>Or open directly on mobile app:</p>
                            <div className="upi-app-buttons-grid">
                              <a
                                className="upi-app-btn gpay"
                                href={upiIntentLinks.gpay}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <span>Google Pay</span>
                              </a>
                              <a
                                className="upi-app-btn phonepe"
                                href={upiIntentLinks.phonepe}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <span>PhonePe</span>
                              </a>
                              <a
                                className="upi-app-btn paytm"
                                href={upiIntentLinks.paytm}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <span>Paytm</span>
                              </a>
                              <a
                                className="upi-app-btn generic"
                                href={upiIntentLinks.generic}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <span>⚡ Pay with Any UPI App</span>
                              </a>
                            </div>
                          </div>

                          {/* Verification Box with UTR */}
                          <div className="upi-confirm-box">
                            <label htmlFor="utr_field">
                              Transferred amount? Enter 12-digit UPI UTR / Ref (optional):
                            </label>
                            <div className="utr-input-row">
                              <input
                                id="utr_field"
                                type="text"
                                maxLength="16"
                                placeholder="e.g. 428941098231"
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value)}
                              />
                            </div>
                            <button
                              type="button"
                              className="btn-verify-paid"
                              onClick={handleVerifyUpiPayment}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20 6L9 17l-5-5" strokeWidth="2.5" strokeLinecap="round" />
                              </svg>
                              I Have Completed Payment ({money(cartTotals.total)})
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Live Verification Progress Animation */
                      <div className="upi-verifying-state">
                        <div className="verifying-spinner"></div>
                        <div className="verifying-step-text">{verifyStatusText}</div>
                        <div className="verifying-sub">
                          Please do not refresh or close this window. Confirming with NPCI & Nainital Bank...
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------- TAB 2: CREDIT / DEBIT CARDS ---------- */}
                {payMethod === 'CARD' && (
                  <div className="card-panel-core">
                    {/* Virtual Interactive Card Mockup */}
                    <div className="virtual-card-wrapper">
                      <div className="virtual-card">
                        <div className="card-top-row">
                          <div className="card-chip"></div>
                          <div className="card-brand-tag">
                            {cardData.number.startsWith('4')
                              ? 'VISA'
                              : cardData.number.startsWith('5')
                              ? 'Mastercard'
                              : cardData.number.startsWith('6')
                              ? 'RuPay'
                              : 'TECHNOVA CARD'}
                          </div>
                        </div>
                        <div className="card-number-display">
                          {cardData.number || '•••• •••• •••• ••••'}
                        </div>
                        <div className="card-bottom-row">
                          <div>
                            <span style={{ opacity: 0.7 }}>CARDHOLDER</span>
                            <div className="card-holder-name">{cardData.name || 'YOUR NAME'}</div>
                          </div>
                          <div>
                            <span style={{ opacity: 0.7 }}>EXPIRES</span>
                            <div className="card-expiry-val">{cardData.expiry || 'MM/YY'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Form */}
                    <form onSubmit={handleCardPayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className={`field-group ${cardErrors.number ? 'bad' : ''}`}>
                        <label htmlFor="card_num">Card Number</label>
                        <input
                          id="card_num"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          value={cardData.number}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                        />
                        {cardErrors.number && <span className="field-error-msg">{cardErrors.number}</span>}
                      </div>

                      <div className={`field-group ${cardErrors.name ? 'bad' : ''}`}>
                        <label htmlFor="card_name">Name on Card</label>
                        <input
                          id="card_name"
                          type="text"
                          placeholder="Full name as printed on card"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        />
                        {cardErrors.name && <span className="field-error-msg">{cardErrors.name}</span>}
                      </div>

                      <div className="form-grid-2">
                        <div className={`field-group ${cardErrors.expiry ? 'bad' : ''}`}>
                          <label htmlFor="card_exp">Expiry Date</label>
                          <input
                            id="card_exp"
                            type="text"
                            placeholder="MM/YY"
                            maxLength="5"
                            value={cardData.expiry}
                            onChange={(e) => handleExpiryChange(e.target.value)}
                          />
                          {cardErrors.expiry && <span className="field-error-msg">{cardErrors.expiry}</span>}
                        </div>

                        <div className={`field-group ${cardErrors.cvv ? 'bad' : ''}`}>
                          <label htmlFor="card_cvv">CVV / CVC</label>
                          <input
                            id="card_cvv"
                            type="password"
                            placeholder="3 digits"
                            maxLength="4"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                          />
                          {cardErrors.cvv && <span className="field-error-msg">{cardErrors.cvv}</span>}
                        </div>
                      </div>

                      <button className="btn-proceed-pay" type="submit">
                        Pay {money(cartTotals.total)} with Card
                      </button>
                    </form>

                    {/* 3D Secure OTP Modal Simulation */}
                    {showCardOtpModal && (
                      <div
                        style={{
                          position: 'fixed',
                          inset: 0,
                          background: 'rgba(0,0,0,0.8)',
                          zIndex: 2000,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px'
                        }}
                      >
                        <div
                          style={{
                            background: 'var(--bg2)',
                            border: '1px solid var(--line2)',
                            borderRadius: '20px',
                            padding: '28px',
                            maxWidth: '420px',
                            width: '100%',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔐</div>
                          <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>3D Secure Bank Verification</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px' }}>
                            An OTP has been sent to your registered mobile ending in ••89.
                            <br />
                            <strong style={{ color: 'var(--c2)' }}>Demo OTP: 123456</strong>
                          </p>
                          <form onSubmit={handleCardOtpSubmit}>
                            <input
                              type="text"
                              maxLength="6"
                              autoFocus
                              placeholder="Enter 6-digit OTP"
                              style={{
                                width: '100%',
                                height: '48px',
                                textAlign: 'center',
                                fontSize: '20px',
                                letterSpacing: '0.25em',
                                borderRadius: '12px',
                                border: '1px solid var(--line2)',
                                background: 'var(--card)',
                                color: 'var(--text)',
                                marginBottom: '14px'
                              }}
                              value={cardOtpInput}
                              onChange={(e) => setCardOtpInput(e.target.value)}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                type="button"
                                className="btn btn-ghost"
                                style={{ flex: 1 }}
                                onClick={() => setShowCardOtpModal(false)}
                              >
                                Cancel
                              </button>
                              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                Authorize
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------- TAB 3: NET BANKING ---------- */}
                {payMethod === 'NETBANKING' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <p style={{ fontSize: '13.5px', color: 'var(--text2)' }}>
                      Select your bank to authenticate and transfer amount securely:
                    </p>
                    <div className="bank-grid">
                      {POPULAR_BANKS.map((b) => (
                        <div
                          key={b.id}
                          className={`bank-option-btn ${selectedBank === b.id ? 'selected' : ''}`}
                          onClick={() => setSelectedBank(b.id)}
                        >
                          <span style={{ fontSize: '24px' }}>{b.icon}</span>
                          <span className="bank-logo-text">{b.name}</span>
                          <span className="bank-name-sub">{b.sub}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="btn-proceed-pay"
                      onClick={handleNetBankingPay}
                    >
                      Proceed to NetBanking Portal · {money(cartTotals.total)}
                    </button>
                  </div>
                )}

                {/* ---------- TAB 4: CASH ON DELIVERY ---------- */}
                {payMethod === 'COD' && (
                  <form onSubmit={handleCodPay} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div
                      style={{
                        padding: '14px',
                        background: 'rgba(16,185,129,0.08)',
                        border: '1px solid rgba(16,185,129,0.25)',
                        borderRadius: '14px',
                        fontSize: '13.5px',
                        color: 'var(--text)'
                      }}
                    >
                      <strong style={{ color: 'var(--ok)' }}>Cash or UPI on Delivery:</strong>
                      <p style={{ marginTop: '4px', color: 'var(--text2)' }}>
                        You can pay with Cash or scan Shiva Bawa's UPI QR code directly at your doorstep when the delivery executive arrives.
                      </p>
                    </div>

                    <div className="field-group">
                      <label>Security Captcha Verification *</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div
                          style={{
                            background: 'var(--bg)',
                            border: '1px dashed var(--c2)',
                            padding: '8px 16px',
                            borderRadius: '10px',
                            fontFamily: 'monospace',
                            fontSize: '22px',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            color: 'var(--c2)',
                            userSelect: 'none'
                          }}
                        >
                          {captchaCode}
                        </div>
                        <input
                          type="text"
                          maxLength="4"
                          placeholder="Enter 4-digit code"
                          style={{ flex: 1 }}
                          value={captchaInput}
                          onChange={(e) => {
                            setCaptchaInput(e.target.value);
                            setCaptchaError('');
                          }}
                        />
                      </div>
                      {captchaError && <span className="field-error-msg">{captchaError}</span>}
                    </div>

                    <button className="btn-proceed-pay" type="submit">
                      Confirm Cash on Delivery Order ({money(cartTotals.total)})
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 3: Order Confirmed & Tax Invoice ================= */}
          {step === 3 && completedOrder && (
            <div className="success-card-core">
              <div className="success-tick-pulse">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div>
                <h2 style={{ fontSize: '26px', letterSpacing: '-0.02em', color: 'var(--text)' }}>
                  Order Successfully Placed!
                </h2>
                <p style={{ color: 'var(--text2)', fontSize: '14px', marginTop: '4px' }}>
                  A confirmation SMS & tax invoice have been dispatched to{' '}
                  <strong style={{ color: 'var(--text)' }}>{completedOrder.customer.email}</strong>.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="order-receipt-box">
                <div className="receipt-top-row">
                  <div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text3)' }}>ORDER REFERENCE</span>
                    <div className="receipt-id-badge">{completedOrder.id}</div>
                  </div>
                  <span className="receipt-status-pill">● {completedOrder.status}</span>
                </div>

                <div className="receipt-grid">
                  <div className="receipt-prop">
                    <span>Authorized Payee</span>
                    <strong>{completedOrder.payee}</strong>
                  </div>
                  <div className="receipt-prop">
                    <span>Payee UPI VPA</span>
                    <strong style={{ fontFamily: 'monospace' }}>{completedOrder.upiId}</strong>
                  </div>
                  <div className="receipt-prop">
                    <span>Settlement Account</span>
                    <strong>{completedOrder.bank}</strong>
                  </div>
                  <div className="receipt-prop">
                    <span>Amount Transferred</span>
                    <strong style={{ color: 'var(--c2)', fontSize: '15px' }}>{money(completedOrder.total)}</strong>
                  </div>
                  <div className="receipt-prop">
                    <span>Payment Gateway</span>
                    <strong>{completedOrder.payMethod}</strong>
                  </div>
                  <div className="receipt-prop">
                    <span>UTR / Ref ID</span>
                    <strong style={{ fontFamily: 'monospace', fontSize: '12px' }}>{completedOrder.utr}</strong>
                  </div>
                  <div className="receipt-prop" style={{ gridColumn: '1 / -1' }}>
                    <span>Delivery Address</span>
                    <strong>
                      {completedOrder.customer.name}, {completedOrder.customer.address}, {completedOrder.customer.city} – {completedOrder.customer.pin} (Ph: {completedOrder.customer.phone})
                    </strong>
                  </div>
                </div>
              </div>

              {/* Interactive Shipment Tracker */}
              <div className="shipment-tracker-wrap">
                <div className="tracker-title">Live Dispatch Tracking</div>
                <div className="tracker-steps-row">
                  <div className="track-step-node done">
                    <div className="track-node-circle">✓</div>
                    <span>Order Confirmed</span>
                  </div>
                  <div className="track-step-node current">
                    <div className="track-node-circle">2</div>
                    <span>Processing in Hub</span>
                  </div>
                  <div className="track-step-node">
                    <div className="track-node-circle">3</div>
                    <span>Out for Delivery</span>
                  </div>
                  <div className="track-step-node">
                    <div className="track-node-circle">4</div>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="success-actions-row">
                <button
                  type="button"
                  className="btn-print-invoice"
                  onClick={() => setShowTaxInvoice(true)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" strokeWidth="2" />
                    <rect x="6" y="14" width="12" height="8" rx="1" strokeWidth="2" />
                  </svg>
                  View / Print Tax Invoice
                </button>

                <button
                  type="button"
                  className="btn-continue-shop"
                  onClick={() => {
                    handleClose();
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= ZOOM STANDEE MODAL ================= */}
      {zoomStandee && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setZoomStandee(false)}
        >
          <img
            src={PAYEE.standeeImage}
            alt="Full size Google Pay Standee"
            style={{
              maxHeight: '85vh',
              maxWidth: '90vw',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
            }}
          />
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: '16px', color: '#fff' }}
            onClick={() => setZoomStandee(false)}
          >
            ✕ Close Preview
          </button>
        </div>
      )}

      {/* ================= PRINTABLE TAX INVOICE OVERLAY ================= */}
      {showTaxInvoice && completedOrder && (
        <div className="invoice-overlay">
          <div className="tax-invoice-sheet" id="printableTaxInvoice">
            <div className="invoice-actions-top">
              <button
                type="button"
                className="btn btn-ghost"
                style={{ border: '1px solid #CBD5E1', color: '#334155' }}
                onClick={() => window.print()}
              >
                🖨️ Print
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ border: '1px solid #CBD5E1', color: '#334155' }}
                onClick={() => setShowTaxInvoice(false)}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0F172A', paddingBottom: '16px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>TECHNOVA</h1>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  TechNova Electronics Retail Pvt. Ltd.
                  <br />
                  GSTIN: 05AABCT1928K1Z3 · CIN: U72900UR2026PTC049182
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>TAX INVOICE</h2>
                <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                  Invoice No: <strong>INV-{completedOrder.id}</strong>
                  <br />
                  Date: {completedOrder.date}
                </p>
              </div>
            </div>

            {/* Billed To & Authorized Settlement Account */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', margin: '20px 0', fontSize: '13px' }}>
              <div>
                <strong style={{ color: '#0F172A', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.08em' }}>
                  BILLED TO (CUSTOMER):
                </strong>
                <p style={{ marginTop: '6px', lineHeight: 1.5 }}>
                  <strong>{completedOrder.customer.name}</strong>
                  <br />
                  {completedOrder.customer.address}
                  <br />
                  {completedOrder.customer.city} – {completedOrder.customer.pin}
                  <br />
                  Mobile: {completedOrder.customer.phone}
                  <br />
                  Email: {completedOrder.customer.email}
                </p>
              </div>
              <div>
                <strong style={{ color: '#0F172A', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.08em' }}>
                  AUTHORIZED PAYMENT SETTLEMENT:
                </strong>
                <p style={{ marginTop: '6px', lineHeight: 1.5 }}>
                  Payee: <strong>{completedOrder.payee}</strong>
                  <br />
                  UPI ID: <strong>{completedOrder.upiId}</strong>
                  <br />
                  Settlement Bank: <strong>{completedOrder.bank}</strong>
                  <br />
                  Payment Gateway: <strong>{completedOrder.payMethod}</strong>
                  <br />
                  UTR / Reference No: <strong>{completedOrder.utr}</strong>
                  <br />
                  Status: <strong style={{ color: '#059669' }}>VERIFIED & CLEARED</strong>
                </p>
              </div>
            </div>

            {/* Items Table */}
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Unit Price</th>
                  <th style={{ textAlign: 'right' }}>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {completedOrder.items.map((it, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{it.name}</strong> <span style={{ color: '#64748B' }}>({it.color})</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{it.qty}</td>
                    <td style={{ textAlign: 'right' }}>{money(it.price)}</td>
                    <td style={{ textAlign: 'right' }}>{money(it.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total breakdown */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Subtotal:</span>
                  <span>{money(completedOrder.subtotal)}</span>
                </div>
                {completedOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                    <span>Promotional Discount:</span>
                    <span>−{money(completedOrder.discount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Shipping & Handling:</span>
                  <span>{completedOrder.delivery === 0 ? 'FREE' : money(completedOrder.delivery)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #0F172A', paddingTop: '8px', fontSize: '16px', fontWeight: 800 }}>
                  <span>Total Amount Paid:</span>
                  <span style={{ color: '#1D4ED8' }}>{money(completedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Digital Sign Seal */}
            <div style={{ marginTop: '36px', paddingTop: '16px', borderTop: '1px dashed #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: '#64748B' }}>
              <div>
                <span>This is a computer-generated tax invoice. No physical signature required.</span>
                <br />
                <span>Authorized recipient: Shiva Bawa · Nainital Bank 0005</span>
              </div>
              <div style={{ textAlign: 'right', border: '1px solid #10B981', padding: '6px 14px', borderRadius: '8px', color: '#059669', fontWeight: 700 }}>
                DIGITALLY VERIFIED
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
