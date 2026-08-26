/**
 * @g66/storefront-sdk — gourmet-food AccountPage
 *
 * Phase 4 §4.4: 🟡 SHARED page — Account composition for F&B storefronts.
 * Wraps AccountPage pre-built with F&B-specific loyalty features:
 * - Loyalty points display (Vietnamese: "Điểm tích lũy")
 * - Reorder button on completed orders
 * - Vietnamese labels for all tabs and sections
 * - F&B-themed profile header
 *
 * @example
 * ```tsx
 * <AccountPage
 *   loyaltyPoints={1250}
 *   onLogout={() => router.push('/')}
 *   onReorder={(orderId) => reorderItems(orderId)}
 * />
 * ```
 */
'use client';

import React, { useEffect } from 'react';
import {
  LogOut,
  Star,
  RotateCcw,
  Gift,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  User,
  Package,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCustomer } from '../../../hooks/use-customer';
import type { CustomerOrder, CustomerAddress } from '../../../types/customer';

// ─── Props ──────────────────────────────────────────────

export interface AccountPageProps {
  /** Called when user logs out */
  onLogout?: () => void;
  /** Loyalty points balance */
  loyaltyPoints?: number;
  /** Loyalty tier name (e.g. "Vàng", "Bạch kim") */
  loyaltyTier?: string;
  /** Called when user clicks reorder on a completed order */
  onReorder?: (orderId: string) => void;
  /** Labels (Vietnamese defaults) */
  labels?: {
    title?: string;
    orders?: string;
    profile?: string;
    addresses?: string;
    loyalty?: string;
    points?: string;
    tier?: string;
    reorder?: string;
    orderHistory?: string;
    noOrders?: string;
    noAddresses?: string;
    logout?: string;
    memberSince?: string;
    name?: string;
    phone?: string;
    email?: string;
    defaultAddress?: string;
  };
  /** Additional CSS class */
  className?: string;
}

const DEFAULT_LABELS = {
  title: 'Tài khoản',
  orders: 'Đơn hàng',
  profile: 'Hồ sơ',
  addresses: 'Địa chỉ',
  loyalty: 'Điểm tích lũy',
  points: 'điểm',
  tier: 'Hạng',
  reorder: 'Đặt lại',
  orderHistory: 'Lịch sử đơn hàng',
  noOrders: 'Chưa có đơn hàng nào.',
  noAddresses: 'Chưa có địa chỉ đã lưu.',
  logout: 'Đăng xuất',
  memberSince: 'Thành viên từ',
  name: 'Họ và tên',
  phone: 'Số điện thoại',
  email: 'Email',
  defaultAddress: 'Mặc định',
};

// ─── Helper ─────────────────────────────────────────────

/** Status badge variant helper with Vietnamese status labels */
function statusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" />Hoàn tất</Badge>;
    case 'cancelled':
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Đã hủy</Badge>;
    case 'processing':
      return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Đang xử lý</Badge>;
    case 'shipping':
      return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Đang giao</Badge>;
    default:
      return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />{status}</Badge>;
  }
}

// ─── Component ──────────────────────────────────────────

/**
 * AccountPage — F&B account page with loyalty + reorder features.
 *
 * Layout:
 *   - Profile header with loyalty card
 *   - Tab layout: Đơn hàng / Hồ sơ / Địa chỉ
 */
