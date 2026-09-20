# New Folder Structure

# Project folder structure conventions (Hawya / Marakeb)

Conventions for migrating this Next.js 16 car-rental app from today’s `src/components/` + fat `app/` routes to a **feature-first** layout. Examples below use **real routes, components, and paths from this repo**.

## Top-level layout

```
src/
├── features/     ← all domain/page-specific code
├── shared/       ← code used by 2+ features
├── app/          ← Next.js routing and API routes only
├── i18n/         ← next-intl routing, request config, navigation helpers
├── sdk/          ← third-party client wrappers (Firebase, Cloudinary)
├── utils/        ← types, pure helpers, API response helpers (migrate into shared/ over time)
└── proxy.ts      ← locale routing + admin auth middleware

messages/         ← next-intl JSON (split by feature namespace — see Messages section)
public/           ← static assets (images, video, favicon)
```

**Today vs target**

| Today | Target |
|-------|--------|
| `src/components/home/landing/Landing.tsx` | `src/features/home/01.Landing/Landing.tsx` |
| `src/components/cars-page/cars-filter/CarsFilter.tsx` | `src/features/cars/02.CarsFilter/CarsFilter.tsx` |
| `src/components/layout/nav/Nav.tsx` | `src/shared/components/layout/Nav/Nav.tsx` |
| `src/app/[locale]/cars/page.tsx` (metadata + layout + imports) | Thin `page.tsx` → `@/features/cars` |
| `src/app/api/getCars/route.ts` (Firestore via `firebaseAdmin`) | Stays under `app/api/`; extract query logic to `shared/lib/firestore/` when refactoring |

---

## Naming conventions

**Component folders and component names use PascalCase.** Numeric prefixes use two digits (`00`–`99`).

```
✅ 00.CarsPage/
✅ 02.CarsFilter/
✅ 02.CarsFilter.CarsPriceFilter/
✅ _CarCard/
✅ 03.CarsGrid._CarCard/
✅ 03.FleetPreview.CarImagesSlider/
✅ 04.Locations.MapPin/
✅ 02.CarsFilter.FilterIcon/                    ← folder leaf shortened; file stays CarsPriceFilter.tsx when applicable
❌ 3.CarsFilter/
❌ 02.CarsFilter.CarsFilterPriceFilter/         ← redundant prefix; use .CarsPriceFilter/
❌ 04._CarCard/                                 ← feature-wide shared: no NN prefix
❌ 03._CarCard/                                 ← main-scoped shared needs parent name
❌ _CarCard/                                    ← use this only for feature-wide shared, not under one section
❌ carsFilter/
❌ 02.carsFilter.carsPriceFilter/
```

**Inside a component folder (Option A — prefixed files):** `ComponentName.<role>.<ext>` — e.g. `CarsPage.helpers.ts`, `BookingsPage.fetch.ts`.

**Inside a component folder (Option B — role folders):** `lib/`, plus `types.ts` and `CarsPage.module.css` at the folder root.

Non-component **roles** in filenames use camelCase (`helpers`, `mapper`, `fetch`, `data`, `schemas`, `context`, `useContext`).

This applies everywhere — `features/`, `shared/`, `app/` (route `types.ts` only). No exceptions.

Styles in this project use **CSS modules** (`.module.css`), not SCSS.

### Prefix drop on folder leaf segments

When a dotted folder chain lists ancestor segments plus the component name, **shorten only the last segment** in the **folder name** if any earlier segment in that chain is a **prefix** of the full React `ComponentName`.

* **Folder** — drop the redundant prefix from the leaf segment only (e.g. `02.CarsFilter.PriceFilter/` when the component is `CarsPriceFilter`).
* **React file and export** — always keep the full name (`CarsPriceFilter.tsx`, `export { CarsPriceFilter }`).
* **Check order** — walk ancestors from immediate parent back to the top-level section `{NN}`; use the **longest** matching prefix.

```
Full name: CarsPriceFilter
Mapper-style chain: 02.CarsFilter.CarsFilter.CarsPriceFilter
Folder:             02.CarsFilter.CarsPriceFilter

Full name: CarImagesSlider
Folder:             03.FleetPreview.CarImagesSlider   ← no drop (FleetPreview is not a prefix of CarImagesSlider)
```

Apply the same rule to layout orchestrator chains (`00.AdminLayout.Sidebar/` → `AdminSidebar` lives in `00.AdminLayout.AdminSidebar/` with leaf drop if needed) and to main-scoped shared leaves (`03.CarsGrid._CarCard.Badge/` — `Badge`, not `_CarCardBadge`).

