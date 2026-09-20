# Payment Integration Guide - Saudi Arabia Car Rental Website

## Document Purpose

This document outlines available payment gateway providers for integrating online payments into the Hawya car rental website, including costs, features, and recommended steps.

---

## Payment Providers Comparison

### 1. HyperPay (Recommended)

| Item | Details |
|------|---------|
| **Headquarters** | Saudi Arabia |
| **SAMA Licensed** | Yes |
| **PCI DSS** | Level 1 |
| **Settlement Time** | T+1 to T+2 (Saudi banks) |
| **Mada Support** | Native |
| **Apple Pay** | Yes |
| **STC Pay** | Yes |
| **Google Pay** | Yes |
| **Arabic Support** | Full |
| **Monthly Fee** | None (custom contract) |

**Transaction Fees:**
| Payment Method | Fee |
|----------------|-----|
| Visa / Mastercard | 2.5% - 2.7% + 1 SAR per transaction |
| Mada | 1.75% + 1 SAR per transaction |
| Apple Pay | ~2.5% + 1 SAR per transaction |

**Why HyperPay:**
- Highest Mada approval rates in Saudi Arabia (95%+)
- Fastest settlement time (next business day)
- Built specifically for Saudi market
- Supports all local payment methods
- Enterprise-grade security

---

### 2. Moyasar

| Item | Details |
|------|---------|
| **Headquarters** | Saudi Arabia |
| **SAMA Licensed** | Yes |
| **PCI DSS** | Level 1 |
| **Settlement Time** | T+1 to T+3 |
| **Mada Support** | Native |
| **Apple Pay** | Yes |
| **STC Pay** | Yes |
| **Arabic Support** | Full |
| **Monthly Fee** | None |

**Transaction Fees:**
| Payment Method | Fee |
|----------------|-----|
| Visa / Mastercard | 2.9% + 1 SAR per transaction |
| Mada | 2.5% per transaction |
| Apple Pay | 2.9% per transaction |

**Why Moyasar:**
- Transparent public pricing (no negotiation needed)
- Clean developer API
- Fast self-serve onboarding
- No monthly fees
- Good for startups and SMEs

**Limitations:**
- Supported by limited banks (Arab Bank, Al Rajhi Bank)
- Slightly higher Visa/MC fees

---

### 3. Tap Payments

| Item | Details |
|------|---------|
| **Headquarters** | Kuwait (operates across GCC) |
| **SAMA Licensed** | Yes |
| **PCI DSS** | Level 1 |
| **Settlement Time** | T+2 to T+3 |
| **Mada Support** | Native |
| **Apple Pay** | Yes |
| **STC Pay** | Yes |
| **Arabic Support** | Full |
| **Monthly Fee** | None |

**Transaction Fees:**
| Payment Method | Fee |
|----------------|-----|
| Standard (Visa/MC/Mada) | 2.75% - 2.85% + 0.30 SAR per transaction |
| International Cards | 3.25% + FX fee |

**Why Tap Payments:**
- Good for multi-country GCC operations
- Quick onboarding
- Wide payment method support

**Limitations:**
- Mada approval rates not as high as HyperPay
- Higher fees for low-volume merchants
- Less Saudi-specific optimization

---

### 4. PayTabs

| Item | Details |
|------|---------|
| **Headquarters** | Saudi Arabia |
| **SAMA Licensed** | Yes |
| **PCI DSS** | Level 1 |
| **Settlement Time** | T+2 to T+5 |
| **Mada Support** | Native |
| **Apple Pay** | Supported |
| **STC Pay** | Supported |
| **Arabic Support** | Full |
| **Monthly Fee** | Custom pricing |

**Transaction Fees:**
| Payment Method | Fee |
|----------------|-----|
| Standard | 2.7% - 2.85% + 1 SAR per transaction |
| Mada | ~1.75% + 1 SAR |

**Why PayTabs:**
- Works with most Saudi banks
- Supports 168 currencies
- Good for international customers

**Limitations:**
- Slower settlement (up to 5 days)
- Custom pricing requires negotiation
- Longer integration time

---

### 5. Telr

| Item | Details |
|------|---------|
| **Headquarters** | UAE (operates in KSA) |
| **SAMA Licensed** | Yes |
| **Settlement Time** | Standard |
| **Mada Support** | Yes |
| **STC Pay** | Yes (0.90%) |
| **Arabic Support** | Yes |

**Monthly Fees & Transaction Fees (based on volume):**
| Monthly Volume (SAR) | Monthly Fee | Credit Card Fee | Mada Fee |
|----------------------|-------------|----------------|----------|
| 0 - 30,000 | 99 SAR | 3.00% + 1 SAR | 2.75% + 1 SAR |
| 30,001 - 80,000 | 179 SAR | 2.75% + 1 SAR | 2.75% + 1 SAR |
| 80,001 - 300,000 | 259 SAR | 2.60% + 1 SAR | 2.60% + 1 SAR |

**Limitations:**
- Has monthly fees unlike competitors
- All fees subject to 15% VAT

---

## Summary Comparison Table

| Provider | Visa/MC Fee | Mada Fee | Monthly Fee | Settlement | Best For |
|----------|-------------|----------|-------------|------------|----------|
| **HyperPay** | 2.5-2.7% + 1 SAR | 1.75% + 1 SAR | None | T+1-2 | Saudi-focused businesses |
| **Moyasar** | 2.9% + 1 SAR | 2.5% | None | T+1-3 | Startups, transparent pricing |
| **Tap Payments** | 2.75-2.85% + 0.30 SAR | 2.75% + 0.30 SAR | None | T+2-3 | GCC expansion |
| **PayTabs** | 2.7-2.85% + 1 SAR | 1.75% + 1 SAR | Custom | T+2-5 | Multi-currency needs |
| **Telr** | 2.6-3% + 1 SAR | 2.6-2.75% + 1 SAR | 99-259 SAR | Standard | High-volume merchants |

