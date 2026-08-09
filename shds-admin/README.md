# SHDS Admin Dashboard

A standalone React + TypeScript + Tailwind + shadcn-style admin dashboard
for managing all dynamic content on the SHDS website. This is a **separate
project** from the public website — it does not touch or import any of
its code, and talks to the Flask backend purely over REST.

## Stack

- **React 19** + **TypeScript**, built with **Vite**
- **Tailwind CSS v4** with a small hand-built shadcn-style UI kit
  (Radix UI primitives under the hood — the shadcn CLI registry wasn't
  reachable in this build environment, so the components were written
  directly instead of generated, but follow the same structure/API)
- **React Router v7** for routing, with a JWT-gated `ProtectedRoute`
- **Zustand** (+ `persist`) for auth state
- **React Hook Form + Zod** for validation
- **Axios** with request/response interceptors for JWT attach + silent
  refresh-on-401
- **Recharts** for the dashboard's donations chart
- **Sonner** for toasts

## Architecture

The core idea: every module (Programs, Projects, Gallery, Partners, ...)
is **CRUD against a REST resource with the same shape**, so instead of
hand-writing 12+ nearly-identical list/create/edit pages, there's one
generic engine and each module is just a config object.

```
src/
├── components/
│   ├── ui/            # hand-built shadcn-style primitives (Button, Dialog, Table, ...)
│   ├── crud/           # the reusable CRUD engine:
│   │   ├── data-table.tsx           # generic table + row actions
│   │   ├── search-bar.tsx           # debounced search input
│   │   ├── pagination-controls.tsx
│   │   ├── resource-form-dialog.tsx # builds a form from FieldConfig[] (+ Zod validation)
│   │   ├── image-upload.tsx         # drag/click image upload -> Media Library
│   │   ├── file-upload.tsx          # same, for documents (PDFs, etc.)
│   │   └── confirm-delete-dialog.tsx
│   └── layout/          # Sidebar, Topbar, AdminLayout
├── config/
│   ├── navigation.ts     # sidebar nav groups/items
│   └── resources/        # ONE FILE PER MODULE -- this is where each
│                          # module's columns, form fields, and validation live
├── hooks/
│   └── use-resource.ts   # generic list/create/update/delete + pagination/search state
├── lib/
│   ├── api.ts              # axios instance, JWT interceptors
│   ├── resource-service.ts # generic REST client factory
│   ├── auth-service.ts, media-service.ts, settings-service.ts
│   └── build-schema.ts     # FieldConfig[] -> Zod schema
├── pages/
│   ├── resources/resource-list-page.tsx  # the generic page every module renders
│   ├── auth/login.tsx
│   ├── dashboard/
│   ├── media-library/     # custom grid UI (not table-based)
│   ├── settings/, seo/    # custom singleton forms
│   └── <module>/index.tsx # one-line wrapper: <ResourceListPage config={...} />
├── routes/
│   ├── protected-route.tsx
│   └── router.tsx
├── store/
│   └── auth-store.ts
└── types/
    ├── api.ts, common.ts, models.ts, resource-config.ts
```

### Adding a new field to an existing module

Edit its file in `src/config/resources/`, e.g. `programs.tsx` -- add an
entry to `columns` (for the table) and/or `fields` (for the form). No
other file needs to change.

### Adding a brand new module

1. Add its TypeScript type to `src/types/models.ts`.
2. Create `src/config/resources/<module>.tsx` (copy an existing one as a
   template -- define `columns` and `fields`).
3. Create `src/pages/<module>/index.tsx`:
   ```tsx
   import { ResourceListPage } from "@/pages/resources/resource-list-page";
   import { myModuleConfig } from "@/config/resources/my-module";

   export default function MyModulePage() {
     return <ResourceListPage config={myModuleConfig} />;
   }
   ```
4. Register the route in `src/routes/router.tsx` and add a nav entry in
   `src/config/navigation.ts`.

That's it -- search, pagination, validation, create/edit dialog, and
delete confirmation all come for free from the shared engine.

## Modules implemented

| Module | Type | Notes |
|---|---|---|
| Login | Custom page | JWT email/password form |
| Dashboard | Custom page | Stat cards, donations chart, recent messages -- degrades gracefully if an endpoint isn't live yet |
| Homepage CMS | Generic CRUD | Editable content blocks keyed by `section_key` |
| About CMS | Generic CRUD | Same pattern, for the About page |
| Programs | Generic CRUD | |
| Projects | Generic CRUD | |
| Gallery | Generic CRUD | Image grid preview column |
| Team Members | Generic CRUD | |
| Partners | Generic CRUD | |
| Reports | Generic CRUD | PDF/document upload via `FileUpload` |
| Contact Messages | Generic CRUD (no create) | Mirrors the existing contact form -> `/inquiries` |
| Volunteers | Generic CRUD (no create) | |
| Donations | Generic CRUD | |
| Website Settings | Custom singleton form | |
| SEO Settings | Custom singleton form | |
| Media Library | Custom grid page | Upload/search/paginate/delete/copy URL |
| User Management | Generic CRUD | Manages `Admin` accounts |

## Backend contract this dashboard expects

It's built against the response envelope your Flask backend already
defines in `app/utils/responses.py`:

```jsonc
// list endpoints: GET /api/v1/<resource>/?page=&per_page=&search=
{ "success": true, "data": [...], "pagination": { "page": 1, "per_page": 10, "total": 0, "pages": 0 } }

// single-item endpoints: GET/POST/PUT /api/v1/<resource>/[:id]
{ "success": true, "data": { } }

// errors
{ "success": false, "message": "...", "errors": {}, "code": "..." }
```

Auth:
- `POST /api/v1/auth/login` `{email, password}` -> `{access_token, refresh_token, user}`
- `POST /api/v1/auth/refresh` `{refresh_token}` -> `{access_token, refresh_token}`
- `GET /api/v1/auth/me` -> current user
- `POST /api/v1/auth/logout`

Media:
- `POST /api/v1/media/upload` (multipart, field `file`) -> `MediaFile`
- `GET /api/v1/media/?page=&per_page=&search=` -> paginated `MediaFile[]`
- `DELETE /api/v1/media/:id`

**Endpoints this dashboard calls that don't exist in the current backend
yet** (the backend so far only has models + stubs for `auth` and
`inquiries`) -- these need routes implemented to match the `Program`,
`Project`, `Gallery`, `Partner`, `Report`, `Donation` models already
created, plus **new** models/routes for:
- `/team-members`
- `/volunteers`
- `/cms/homepage`, `/cms/about` (a `ContentBlock`-style table)
- `/media` (a `MediaFile` table + file storage)
- `/settings/website`, `/settings/seo` (singleton rows)
- `/users` (CRUD over the existing `Admin` model)

Until those exist, the corresponding dashboard pages will show empty
states / loading errors rather than data -- the UI won't crash, it just
has nothing to show yet.

## Local setup

```bash
npm install
cp .env.example .env      # set VITE_API_BASE_URL to your Flask backend
npm run dev                # http://localhost:5174
```

## Build

```bash
npm run build      # type-checks with tsc -b, then builds to dist/
npm run preview     # preview the production build locally
```