Do **not** shorten component names in TSX, `index.ts` exports, or i18n keys — **folders only**.

---

## app/ — routing only (pages)

`app/[locale]/` contains ONLY Next.js route files for **pages**. No section components, no business logic beyond thin wiring.

Allowed files per route segment (routing surface only):

* `page.tsx` — re-exports `default` and `generateMetadata` from the feature (and `generateStaticParams` when needed)
* `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` — segment UI boundaries when required
* `types.ts` — **route params only**: `*PageParams`, `*PageFC`, `*GenerateMetadata` aliases
* `route.ts` — **API routes** under `app/api/` (see API section)
* `sitemap.ts`, `robots.txt`, `manifest.json` — metadata routes at the locale segment

Not allowed under page routes after migration: colocated `BookingClient.tsx`, `*.module.css` for page bodies, fetch logic, or admin table state — those belong in `features/`.

A `page.tsx` should do two things only: call `generateMetadata` and render the page root component imported from `features/`. Today routes still colocate page logic under `app/`; `cars` is representative.

```tsx
// src/app/[locale]/cars/page.tsx (current — pre-migration)
import React, { Suspense } from "react";
import styles from "./CarsPage.module.css";
import CarsFilters from "@/components/cars-page/cars-filter/CarsFilter";
import CarsGrid from "@/components/cars-page/cars-grid/CarsGrid";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });
    return {
        title: t("cars.title"),
        description: t("cars.description"),
        // openGraph, twitter, alternates…
    };
}

const CarsPage = () => {
    const t = useTranslations("CarsPage");
    return (
        <main className={styles.pageContainer}>
            <section className={styles.headerSection}>
                <h1>{t("title")}</h1>
                <p>{t("subtitle")}</p>
            </section>
            <Suspense><CarsFilters /></Suspense>
            <Suspense><CarsGrid /></Suspense>
        </main>
    );
};

export default CarsPage;
```

Target after migration (thin route file only):

```tsx
// src/app/[locale]/cars/page.tsx (target)
import CarsPage, { generateMetadata } from "@/features/cars";

export { generateMetadata };
export default CarsPage;
```

```tsx
// src/app/[locale]/car-rental/confirmation/page.tsx (target)
import ConfirmationPage, { generateMetadata } from "@/features/car-rental-confirmation";

export { generateMetadata };
export default ConfirmationPage;
```

```tsx
// src/app/[locale]/dashboard/admin/bookings/page.tsx (target)
import BookingsPage from "@/features/admin-bookings";

export default BookingsPage;
```

---

## app/api/ — REST API routes (Firebase)

API routes stay under `app/api/`. They are thin handlers: validate input, read/write **Firestore** via `@/sdk/firebaseAdmin`, return JSON.

**Today**

```
src/app/api/
├── getCars/route.ts              ← Firestore: cars collection
├── getBookings/route.ts
├── addBooking/route.ts
├── getMaxMinPrice/route.ts
├── cars-details/get/route.ts
├── messages/get/route.ts
├── messages/post/route.ts
├── messages/delete/route.ts
└── admin/
    ├── auth/route.ts
    ├── get-cars/route.ts
    ├── add-car/route.ts
    ├── edit-car/route.ts
    ├── upload-image/route.ts
    ├── validate-session/route.ts
    └── …
```

**Target** — same tree; extract repeated Firestore queries into `shared/lib/firestore/` when routes grow:

```ts
// src/app/api/getCars/route.ts (today — excerpt)
import { firestoreAdmin } from "@/sdk/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const carId = request.nextUrl.searchParams.get("carId");
    if (carId) {
        const doc = await firestoreAdmin.collection("cars").doc(carId).get();
        // …
    }
    // …
}
```

Do **not** move `route.ts` files into `features/` — they are App Router entry points and belong in `app/api/`.

---

## features/ — one feature folder per route `page.tsx`

Each **App Router** `page.tsx` gets its **own** folder under `features/`. Do not put two route pages (e.g. car-rental form and confirmation) in the same feature — even when they share a URL prefix like `/car-rental`.

**Nested or dynamic segments** map to a **separate** feature name (URL segment in kebab-case):

