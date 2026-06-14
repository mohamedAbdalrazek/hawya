# Payment Integration - Developer Implementation Guide

## Project Context

- **Framework**: Next.js (App Router)
- **Recommended Provider**: HyperPay or Moyasar
- **Payment Methods**: Mada, Visa/Mastercard, Apple Pay, STC Pay
- **Currency**: SAR (Saudi Riyal)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                            │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │ Booking Page│───▶│ Payment Form │───▶│  Success  │  │
│  │  (details)  │    │  (gateway)   │    │   Page    │  │
│  └─────────────┘    └──────────────┘    └───────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      Backend                             │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │ API Route /  │───▶│   Payment    │───▶│  Database  │  │
│  │Server Action │    │  Verification│    │  Update    │  │
│  └──────────────┘    └──────────────┘    └───────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Payment Gateway (HyperPay/Moyasar)          │
│  ┌──────────┐    ┌───────────┐    ┌─────────────────┐   │
│  │ Tokenize │───▶│  Process  │───▶│ Webhook Notify  │   │
│  └──────────┘    └───────────┘    └─────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Steps

### Phase 1: Setup & Configuration (Day 1-2)

#### Step 1.1: Install Dependencies

```bash
# For Moyasar
npm install @moyasar/moyasar-react
# OR for custom integration, no package needed - use their JS library

# Utility packages
npm install uuid crypto-js
```

#### Step 1.2: Environment Variables

Create/update `.env.local`:

```env
# Moyasar (if chosen)
MOYASAR_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
MOYASAR_SECRET_KEY=sk_live_xxxxxxxxxxxxx

# HyperPay (if chosen)
HYPERPAY_ENTITY_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
HYPERPAY_ACCESS_TOKEN=OGxxxxxxxxxxxxxxxxxxxxxxxxxx
HYPERPAY_BASE_URL=https://eu-prod.oppwa.com

# General
NEXT_PUBLIC_PAYMENT_PROVIDER=moyasar  # or hyperpay
NEXT_PUBLIC_BASE_URL=https://hawya.com
PAYMENT_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

#### Step 1.3: Database Schema Updates

Add payment-related tables/fields:

```sql
-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
  provider VARCHAR(20) NOT NULL, -- moyasar, hyperpay
  provider_payment_id VARCHAR(255),
  payment_method VARCHAR(20), -- mada, visa, mastercard, applepay, stcpay
  card_last_four VARCHAR(4),
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add payment status to bookings
ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(20) DEFAULT 'unpaid';
ALTER TABLE bookings ADD COLUMN payment_id UUID REFERENCES payments(id);
```

---

### Phase 2: Payment Integration (Day 3-6)

#### Step 2.1: Payment Service Layer

Create `src/lib/payment/index.ts`:

```typescript
import { PaymentProvider, PaymentResult, PaymentConfig } from './types';
import { MoyasarProvider } from './moyasar';
import { HyperPayProvider } from './hyperpay';

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER;
  
  switch (provider) {
    case 'moyasar':
      return new MoyasarProvider();
    case 'hyperpay':
      return new HyperPayProvider();
    default:
      throw new Error(`Unknown payment provider: ${provider}`);
  }
}
```

Create `src/lib/payment/types.ts`:

```typescript
export interface PaymentConfig {
  amount: number; // in smallest unit (halala)
  currency: string;
  description: string;
  bookingId: string;
  customerEmail?: string;
  customerName?: string;
  callbackUrl: string;
}

export interface PaymentResult {
  id: string;
  status: 'initiated' | 'paid' | 'failed' | 'expired';
  providerPaymentId: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  cardLastFour?: string;
  redirectUrl?: string;
  errorMessage?: string;
}

export interface PaymentProvider {
  createPayment(config: PaymentConfig): Promise<PaymentResult>;
  verifyPayment(paymentId: string): Promise<PaymentResult>;
  refundPayment(paymentId: string, amount?: number): Promise<PaymentResult>;
  getClientConfig(): Record<string, string>;
}
```

#### Step 2.2: Moyasar Implementation

Create `src/lib/payment/moyasar.ts`:

```typescript
import { PaymentProvider, PaymentConfig, PaymentResult } from './types';

export class MoyasarProvider implements PaymentProvider {
  private secretKey: string;
  private publishableKey: string;
  private baseUrl = 'https://api.moyasar.com/v1';

  constructor() {
    this.secretKey = process.env.MOYASAR_SECRET_KEY!;
    this.publishableKey = process.env.MOYASAR_PUBLISHABLE_KEY!;
  }