export function AccountPage({
  onLogout,
  loyaltyPoints,
  loyaltyTier,
  onReorder,
  labels,
  className,
}: AccountPageProps) {
  const lbl = { ...DEFAULT_LABELS, ...labels };
  const { customer, orders, addresses, isLoading, error, fetchOrders, fetchAddresses, logout } = useCustomer();

  useEffect(() => {
    void fetchOrders();
    void fetchAddresses();
  }, [fetchOrders, fetchAddresses]);

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  return (
    <div className={`px-4 md:px-8 py-8 max-w-4xl mx-auto ${className ?? ''}`}>
      {/* Profile header + Loyalty card */}
      {customer && (
        <Card className="mb-6">
          <CardContent className="p-4! sm:p-6!">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                {customer.name ? customer.name[0].toUpperCase() : customer.phone.slice(-2)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold truncate">
                  {customer.name || customer.phone}
                </h2>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              </div>

              {/* Loyalty badge */}
              {(loyaltyPoints !== undefined || loyaltyTier) && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Gift className="h-5 w-5 text-primary" />
                  <div className="text-right">
                    {loyaltyPoints !== undefined && (
                      <p className="text-sm font-bold text-primary">
                        {loyaltyPoints.toLocaleString('vi-VN')} {lbl.points}
                      </p>
                    )}
                    {loyaltyTier && (
                      <p className="text-xs text-muted-foreground">
                        {lbl.tier}: {loyaltyTier}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Logout */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 shrink-0"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{lbl.logout}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <p className="text-sm text-destructive mb-4">{error}</p>
      )}

      {/* Tab layout */}
      <Tabs defaultValue="orders">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="orders" className="gap-1.5">
            <Package className="h-4 w-4" />
            {lbl.orders}
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-4 w-4" />
            {lbl.profile}
          </TabsTrigger>
          <TabsTrigger value="addresses" className="gap-1.5">
            <MapPin className="h-4 w-4" />
            {lbl.addresses}
          </TabsTrigger>
          {loyaltyPoints !== undefined && (
            <TabsTrigger value="loyalty" className="gap-1.5">
              <Star className="h-4 w-4" />
              {lbl.loyalty}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Orders tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{lbl.orderHistory}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-2">
                  {orders.map((order) => (
                    <FnbOrderRow
                      key={order.id}
                      order={order}
                      onReorder={onReorder}
                      reorderLabel={lbl.reorder}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{lbl.noOrders}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{lbl.profile}</CardTitle>
            </CardHeader>
            <CardContent>
              {customer ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{lbl.name}</span>
                    <span className="font-medium">{customer.name || '—'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{lbl.phone}</span>
                    <span className="font-medium">{customer.phone}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{lbl.email}</span>
                    <span className="font-medium">{customer.email || '—'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{lbl.memberSince}</span>
                    <span className="font-medium">
                      {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa đăng nhập.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses tab */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{lbl.addresses}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <FnbAddressRow key={addr.id} address={addr} defaultLabel={lbl.defaultAddress} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{lbl.noAddresses}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loyalty tab (only shown when loyaltyPoints is provided) */}
        {loyaltyPoints !== undefined && (
          <TabsContent value="loyalty">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  {lbl.loyalty}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Points display */}
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-primary">
                    {loyaltyPoints.toLocaleString('vi-VN')}
                  </p>
                  <p className="text-sm text-muted-foreground">{lbl.points}</p>
                  {loyaltyTier && (
                    <Badge variant="secondary" className="mt-2">
                      {lbl.tier}: {loyaltyTier}
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* How points work — Vietnamese F&B context */}
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">Cách tích điểm:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>1.000₫ = 1 điểm</li>
                    <li>100 điểm = 10.000₫ giảm giá</li>
                    <li>Điểm áp dụng cho mọi đơn hàng</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// ─── Internal sub-components ────────────────────────────

/** F&B Order row with reorder button */
function FnbOrderRow({
  order,
  onReorder,
  reorderLabel,
}: {
  order: CustomerOrder;
  onReorder?: (orderId: string) => void;
  reorderLabel: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 border border-border rounded-lg gap-2">
      <div className="min-w-0">
        <p className="text-sm font-medium">#{order.orderNumber}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {statusBadge(order.status)}
        <span className="text-sm font-semibold">
          {order.total.toLocaleString('vi-VN')}₫
        </span>
        {order.status === 'completed' && onReorder && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1 h-7 text-xs"
            onClick={() => onReorder(order.id)}
          >
            <RotateCcw className="h-3 w-3" />
            {reorderLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

/** F&B Address row */
function FnbAddressRow({ address, defaultLabel }: { address: CustomerAddress; defaultLabel: string }) {
  return (
    <div className="p-3 border border-border rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium">{address.label}</span>
        {address.isDefault && (
          <Badge variant="default" className="text-xs">{defaultLabel}</Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {address.fullName} · {address.phone}
      </p>
      <p className="text-xs text-muted-foreground">
        {address.address}, {address.ward}, {address.district}, {address.city}
      </p>
    </div>
  );
}