| Route | Feature folder | Page orchestrator |
|-------|----------------|-------------------|
| `/` | `features/home/` | `00.HomePage/` |
| `/cars` | `features/cars/` | `00.CarsPage/` |
| `/about` | `features/about/` | `00.AboutPage/` |
| `/contact` | `features/contact/` | `00.ContactPage/` |
| `/locations` | `features/locations/` | `00.LocationsPage/` |
| `/car-rental` | `features/car-rental/` | `00.BookingPage/` |
| `/car-rental/confirmation` | `features/car-rental-confirmation/` | `00.ConfirmationPage/` |
| `/staff-login` | `features/staff-login/` | `00.StaffLoginPage/` |
| `/[...slug]` (404) | `features/not-found/` | `00.NotFoundPage/` |
| `/dashboard/admin/bookings` | `features/admin-bookings/` | `00.BookingsPage/` |
| `/dashboard/admin/cars` | `features/admin-cars/` | `00.AdminCarsPage/` |
| `/dashboard/admin/cars/add` | `features/admin-cars-add/` | `00.AddCarPage/` |
| `/dashboard/admin/cars/[carId]` | `features/admin-car-edit/` | `00.EditCarPage/` |
| `/dashboard/admin/staff` | `features/admin-staff/` | `00.StaffPage/` |
| `/dashboard/admin/staff/add` | `features/admin-staff-add/` | `00.AddStaffPage/` |
| `/dashboard/admin/messages` | `features/admin-messages/` | `00.MessagesPage/` |

Within a feature, **every** section and subcomponent is a **sibling folder** on the feature root. **Do not nest** component folders inside other component folders.

```
features/
├── home/
├── cars/
├── about/
├── contact/
├── locations/
├── car-rental/
├── car-rental-confirmation/
├── staff-login/
├── not-found/
├── admin-bookings/
├── admin-cars/
├── admin-cars-add/
├── admin-car-edit/
├── admin-staff/
├── admin-staff-add/
└── admin-messages/
```