  async createPayment(config: PaymentConfig): Promise<PaymentResult> {
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(this.secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: config.amount,
        currency: config.currency,
        description: config.description,
        callback_url: config.callbackUrl,
        metadata: {
          booking_id: config.bookingId,
        },
        source: { type: 'token', token: '' }, // Token comes from frontend
      }),
    });

    const data = await response.json();
    
    return {
      id: data.id,
      status: this.mapStatus(data.status),
      providerPaymentId: data.id,
      amount: data.amount,
      currency: data.currency,
      redirectUrl: data.source?.transaction_url,
    };
  }

  async verifyPayment(paymentId: string): Promise<PaymentResult> {
    const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(this.secretKey + ':').toString('base64')}`,
      },
    });

    const data = await response.json();

    return {
      id: data.id,
      status: this.mapStatus(data.status),
      providerPaymentId: data.id,
      amount: data.amount,
      currency: data.currency,
      paymentMethod: data.source?.type,
      cardLastFour: data.source?.number?.slice(-4),
    };
  }

  async refundPayment(paymentId: string, amount?: number): Promise<PaymentResult> {
    const response = await fetch(`${this.baseUrl}/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(this.secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    return {
      id: data.id,
      status: 'paid',
      providerPaymentId: data.id,
      amount: data.amount,
      currency: data.currency,
    };
  }

  getClientConfig() {
    return {
      publishableKey: this.publishableKey,
      provider: 'moyasar',
    };
  }

  private mapStatus(status: string): PaymentResult['status'] {
    switch (status) {
      case 'paid': return 'paid';
      case 'failed': return 'failed';
      case 'initiated': return 'initiated';
      default: return 'expired';
    }
  }
}
```

#### Step 2.3: Payment API Routes

Create `src/app/api/payments/create/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, amount, description } = body;

    // Validate booking exists and amount matches
    // const booking = await getBooking(bookingId);

    const provider = getPaymentProvider();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const payment = await provider.createPayment({
      amount: amount * 100, // Convert to halala
      currency: 'SAR',
      description,
      bookingId,
      callbackUrl: `${baseUrl}/bookings/${bookingId}/payment/callback`,
    });

    // Save payment record to database
    // await savePayment(payment, bookingId);

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Payment creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
```

Create `src/app/api/payments/verify/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = await request.json();

    const provider = getPaymentProvider();
    const result = await provider.verifyPayment(paymentId);

    if (result.status === 'paid') {
      // Update booking status to paid
      // await updateBookingPaymentStatus(result);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
```

Create `src/app/api/payments/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook signature
    const signature = request.headers.get('x-moyasar-signature');
    // TODO: Validate signature against PAYMENT_WEBHOOK_SECRET

    const { id, status, amount, metadata } = body;

    if (status === 'paid') {
      // Update payment and booking status
      // await markPaymentComplete(id, metadata.booking_id);
    } else if (status === 'failed') {
      // Mark payment as failed
      // await markPaymentFailed(id, body.message);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
```

#### Step 2.4: Frontend Payment Component

Create `src/components/payment/PaymentForm.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';

interface PaymentFormProps {
  amount: number; // in SAR
  description: string;
  bookingId: string;
  callbackUrl: string;
}

export function PaymentForm({ amount, description, bookingId, callbackUrl }: PaymentFormProps) {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Moyasar script
    const script = document.createElement('script');
    script.src = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.js';
    script.async = true;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.css';
    document.head.appendChild(link);

    script.onload = () => {
      if (window.Moyasar && formRef.current) {
        window.Moyasar.init({
          element: formRef.current,
          amount: amount * 100, // Convert to halala
          currency: 'SAR',
          description,
          publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY,
          callback_url: callbackUrl,
          methods: ['creditcard', 'applepay', 'stcpay'],
          supported_networks: ['visa', 'mastercard', 'mada'],
          metadata: { booking_id: bookingId },
          on_completed: async (payment: any) => {
            // Verify payment on backend
            await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId: payment.id }),
            });
          },
        });
      }
    };

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(link);
    };
  }, [amount, description, bookingId, callbackUrl]);

  return <div ref={formRef} className="moyasar-form" />;
}
```

---

### Phase 3: Booking Flow Modification (Day 7-9)

#### Step 3.1: Update Booking Flow

Modify the booking confirmation page to include payment:

```tsx
// src/app/[locale]/bookings/[id]/pay/page.tsx
import { PaymentForm } from '@/components/payment/PaymentForm';

