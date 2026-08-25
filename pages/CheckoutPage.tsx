/**
 * @g66/storefront-sdk — gourmet-food CheckoutPage
 *
 * Phase 4 §4.4: 🟡 SHARED page — Checkout composition for F&B storefronts.
 * Wraps CheckoutFlow pre-built with F&B-specific defaults:
 * - VNPay (card/QR) + SEPay (VietQR) payment methods
 * - GHN/GHTK shipping options common in VN F&B delivery
 * - Vietnamese labels for all form fields and steps
 * - F&B-specific delivery notes (e.g. "Giao lúc giờ ăn trưa")
 *
 * @example
 * ```tsx
 * <CheckoutPage
 *   onOrderComplete={(orderId) => router.push(`/order/${orderId}`)}
 * />
 * ```
 */
'use client';

import React from 'react';
import { CheckoutFlow } from '../../../pre-built/CheckoutFlow';
import type { ShippingMethod, PaymentMethodOption } from '../../../types/checkout';

// ─── Props ──────────────────────────────────────────────

export interface CheckoutPageProps {
  /** Additional shipping methods (merged with F&B defaults) */
  shippingMethods?: ShippingMethod[];
  /** Additional payment methods (merged with F&B defaults) */
  paymentMethods?: PaymentMethodOption[];
  /** Discount amount in VND */
  discountAmount?: number;
  /** Called when order is placed successfully */
  onOrderComplete?: (orderId: string) => void;
  /** Section title (Vietnamese default) */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

/** F&B default shipping methods — GHN + GHTK are the top 2 VN logistics providers */
const DEFAULT_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'ghn-express',
    name: 'Giao Hàng Nhanh — Express',
    fee: 22000,
    estimatedDays: '1-2 ngày',
    description: 'Giao hàng nhanh nội thành (HCM, Hà Nội)',
  },
  {
    id: 'ghn-standard',
    name: 'Giao Hàng Nhanh — Tiết kiệm',
    fee: 15000,
    estimatedDays: '3-5 ngày',
    description: 'Giao hàng tiết kiệm toàn quốc',
  },
  {
    id: 'ghtk',
    name: 'GHTK — Siêu tốc',
    fee: 18000,
    estimatedDays: '1-3 ngày',
    description: 'Giao hàng siêu tốc — phổ biến F&B',
  },
  {
    id: 'pickup',
    name: 'Nhận tại quán',
    fee: 0,
    estimatedDays: 'Hôm nay',
    description: 'Đặt trước, nhận tại quán — không phí giao hàng',
  },
];

/** F&B default payment methods — VNPay + SEPay are the top 2 VN payment providers for F&B */
const DEFAULT_PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'vnpay-qr',
    name: 'VNPay QR',
    provider: 'vnpay',
    icon: 'qr-code',
    description: 'Quét mã QR — ngân hàng nội địa & thẻ quốc tế',
  },
  {
    id: 'vnpay-card',
    name: 'VNPay Thẻ',
    provider: 'vnpay',
    icon: 'credit-card',
    description: 'Thanh toán bằng thẻ ATM/Visa/MasterCard',
  },
  {
    id: 'sepay-qr',
    name: 'SEPay (VietQR)',
    provider: 'sepay',
    icon: 'qr-code',
    description: 'Chuyển khoản qua mã QR — phí thấp, xác nhận tự động',
  },
  {
    id: 'sepay-bank',
    name: 'SEPay Chuyển khoản',
    provider: 'sepay',
    icon: 'bank-transfer',
    description: 'Chuyển khoản trực tiếp — xác nhận tự động qua SEPay',
  },
];

// ─── Component ──────────────────────────────────────────

/**
 * CheckoutPage — F&B checkout with VN shipping/payment defaults.
 *
 * Pre-configures:
 *   - 4 shipping methods: GHN Express, GHN Tiết kiệm, GHTK Siêu tốc, Nhận tại quán
 *   - 4 payment methods: VNPay QR, VNPay Thẻ, SEPay VietQR, SEPay Chuyển khoản
 * All with Vietnamese labels and descriptions.
 */
export function CheckoutPage({
  shippingMethods: customShipping,
  paymentMethods: customPayment,
  discountAmount = 0,
  onOrderComplete,
  title = 'Thanh toán',
  className,
}: CheckoutPageProps) {
  // Merge custom methods with defaults (custom takes priority)
  const shippingMethods = customShipping
    ? [...customShipping, ...DEFAULT_SHIPPING_METHODS.filter((d) => !customShipping.some((c) => c.id === d.id))]
    : DEFAULT_SHIPPING_METHODS;

  const paymentMethods = customPayment
    ? [...customPayment, ...DEFAULT_PAYMENT_METHODS.filter((d) => !customPayment.some((c) => c.id === d.id))]
    : DEFAULT_PAYMENT_METHODS;

  return (
    <div className={`px-4 md:px-8 py-8 max-w-3xl mx-auto ${className ?? ''}`}>
      {/* Page header */}
      <h1 className="text-2xl font-serif font-bold mb-6">{title}</h1>

      {/* Checkout flow from SDK pre-built */}
      <CheckoutFlow
        shippingMethods={shippingMethods}
        paymentMethods={paymentMethods}
        discountAmount={discountAmount}
        onOrderComplete={onOrderComplete}
      />
    </div>
  );
}