---

## Recommendation for a Saudi Car Rental Company

### Primary Recommendation: HyperPay

**Reasons:**
1. **Highest Mada approval rates** - Most Saudi customers pay with Mada debit cards
2. **Fastest settlement (T+1)** - You receive money next business day
3. **SAMA Licensed** - Fully compliant with Saudi regulations
4. **No monthly fees** - Only pay per transaction
5. **Enterprise support** - Dedicated account management
6. **All payment methods** - Mada, Visa, MC, Apple Pay, STC Pay in one integration

### Secondary Recommendation: Moyasar

If you prefer simpler onboarding and transparent pricing without needing to negotiate a contract, Moyasar is an excellent alternative.

---

## Cost Estimation for Your Business

### Transaction Fee Impact (Example)

Assuming average car rental booking = 500 SAR:

| Provider | Fee per Booking | Annual Cost (100 bookings/month) |
|----------|----------------|----------------------------------|
| HyperPay (Mada) | ~9.75 SAR | ~11,700 SAR/year |
| HyperPay (Visa/MC) | ~13.50 SAR | ~16,200 SAR/year |
| Moyasar (Mada) | ~12.50 SAR | ~15,000 SAR/year |
| Moyasar (Visa/MC) | ~15.50 SAR | ~18,600 SAR/year |

> Note: Most Saudi customers (70-80%) will pay with Mada, making HyperPay the most cost-effective option.

### Maintenance Costs

| Item | Cost | Frequency |
|------|------|-----------|
| Payment Gateway Monthly Fee | 0 SAR (HyperPay/Moyasar) | Monthly |
| SSL Certificate | Usually included with hosting | Annual |
| PCI Compliance | Handled by payment provider | N/A |
| Technical Maintenance | Minimal (see implementation cost) | As needed |

---

## Implementation Cost

### Original Website Development Cost: 24,000 EGP

### Payment Integration Feature Cost: 10,000 - 15,000 EGP

**Breakdown of why:**
| Item | Estimated Effort |
|------|-----------------|
| Payment gateway integration & API setup | 3-4 days |
| Booking flow modification (add payment step) | 2-3 days |
| Payment confirmation & receipt system | 1-2 days |
| Refund/cancellation handling | 1-2 days |
| Admin dashboard (payment management) | 2-3 days |
| Testing (sandbox + live) | 2-3 days |
| **Total** | **11-17 days** |

**Recommended price: 12,000 EGP** (50% of original project cost)

This reflects:
- Payment is a revenue-critical feature (directly generates income)
- Requires security expertise (handling sensitive financial data)
- Includes testing with real payment methods
- Includes 30 days of post-launch support for payment issues

---

## Steps Required from Your End (The Client)

### Step 1: Ensure Business Requirements are Met
- [ ] Valid Commercial Registration (CR) - السجل التجاري
- [ ] Active corporate bank account with a Saudi bank
- [ ] Valid national address registered with Saudi Post
- [ ] ZATCA tax registration number

### Step 2: Choose a Payment Provider
- [ ] Review the comparison above
- [ ] Contact HyperPay (recommended) or Moyasar for a merchant account

### Step 3: Apply for a Merchant Account
- [ ] Visit the provider's website and submit an application
- [ ] Provide required documents:
  - Commercial Registration certificate
  - National ID of the business owner
  - Corporate bank account details (IBAN)
  - Company letterhead
  - Website URL
  - Business description / activity type

### Step 4: Account Verification & Approval
- [ ] Provider reviews your application (typically 3-7 business days)
- [ ] You may receive follow-up questions about your business
- [ ] Once approved, you receive API credentials (test + live keys)

### Step 5: Share Credentials with Developer
- [ ] Send the API keys (publishable key + secret key) securely to the developer
- [ ] Confirm which payment methods you want enabled:
  - Mada (recommended - most used in KSA)
  - Visa / Mastercard
  - Apple Pay
  - STC Pay

### Step 6: Testing Phase
- [ ] Review the payment flow on the test/staging website
- [ ] Make a test payment to verify everything works
- [ ] Approve the flow and design

### Step 7: Go Live
- [ ] Developer switches from test to live API keys
- [ ] Make a real small payment to verify live mode works
- [ ] Monitor first few real transactions

### Step 8: Ongoing
- [ ] Monitor payments through the provider's dashboard
- [ ] Handle refunds through the admin panel or provider dashboard
- [ ] Keep business documents up to date with the provider

---

## Timeline

| Phase | Duration |
|-------|----------|
| Client: Apply for merchant account | 1-2 weeks |
| Developer: Build payment integration | 2-3 weeks |
| Testing & QA | 1 week |
| Go Live | 1 day |
| **Total** | **4-6 weeks** |

---

## Important Notes

1. **SAMA Compliance**: Only use SAMA-licensed payment providers. Using unlicensed providers is illegal in Saudi Arabia and leads to high decline rates.

2. **Stripe is NOT recommended**: Stripe does not support Mada and is not SAMA-licensed for Saudi acquiring. Most Saudi bank cards will be declined.

3. **Mada is Essential**: 70-80% of Saudi consumers use Mada debit cards. Any payment provider you choose MUST support Mada natively.

4. **Apple Pay is Highly Recommended**: Apple has a very high market share in Saudi Arabia, making Apple Pay a frequently used payment method.

5. **VAT Consideration**: Payment gateway fees are subject to 15% VAT in Saudi Arabia.

---

*Document prepared: June 2026*
*For: Hawya Car Rental - Saudi Arabia*