export default async function PaymentPage({ params }: { params: { id: string; locale: string } }) {
  // Fetch booking details
  // const booking = await getBooking(params.id);

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Complete Payment</h1>
      
      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h2 className="font-semibold">Booking Summary</h2>
        {/* Display car, dates, total */}
      </div>

      {/* Payment Form */}
      <PaymentForm
        amount={500} // booking.totalAmount
        description={`Car rental booking #${params.id}`}
        bookingId={params.id}
        callbackUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${params.locale}/bookings/${params.id}/confirmation`}
      />
    </div>
  );
}
```

#### Step 3.2: Payment Callback Page

```tsx
// src/app/[locale]/bookings/[id]/confirmation/page.tsx
export default async function PaymentConfirmation({ 
  params, 
  searchParams 
}: { 
  params: { id: string; locale: string };
  searchParams: { id?: string; status?: string };
}) {
  // Verify payment status from query params
  const paymentId = searchParams.id;
  
  if (paymentId) {
    // Verify with backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId }),
    });
    const payment = await res.json();
    
    if (payment.status === 'paid') {
      return <PaymentSuccess bookingId={params.id} />;
    }
  }

  return <PaymentFailed bookingId={params.id} />;
}
```

---

### Phase 4: Admin Dashboard (Day 10-12)

#### Step 4.1: Payments List in Admin

Add a payments management section to the admin dashboard:
- View all payments with status, amount, date, booking reference
- Filter by status (paid, pending, failed, refunded)
- Search by booking ID or customer name
- Export payments report (CSV)

#### Step 4.2: Refund Capability

- Add refund button to individual payment records
- Support full and partial refunds
- Confirm refund before processing
- Update booking status on refund

---

### Phase 5: Testing (Day 13-15)

#### Step 5.1: Sandbox Testing

Use provider test cards:

**Moyasar Test Cards:**
| Card Number | Result |
|-------------|--------|
| 4111 1111 1111 1111 | Successful payment |
| 4000 0000 0000 0002 | Declined |
| 5200 0000 0000 0007 | Mastercard success |

**Mada Test Cards (Moyasar):**
| Card Number | Result |
|-------------|--------|
| 5078 0363 4330 8082 | Mada success |

#### Step 5.2: Test Scenarios

- [ ] Successful payment with Visa
- [ ] Successful payment with Mastercard
- [ ] Successful payment with Mada
- [ ] Failed payment (declined card)
- [ ] Payment timeout/expiry
- [ ] Successful refund (full)
- [ ] Successful refund (partial)
- [ ] Webhook delivery and processing
- [ ] Apple Pay flow (requires real device)
- [ ] STC Pay flow
- [ ] Concurrent payments
- [ ] Double-payment prevention
- [ ] Payment callback with network interruption

#### Step 5.3: Go-Live Checklist

- [ ] Switch from test to live API keys
- [ ] Verify webhook URL is accessible from provider
- [ ] SSL certificate is valid and not expiring soon
- [ ] Error monitoring is set up (Sentry or similar)
- [ ] Payment failure email notifications to admin
- [ ] Successful payment confirmation email to customer
- [ ] Verify refund flow works in live mode (small amount)
- [ ] Remove any test/debug logging of sensitive data

---

## Security Considerations

1. **Never log full card numbers** - Only store last 4 digits
2. **Server-side verification** - Always verify payment status on your backend, never trust client-side callbacks alone
3. **Webhook signature validation** - Verify all incoming webhooks are genuinely from the provider
4. **HTTPS only** - All payment pages must be served over HTTPS
5. **CSP headers** - Allow payment provider scripts in Content-Security-Policy
6. **Rate limiting** - Add rate limiting to payment creation endpoints
7. **Idempotency** - Use idempotency keys to prevent duplicate payments

---

## File Structure

```
src/
├── lib/
│   └── payment/
│       ├── index.ts          # Provider factory
│       ├── types.ts          # Type definitions
│       ├── moyasar.ts        # Moyasar implementation
│       └── hyperpay.ts       # HyperPay implementation (alternative)
├── app/
│   ├── api/
│   │   └── payments/
│   │       ├── create/route.ts
│   │       ├── verify/route.ts
│   │       ├── refund/route.ts
│   │       └── webhook/route.ts
│   └── [locale]/
│       └── bookings/
│           └── [id]/
│               ├── pay/page.tsx
│               └── confirmation/page.tsx
├── components/
│   └── payment/
│       ├── PaymentForm.tsx
│       ├── PaymentStatus.tsx
│       └── PaymentReceipt.tsx
└── types/
    └── payment.d.ts          # Moyasar global type declarations
```

---

## Estimated Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Setup, environment, DB schema | 2 days |
| 2 | Payment provider integration (API + frontend) | 4 days |
| 3 | Booking flow modification | 3 days |
| 4 | Admin dashboard payment management | 3 days |
| 5 | Testing, bug fixes, go-live | 3 days |
| **Total** | | **15 days** |

---

## Dependencies to Add

```json
{
  "dependencies": {
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/uuid": "^9.0.0"
  }
}
```

> Note: Moyasar's payment form is loaded via CDN script tag, no npm package needed for the basic integration. For React-specific wrappers, check if `@moyasar/moyasar-react` is available.

---

## Useful Links

- [Moyasar Docs](https://docs.moyasar.com/)
- [Moyasar Dashboard](https://dashboard.moyasar.com/)
- [HyperPay Docs](https://wordpresshyperpay.docs.oppwa.com/)
- [HyperPay Dashboard](https://merchant.hyperpay.com/)
- [Mada Acceptance Guidelines](https://www.mada.com.sa/en/merchants)

---

*Document prepared: June 2026*
*For: Hawya Car Rental - Developer Reference*