A feature has **exactly one** page orchestrator folder: `00.{PageName}/` (the default export for that route's `page.tsx`).

**Exception:** the matching `layout.tsx` for the same segment may add `00.{LayoutName}/` in **that same** feature (e.g. `00.AdminLayout/` lives in `features/admin-dashboard/` or colocated with the first admin child that owns the layout — today `src/app/[locale]/dashboard/admin/layout.tsx` wraps all admin pages).

### Feature layout rules

1. **Numeric order (two digits)** — top-level sections use `01`, `02`, … `10`, `11` in **JSX render order**. Use `00` for the route page orchestrator (`00.HomePage/`, `00.CarsPage/`, `00.BookingsPage/`).
2. **One folder per component** — the React entry file is `ComponentName.tsx` inside that folder (e.g. `02.CarsFilter/CarsFilter.tsx`).
3. **Subcomponents stay on the feature root** — folder name carries the parent section's `{NN}` and ancestor chain; **apply prefix drop on the leaf segment** when a parent name is redundant (see Prefix drop).
4. **Pick one colocation style per feature** — **Option A** (prefixed files) or **Option B** (`lib/`, …). Do not mix both inside the same component folder.
5. **`index.ts` on every folder** — each component folder exports only **its own** component; it does not re-export siblings.
6. **Feature import hub** — `features/{feature}/index.ts` re-exports the **entire** feature (page, sections, subs, shared). **All** imports inside that feature use `from '..'` (resolves to the feature `index.ts`). `app/` uses `@/features/{feature}`.
7. **Shared subcomponents (`_` segment)** — two scopes (see table below). The underscore marks "shared," not a new `NN` on the page.

### Folder naming

| Kind | Folder pattern | Example |
|------|----------------|---------|
| Page | `00.{PageName}/` | `00.CarsPage/` |
| Top-level section (rendered by page) | `{NN}.{ComponentName}/` | `01.Landing/`, `02.Services/` |
| Private child | `{NN}.{Parent}.{Child}/` | `02.CarsFilter.CarsPriceFilter/` |
| Grandchild (private) | `{NN}.{Parent}.{Child}.{Grandchild}/` | `03.CarsGrid._CarCard.CarStructuredData/` |
| **Layout orchestrator child** | `00.{LayoutName}.{Child}/` | `00.AdminLayout.AdminSidebar/` |
| **Feature-wide shared** (2+ top-level sections) | `_{ComponentName}/` | `_CarImagesSlider/` — **no** `{NN}` |
| **Main-scoped shared** (2+ subcomponents of same section) | `{NN}.{Main}._{Shared}/` | `03.CarsGrid._CarCard/` |
| Child of main-scoped shared | `{NN}.{Main}._{Shared}.{Child}/` | `03.CarsGrid._CarCard.CarStructuredData/` |

`{NN}` is always the **top-level section's** index on the page. Subcomponents **do not** get their own sequence number.

**Which shared pattern to use**

| Shared by whom | Folder |
|----------------|--------|
| `03.FleetPreview` + `00.BookingPage` (home + car-rental both use the slider) | Promote to `shared/components/ui/CarImagesSlider/` — or `_CarImagesSlider/` inside `home` until second feature imports via barrel |
| `02.CarsFilter` + `03.CarsGrid` (two subs of CarsPage) | `03.CarsGrid._CarCard/` if both need the same card UI |
| Layout-only chrome (admin shell) | `00.AdminLayout.AdminSidebar/` — **not** `_AdminSidebar/` |
| Single page section owns the component | `02.CarsFilter.CarsPriceFilter/` — **not** `_CarsPriceFilter/` |

All of these stay as **sibling folders on the feature root** — never nest `02.CarsFilter.CarsPriceFilter/` inside `02.CarsFilter/`.

**When to use `_` (strict):** only when **two or more top-level page sections** (`01`–`07`, excluding `00.*` orchestrators) import the same component. Layout-only pieces belong under `00.{LayoutName}.*`. Components used by one section only belong under that section's chain.

### Public API — `index.ts` (feature + component)

**Never** import `ComponentName.tsx` directly. Every component folder has a small `index.ts` that exports **only itself**. The **feature** `index.ts` aggregates every folder in that feature.

#### Component folder `index.ts` (local export only)

```ts
// features/cars/02.CarsFilter.CarsPriceFilter/index.ts
export { CarsPriceFilter } from "./CarsPriceFilter";
```

```ts
// features/cars/00.CarsPage/index.ts
export { default } from "./CarsPage";
export { generateMetadata } from "./CarsPage.helpers"; // Option A
```

#### Feature `index.ts` — single import hub

```ts
// features/cars/index.ts
export { default, generateMetadata } from "./00.CarsPage";
export { CarsFilter } from "./02.CarsFilter";
export { CarsPriceFilter } from "./02.CarsFilter.CarsPriceFilter";
export { CarsGrid } from "./03.CarsGrid";
export { CarCard } from "./03.CarsGrid._CarCard";
export { CarStructuredData } from "./03.CarsGrid._CarCard.CarStructuredData";
```

```ts
// features/home/index.ts
export { default } from "./00.HomePage";
export { Landing } from "./01.Landing";
export { Services } from "./02.Services";
export { FleetPreview } from "./03.FleetPreview";
export { CarImagesSlider } from "./03.FleetPreview.CarImagesSlider";
export { Locations } from "./04.Locations";
export { Testimonials } from "./05.Testimonials";
export { Contact } from "./06.Contact";
```

```ts
// features/admin-bookings/index.ts
export { default } from "./00.BookingsPage";
export { FilterBookings } from "./01.FilterBookings";
export { ActiveFilters } from "./02.ActiveFilters";
export { BookingsTable } from "./03.BookingsTable";
```

### Imports — always `features/{feature}/index.ts`

Every component folder sits **one level** under `features/{feature}/`, so the feature barrel is always one step up:

```ts
import { CarsPriceFilter } from "..";
import { CarCard, CarsGrid } from "..";
```

**`app/` → feature:**

```ts
// app/[locale]/page.tsx
import HomePage from "@/features/home";

export default HomePage;
```

**Page and sections → siblings via feature index:**

```ts
// 00.CarsPage/CarsPage.tsx
import { CarsFilter, CarsGrid } from "..";

// 03.CarsGrid/CarsGrid.tsx
import { CarCard } from "..";

// 02.CarsFilter/CarsFilter.tsx
import { CarsPriceFilter } from "..";
```

**Outside the feature** — use the path alias (same barrel):

```ts
import { CarImagesSlider } from "@/features/home";
// or after promotion:
import { CarImagesSlider } from "@/shared/components/ui/CarImagesSlider";
```

Do **not** import from another component folder path (`../03.CarsGrid`, `../03.CarsGrid._CarCard`) — only `from '..'` inside the feature, or `@/features/{feature}` from outside.

Path alias `@/features/{feature}` must resolve to `features/{feature}/index.ts`.

### Example: `features/home/` (folder tree)

Page order: Landing → Services → FleetPreview → Locations → Testimonials → Contact.

```
features/home/
├── index.ts
├── 00.HomePage/
│   └── index.ts
├── 01.Landing/
│   ├── Landing.tsx
│   ├── Landing.module.css
│   ├── LandingVideo.tsx          ← colocated sub-file OK until promoted to 01.Landing.LandingVideo/
│   └── index.ts
├── 02.Services/
├── 03.FleetPreview/
├── 03.FleetPreview.CarImagesSlider/
├── 04.Locations/
├── 05.Testimonials/
└── 06.Contact/
```

### Example: `features/cars/` (folder tree)

Page order: header (in `00.CarsPage`) → CarsFilter → CarsGrid.

```
features/cars/
├── index.ts
├── 00.CarsPage/
├── 02.CarsFilter/
├── 02.CarsFilter.CarsPriceFilter/
├── 03.CarsGrid/
├── 03.CarsGrid._CarCard/
└── 03.CarsGrid._CarCard.CarStructuredData/
```

### Example: `features/admin-bookings/` (admin page)

Today: `src/app/[locale]/dashboard/admin/bookings/page.tsx` owns fetch/state; components live in `src/components/admin/bookings/`.

```
features/admin-bookings/
├── index.ts
├── 00.BookingsPage/              ← client page: fetch /api/getBookings, filter state
├── 01.FilterBookings/
├── 02.ActiveFilters/
└── 03.BookingsTable/
```

Cross-feature imports (e.g. `SpinLoader` used in bookings, cars, and booking form) use `@/shared/components/ui/SpinLoader` — not a second page orchestrator.

### Example: `features/not-found/` (catch-all 404)

Today: `src/app/[locale]/[...slug]/page.tsx` renders inline 404 UI.

```
features/not-found/
├── index.ts
└── 00.NotFoundPage/
    ├── NotFoundPage.tsx
    ├── NotFoundPage.module.css
    └── index.ts
```

---

### Inside each component folder — Option A (prefixed files)

All supporting files use `ComponentName.<role>.<extension>`. The main component file stays `ComponentName.tsx`. Each folder includes `index.ts`. Static images for a component can live in a **`assets/`** subfolder inside that component folder (only allowed subfolder besides Option B's `lib/`).

```
00.CarsPage/
├── index.ts
├── CarsPage.tsx
├── CarsPage.module.css
├── CarsPage.types.ts
├── CarsPage.helpers.ts            ← generateMetadata
└── CarsPage.fetch.ts              ← optional server fetch for RSC pages
```

```
00.BookingsPage/
├── index.ts
├── BookingsPage.tsx
├── BookingsPage.module.css
├── BookingsPage.types.ts
└── BookingsPage.fetch.ts          ← wraps /api/getBookings client calls or server actions
```

```
03.CarsGrid._CarCard/
├── index.ts
├── CarCard.tsx
├── CarCard.module.css
└── CarCard.types.ts
```

**Option A — common `<role>` segments**

| File pattern | Purpose |
|--------------|---------|
| `ComponentName.tsx` | Component (required) |
| `ComponentName.module.css` | CSS module |
| `ComponentName.types.ts` | Props, view models, form types |
| `ComponentName.helpers.ts` | Pure helpers, metadata builders (no I/O) |
| `ComponentName.mapper.ts` | API/DB rows → UI types |
| `ComponentName.fetch.ts` | Data loading (I/O) |
| `ComponentName.data.ts` | Static lists, enum labels |
| `ComponentName.schemas.ts` | JSON-LD builders (`CarStructuredData`) |
| `ComponentName.context.ts` / `ComponentName.useContext.ts` | Client state |
| `assets/*.{jpg,png,svg}` | Images owned by this component |

This project uses **react-icons** and **Cloudinary URLs** for most imagery; local `assets/` is optional.

---

### Inside each component folder — Option B (role folders)

Keep `ComponentName.tsx`, `index.ts`, and `ComponentName.module.css` at the folder root. Put I/O and logic under `lib/`, shared props/view types in `types.ts`.

```
00.BookingsPage/
├── index.ts
├── BookingsPage.tsx
├── BookingsPage.module.css
├── types.ts
└── lib/
    ├── helpers.ts
    ├── fetch.ts                  ← GET /api/getBookings with filters
    └── mapper.ts                 ← API JSON → BookingFormData[]
```

```
03.CarsGrid/
├── index.ts
├── CarsGrid.tsx
├── CarsGrid.module.css
├── types.ts
└── lib/
    └── fetch.ts                  ← GET /api/getCars, /api/getMaxMinPrice
```

**Option B — `lib/` contents**

| File | Contents |
|------|----------|
| `lib/helpers.ts` | Pure functions, metadata |
| `lib/mapper.ts` | DB/API → UI |
| `lib/fetch.ts` | I/O |
| `lib/data.ts` | Static config |
| `lib/schemas.ts` | JSON-LD |
| `types.ts` | Props, local types, page param aliases for `00.*` folders |

---

### Choosing Option A vs Option B

| | Option A (prefixed files) | Option B (`lib/`) |
|--|---------------------------|-------------------|
| Best for | Smaller components (`Landing`, `CarCard`) | Larger pages (`BookingsPage`, `BookingPage`, `CarsGrid`) |
| Grep / search | Filename shows owner immediately | Role grouped by folder |
| Migration from today | Close to flat `BookingClient.tsx` + CSS beside route | Close to extracting logic from fat admin `page.tsx` files |

**Rule:** one option per **feature** (recommended) or per **component folder**, never both in the same folder.

---

### Visibility (who may import the folder)

| Folder | Who imports |
|--------|-------------|
| `features/{feature}/index.ts` | `app/` via `@/features/{feature}`; **every** file in that feature via `from '..'` |
| Any `features/{feature}/*/` folder | Only `from '..'` (feature `index.ts`), never a sibling folder path |
| Other features / `shared/` | `@/features/{feature}` or `@/shared/...` — not `from '..'` across features |

### Underscore — shared components (two scopes)

Entry file in every case: `ComponentName.tsx` inside the folder (PascalCase, **no** `_` in the TSX filename). Barrel: `index.ts`.

#### A — Feature-wide shared (between top-level sections)

When a private piece is needed by a **second top-level page section** (`01`–`07`), promote to the feature root:

* Folder: `_ComponentName/` (underscore only — **no** `{NN}` or parent name).

**Real cross-feature case today:** `CarImagesSlider` is imported by both `FleetPreview` (home) and `BookingClient` (car-rental). Target: `shared/components/ui/CarImagesSlider/` (skip the `_` stage when the second consumer is another feature).

#### B — Main-scoped shared (between subcomponents of one section)

When a private piece is needed by a **second subcomponent** of the **same** top-level section:

* Folder: `{NN}.{MainComponent}._{SharedName}/`
* Child: `{NN}.{MainComponent}._{SharedName}.{Child}/`

```
features/cars/
├── 02.CarsFilter/
├── 03.CarsGrid/
├── 03.CarsGrid._CarCard/
└── 03.CarsGrid._CarCard.CarStructuredData/
```

### Promotion ladder

**Feature-wide (two top-level sections):**

```
03.CarsGrid.CarCard/
        ↓ second top-level section on same page needs it
03.CarsGrid._CarCard/
        ↓ second feature needs it (BookingPage + FleetPreview)
shared/components/ui/CarImagesSlider/
```

**Main-scoped (two subcomponents of one section):**

```
02.CarsFilter.FilterChip/
03.CarsGrid.ListItem/
        ↓ both need the same card UI
03.CarsGrid._CarCard/
```

### Colocated file types (quick reference)

| Role | Option A | Option B |
|------|----------|----------|
| Component | `CarsPage.tsx` | `CarsPage.tsx` |
| Styles | `CarsPage.module.css` | `CarsPage.module.css` |
| Types | `CarsPage.types.ts` | `types.ts` |
| Pure helpers | `CarsPage.helpers.ts` | `lib/helpers.ts` |
| I/O fetch | `CarsPage.fetch.ts` | `lib/fetch.ts` |
| Local assets | `assets/*.jpg` | `assets/*.jpg` |

**`app/` route segment (thin)**

| File | Purpose |
|------|---------|
| `page.tsx` | Import from `@/features/{feature}` |
| `layout.tsx` | Thin wrapper or `@/features/...` layout orchestrator |
| `types.ts` | Optional: route `params` only |

**Pre-migration → target (examples from this repo)**

| Today | Target (Option A) | Target (Option B) |
|-------|-------------------|-------------------|
| `app/[locale]/page.tsx` + `@/components/home/*` | `features/home/00.HomePage/HomePage.tsx` | same |
| `app/[locale]/cars/page.tsx` + `CarsPage.module.css` | `features/cars/00.CarsPage/CarsPage.tsx` | same |
| `components/cars-page/cars-filter/CarsFilter.tsx` | `features/cars/02.CarsFilter/CarsFilter.tsx` | same |
| `app/[locale]/car-rental/BookingClient.tsx` | `features/car-rental/00.BookingPage/BookingPage.tsx` | `lib/fetch.ts` for `/api/getCars` |
| `app/[locale]/dashboard/admin/bookings/page.tsx` | `features/admin-bookings/00.BookingsPage/BookingsPage.tsx` | `lib/fetch.ts` |
| `components/admin/bookings/BookingsTable.tsx` | `features/admin-bookings/03.BookingsTable/BookingsTable.tsx` | same |
| `components/layout/nav/Nav.tsx` | `shared/components/layout/Nav/Nav.tsx` | same |
| `components/global/spin-loader/SpinLoader.tsx` | `shared/components/ui/SpinLoader/SpinLoader.tsx` | same |
| `utils/types.ts` (BookingFormData, ClientCarMap) | `shared/models/` or stay in `shared/types.ts` | same |

---

## Global styles and static assets

### `globals.css`

Global CSS stays at `src/app/[locale]/globals.css` (imported from root `layout.tsx`). Feature and shared components use **CSS modules** only for scoped styles.

### `public/` and App Router metadata files

| Location | Purpose |
|----------|---------|
| `public/` (or colocated under `app/[locale]/`) | `.jpg`, `.png`, `.mp4`, `.svg`, `.ico` — marketing images, landing video |
| `src/app/[locale]/manifest.json` | PWA manifest |
| `src/app/[locale]/robots.txt` | Robots rules |
| `src/app/[locale]/sitemap.ts` | Sitemap generation (`generateSitemap`) |

Fonts load via `next/font/google` in `layout.tsx` (Inter, Geist Mono) — no separate `src/fonts/` folder.

Remote images use Cloudinary (`next.config.ts` `images.remotePatterns`).

---

## messages/ — split by feature namespace (next-intl)

### Problem

A single `en.json` / `ar.json` becomes unmanageable at scale. Split messages into per-feature files and merge them at request time using next-intl's `getRequestConfig`.

### Folder structure

```
messages/
├── en/
│   ├── common.json         ← Nav, Footer, notFound, shared Admin chrome, SpinLoader
│   ├── meta.json           ← SEO metadata (meta.home, meta.cars, meta.carRental, …)
│   ├── home.json           ← Landing, Services, FleetPreview, …
│   ├── cars.json           ← CarsPage, CarsFilters, CarsGrid
│   ├── about.json
│   ├── contact.json
│   ├── locations.json
│   ├── car-rental.json     ← BookingPage form strings
│   ├── car-rental-confirmation.json
│   ├── staff-login.json
│   └── admin.json          ← Admin.StaffPage, Admin.BookingsPage, Admin.CarsPage, …
├── ar/
│   └── (same files)
└── en.d.json.ts            ← type declarations (generated)
```

### Merging in getRequestConfig

**Today** — one JSON file per locale:

```ts
// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
    };
});
```

**After split** — load `common` + `meta` + the route namespace:

```ts
// src/i18n/request.ts (target)
const featureNamespaces: Record<string, string> = {
    "/": "home",
    "/cars": "cars",
    "/about": "about",
    "/contact": "contact",
    "/locations": "locations",
    "/car-rental": "car-rental",
    "/car-rental/confirmation": "car-rental-confirmation",
    "/staff-login": "staff-login",
    "/dashboard/admin/bookings": "admin",
    "/dashboard/admin/cars": "admin",
    "/dashboard/admin/staff": "admin",
    "/dashboard/admin/messages": "admin",
};
// Resolve pathname; admin routes share admin.json
```

### Key namespace inside each file

Keep the same top-level keys as `messages/en.json` today. Component sections stay PascalCase (`CarsPage`, `CarsFilters`, `Landing`).

```json
// messages/en/cars.json
{
    "CarsPage": {
        "title": "Our Fleets",
        "subtitle": "Browse our complete collection of premium vehicles for every need and budget"
    },
    "CarsFilters": {
        "searchPlaceholder": "Search by model…"
    }
}
```

```json
// messages/en/admin.json (excerpt)
{
    "Admin": {
        "BookingsPage": {
            "title": "Bookings Management",
            "unauthenticated": "You are not authenticated."
        },
        "CarsPage": {
            "title": "Fleet Management",
            "addCar": "Add Car"
        }
    }
}
```

```json
// messages/en/common.json (excerpt)
{
    "Nav": {
        "home": "Home",
        "ourCars": "Our Cars",
        "about": "About",
        "contact": "Contact",
        "locations": "Locations",
        "book": "Book Now"
    },
    "notFound": {
        "title": "Page Not Found",
        "description": "The page you're looking for doesn't exist or has been moved.",
        "home": "Go to Homepage",
        "contact": "Contact Support"
    }
}
```

Usage in components (unchanged keys):

```ts
// features/cars/02.CarsFilter/CarsFilter.tsx
const t = useTranslations("CarsFilters");

// features/not-found/00.NotFoundPage/NotFoundPage.tsx
const t = useTranslations("notFound");

// shared/components/layout/Nav/Nav.tsx
const t = useTranslations("Nav");
```

### Rules

* `common.json` — layout nav, `notFound`, shared UI chrome
* `meta.json` — all `meta.*` SEO strings used in `generateMetadata`
* `admin.json` — entire `Admin` namespace (bookings, cars, staff, messages)
* Both `en/` and `ar/` must always have the same set of files and keys

---

## shared/ — used by 2+ features

`shared/components/` may use **small subfolders** per component. Each component folder colocates the same file kinds:

* `Nav.tsx`, `Nav.module.css`
* Optional `helpers.ts`, `hooks.ts` at component root

```
shared/
├── components/
│   ├── layout/       ← Nav, Footer, LanguageSwitcher
│   ├── ui/           ← SpinLoader, Modal, HomeHeading, NoCarsFound, CarsSkeletonLoading, CarImagesSlider
│   └── admin/        ← AdminSidebar (if not under 00.AdminLayout)
├── hooks/            ← extract from inline useEffect patterns when reused
├── lib/
│   ├── firestore/    ← optional: shared Firestore query helpers (cars, bookings, messages)
│   └── auth/         ← session validation, Firebase Admin helpers
├── helpers/          ← domain-aware pure functions from utils/info.ts, utils/functions.ts
├── utils/            ← generic pure functions: responses.ts
└── models/           ← BookingFormData, ClientCarMap (from utils/types.ts)
```

### lib/ vs helpers/ vs utils/ vs sdk/

| Layer | Purpose | Examples in this repo |
|-------|---------|------------------------|
| **sdk/** | Low-level third-party singletons | `firebase.ts`, `firebaseAdmin.ts`, `cloudinary.ts` |
| **shared/lib/firestore/** | Reusable Firestore read/write helpers | extract from `getCars`, `getBookings`, admin car routes |
| **shared/lib/** | Service wrappers with I/O | session validation, Cloudinary upload orchestration |
| **shared/helpers/** | Domain-aware pure functions | `validateSession`, branch/location helpers from `utils/info.ts` |
| **shared/utils/** | Generic pure functions | `responses.ts`, formatting helpers from `utils/functions.ts` |

**Today:** Firestore access is mostly inline in `app/api/*` routes. **Target:** extract repeated collection queries into `shared/lib/firestore/` when refactoring; keep SDK singletons in `src/sdk/`.

---

## Data layer — Firebase (Firestore)

This project uses **Firebase Firestore** for cars, bookings, staff, and messages. Client auth uses Firebase; admin sessions use JWT cookies validated in `proxy.ts` and API routes.

```
src/sdk/
├── firebase.ts           ← client SDK
├── firebaseAdmin.ts      ← server-side Firestore + Auth
└── cloudinary.ts         ← image uploads (car photos)

Firestore collections (examples):
├── cars
├── bookings
├── messages
└── staff
```

* API `route.ts` handlers call `firestoreAdmin` from `@/sdk/firebaseAdmin`.
* Client components call `/api/*` — never import `firebaseAdmin` in the browser.
* Types for API payloads live in `utils/types.ts` (target: `shared/models/`).

## Middleware — `proxy.ts`

Locale detection, admin auth redirects, and session validation run in `src/proxy.ts` (wired as Next.js middleware). This file stays at `src/proxy.ts` — not inside `features/` or `app/`.

```ts
// src/proxy.ts (excerpt — today)
if (pathname.includes("/dashboard/admin") && !isAuthenticated) {
    const signInUrl = new URL("/staff-login", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
}
```

---

## What NOT to do

* No `_components/` folders inside `app/` page routes
* No **two route pages in one feature** — e.g. do not put `00.BookingPage` and `00.ConfirmationPage` under `features/car-rental/`
* No **nested component folders** — `03.CarsGrid/03.CarsGrid._CarCard/` is wrong; subcomponents are siblings: `03.CarsGrid._CarCard/`
* No loose files on the **feature root** except `index.ts`
* No single-digit order prefixes — use `01`, `02`, not `1`, `2`
* No new `NN` for subcomponents — they inherit the parent section number
* No mixing Option A and Option B **inside the same component folder**
* No `lib/` on the feature root — only inside component folders (Option B)
* No importing a `.tsx` file path — use `from '..'` or `@/features/{feature}`
* No skipping `index.ts` on any component or feature folder
* No `.module.scss` — use `.module.css` to match the existing codebase
* No page-specific strings inside `common.json`
* No importing `firebaseAdmin` in client components — server/API only
