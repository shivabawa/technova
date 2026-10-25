import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { money } from '../data/products';

const FIELD_DEFS = [
  { id: 'name', label: 'Full name', type: 'text', auto: 'name', span: false, validate: (v) => v.trim().length >= 2 || 'Enter your full name.' },
  { id: 'email', label: 'Email', type: 'email', auto: 'email', span: false, validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Enter a valid email, like you@example.com.' },
  { id: 'phone', label: 'Mobile number', type: 'tel', auto: 'tel', span: false, validate: (v) => /^[6-9]\d{9}$/.test(v.replace(/\s/g, '')) || 'Enter a 10-digit mobile number.' },
  { id: 'pin', label: 'PIN code', type: 'text', auto: 'postal-code', span: false, validate: (v) => /^\d{6}$/.test(v.trim()) || 'Enter a 6-digit PIN code.' },
  { id: 'address', label: 'Delivery address', type: 'text', auto: 'street-address', span: true, validate: (v) => v.trim().length >= 8 || 'Enter your house number, street and area.' },
  { id: 'city', label: 'City', type: 'text', auto: 'address-level2', span: false, validate: (v) => v.trim().length >= 2 || 'Enter your city.' }
];

export function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cartTotals, user, setAuthModalTab, clearCart } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pin: '',
    address: '',
    city: '',
    pay: 'UPI'
  });

  const [errors, setErrors] = useState({});
  const [completedOrder, setCompletedOrder] = useState(null);

  // Autofill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  if (!isCheckoutOpen) return null;

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
    setErrors({});
  };

  const handleFieldChange = (fieldId, val) => {
    setFormData((prev) => ({ ...prev, [fieldId]: val }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleFieldBlur = (def) => {
    const val = formData[def.id] || '';
    if (val) {
      const res = def.validate(val);
      if (res !== true) {
        setErrors((prev) => ({ ...prev, [def.id]: res }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let hasError = false;

    FIELD_DEFS.forEach((def) => {
      const val = formData[def.id] || '';
      const check = def.validate(val);
      if (check !== true) {
        newErrors[def.id] = check;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Generate Order
    const orderId = 'TN-' + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10);
    const orderInfo = {
      id: orderId,
      email: formData.email,
      total: cartTotals.total,
      pay: formData.pay
    };

    setCompletedOrder(orderInfo);
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
  };

  return (
    <div
      className="modal show"
      id="checkoutModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coTitle"
      onClick={(e) => {
        if (e.target.id === 'checkoutModal') handleClose();
      }}
    >
      <div className="modal-card co">
        <button
          className="icon-btn modal-close"
          type="button"
          aria-label="Close checkout"
          onClick={handleClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {!completedOrder ? (
          <>
            <h2 id="coTitle">Checkout</h2>
            <p>
              {cartTotals.itemCount} items · {money(cartTotals.total)} total
            </p>

            {/* Autofill prompt if not logged in */}
            {!user && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(45,104,255,.08)',
                  border: '1px solid rgba(45,104,255,.2)',
                  marginBottom: '18px',
                  fontSize: '13.5px'
                }}
              >
                <span>Have a TechNova account?</span>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ padding: '5px 12px', fontSize: '12px' }}
                  onClick={() => setAuthModalTab('login')}
                >
                  Log In to Autofill
                </button>
              </div>
            )}

            <form id="coForm" onSubmit={handleSubmit} noValidate>
              <div className="co-grid">
                {FIELD_DEFS.map((f) => {
                  const errorMsg = errors[f.id];
                  return (
                    <div
                      key={f.id}
                      className={`field ${f.span ? 'span' : ''} ${errorMsg ? 'bad' : ''}`}
                    >
                      <label htmlFor={`f_${f.id}`}>{f.label}</label>
                      <input
                        id={`f_${f.id}`}
                        name={f.id}
                        type={f.type}
                        autoComplete={f.auto}
                        value={formData[f.id]}
                        onChange={(e) => handleFieldChange(f.id, e.target.value)}
                        onBlur={() => handleFieldBlur(f)}
                        aria-invalid={!!errorMsg}
                      />
                      {errorMsg && (
                        <span className="err" role="alert">
                          {errorMsg}
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Payment Selection */}
                <fieldset className="field span" style={{ border: 0 }}>
                  <legend style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '6px' }}>
                    Payment method
                  </legend>
                  <div className="pay">
                    <label>
                      <input
                        type="radio"
                        name="pay"
                        value="UPI"
                        checked={formData.pay === 'UPI'}
                        onChange={(e) => handleFieldChange('pay', e.target.value)}
                      />
                      <span>UPI</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="pay"
                        value="Card"
                        checked={formData.pay === 'Card'}
                        onChange={(e) => handleFieldChange('pay', e.target.value)}
                      />
                      <span>Card</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="pay"
                        value="Cash on delivery"
                        checked={formData.pay === 'Cash on delivery'}
                        onChange={(e) => handleFieldChange('pay', e.target.value)}
                      />
                      <span>Cash on delivery</span>
                    </label>
                  </div>
                </fieldset>
              </div>

              <div className="co-foot">
                <p className="note">This is a demo store. No real payment is taken.</p>
                <button className="btn btn-primary" type="submit">
                  Place order · {money(cartTotals.total)}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Order Confirmation Screen */
          <div className="done">
            <div className="tick">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12l5 5L20 6" />
              </svg>
            </div>
            <h2 id="coTitle">Order placed</h2>
            <p>
              Thanks! We've sent a confirmation to <strong>{completedOrder.email}</strong>. Your order
              will arrive in about two days.
            </p>
            <span className="oid">{completedOrder.id}</span>
            <p style={{ fontSize: '14px', marginTop: '6px' }}>
              {money(completedOrder.total)} · {completedOrder.pay}
            </p>
            <div style={{ marginTop: '22px' }}>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  handleClose();
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Continue shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
