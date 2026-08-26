/**
 * @g66/storefront-sdk — gourmet-food LoginPage
 *
 * Phase 4 §4.4: 🟡 SHARED page — Login composition for F&B storefronts.
 * Wraps OTPLogin pre-built with F&B-specific branding:
 * - Vietnamese title: "Đăng nhập"
 * - Optional Zalo social login (common in VN F&B)
 * - Optional Google social login
 * - F&B-themed card with warm background accent
 * - Welcome message and return URL support
 * - Default success state: shows "Continue to account" CTA after verified
 *
 * Wiring (Phase 2b):
 * - The OTPLogin pre-built now talks to the REAL `/api/auth/*` endpoints
 *   via the `useCustomer` Zustand hook + PancakeCustomerAdapter.
 * - When `onLoginSuccess` is provided, it is called immediately after
 *   `verifyOTP` succeeds (parent usually does `router.push('/account')`).
 * - When `onLoginSuccess` is NOT provided, this template renders a
 *   default "Continue to account" CTA (`<a href="/account">`) below the
 *   OTPLogin card so the user has a clear next step.
 *
 * @example
 * ```tsx
 * <LoginPage
 *   onLoginSuccess={() => router.push('/account')}
 *   onZaloLogin={() => zaloAuth()}
 * />
 * ```
 */
'use client';

import React, { useCallback, useState } from 'react';
import { UtensilsCrossed, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OTPLogin } from '../../../pre-built/OTPLogin';

// ─── Props ──────────────────────────────────────────────

export interface LoginPageProps {
  /** Called after successful login. If omitted, a default "Continue" CTA is shown. */
  onLoginSuccess?: () => void;
  /** Called when Zalo login is clicked */
  onZaloLogin?: () => void;
  /** Called when Google login is clicked */
  onGoogleLogin?: () => void;
  /** Called when "Quay lại" back button is clicked */
  onBack?: () => void;
  /** Welcome message (Vietnamese default) */
  welcomeMessage?: string;
  /** Labels (Vietnamese defaults) */
  labels?: {
    title?: string;
    back?: string;
    welcomeBack?: string;
    loginToContinue?: string;
    /** CTA shown after successful login (default: "Vào trang tài khoản") */
    continueToAccount?: string;
    /** Heading shown after successful login (default: "Đăng nhập thành công!") */
    successHeading?: string;
    /** Body shown after successful login */
    successBody?: string;
  };
  /** Path the default success CTA links to (default: '/account') */
  accountPath?: string;
  /** Additional CSS class */
  className?: string;
}

const DEFAULT_LABELS = {
  title: 'Đăng nhập',
  back: 'Quay lại',
  welcomeBack: 'Chào mừng bạn quay lại!',
  loginToContinue: 'Đăng nhập để đặt hàng và xem lịch sử đơn hàng',
  continueToAccount: 'Vào trang tài khoản',
  successHeading: 'Đăng nhập thành công!',
  successBody: 'Bạn có thể xem lại đơn hàng và thông tin tài khoản.',
};

// ─── Component ──────────────────────────────────────────

/**
 * LoginPage — F&B login page with phone OTP + optional Zalo/Google.
 *
 * Layout:
 *   Centered card with:
 *   - F&B icon header (UtensilsCrossed)
 *   - Welcome message
 *   - OTPLogin pre-built component (phone → OTP → verified)
 *   - When verified + no onLoginSuccess: a "Continue to account" CTA card
 *   - Back navigation button
 */
export function LoginPage({
  onLoginSuccess,
  onZaloLogin,
  onGoogleLogin,
  onBack,
  welcomeMessage,
  labels,
  accountPath = '/account',
  className,
}: LoginPageProps) {
  const lbl = { ...DEFAULT_LABELS, ...labels };
  const [isVerified, setIsVerified] = useState(false);

  // Default handler — if the parent provides one, call it AND flip the
  // internal flag so the success CTA still renders. If the parent doesn't
  // provide one, only flip the flag (the CTA card handles the redirect).
  const handleLoginSuccess = useCallback(() => {
    setIsVerified(true);
    onLoginSuccess?.();
  }, [onLoginSuccess]);

  return (
    <div className={`min-h-[60vh] flex items-center justify-center px-4 py-8 ${className ?? ''}`}>
      <div className="w-full max-w-sm space-y-4">
        {/* F&B icon header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
            <UtensilsCrossed className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            {welcomeMessage ?? lbl.welcomeBack}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {lbl.loginToContinue}
          </p>
        </div>

        {/* OTP Login from SDK pre-built (talks to /api/auth/* via useCustomer) */}
        <OTPLogin
          onLoginSuccess={handleLoginSuccess}
          onZaloLogin={onZaloLogin}
          onGoogleLogin={onGoogleLogin}
          title={lbl.title}
        />

        {/* Default success CTA — only rendered after verifyOTP succeeds
            AND no external onLoginSuccess handler was provided. */}
        {isVerified && !onLoginSuccess && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4! space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">{lbl.successHeading}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lbl.successBody}
                  </p>
                </div>
              </div>
              <Button asChild className="w-full gap-1.5">
                <a href={accountPath}>
                  {lbl.continueToAccount}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info card — Vietnamese F&B context */}
        <Card className="bg-muted/50">
          <CardContent className="p-4!">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Số điện thoại của bạn chỉ dùng để đăng nhập và nhận thông báo đơn hàng.
              Chúng tôi không chia sẻ thông tin của bạn với bên thứ ba.
            </p>
          </CardContent>
        </Card>

        {/* Back button */}
        {onBack && (
          <Button
            variant="ghost"
            className="w-full gap-1.5"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            {lbl.back}
          </Button>
        )}
      </div>
    </div>
  );
}
