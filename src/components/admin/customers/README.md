# Customers Section — Component Documentation

## Overview
The `customers/` section handles all **customer account management** for the admin panel.  
It allows administrators to create, edit, search customers and configure loyalty reward settings.

## Folder Structure
```
customers/
├── header/
│   └── CustomerHeader.jsx       # Sticky page header (Title + Search + Add + Menu button)
│                                # Composed from: CustomerHeaderTitle, CustomerSearch,
│                                #                CustomerAddButton, CustomerMenuButton
├── reusable/
│   ├── CustomerAvatar.jsx        # Color-coded initials avatar
│   ├── DueBadge.jsx              # Due amount badge (red = has due, green = clear)
│   ├── LoyaltyBadge.jsx          # Loyalty discount % chip
│   └── FormField.jsx             # Label wrapper + shared inputClass / selectClass exports
├── table/
│   └── CustomerTable.jsx         # Grid table with head, rows, and empty state
│                                 # (CustomerRow and CustomerTableHead are sub-components inside)
├── modals/
│   ├── CustomerModal.jsx         # Add/Edit customer form (sectioned, collapsible extra fields)
│   └── RewardsModal.jsx          # Loyalty reward points configuration
├── CustomerKpiGrid.jsx           # 3-card KPI row (To Receive / To Pay / Net Amount)
└── AdminCustomers.jsx            # Root entry — wires all components together
```

## Root Props (`AdminCustomers`)
| Prop | Type | Description |
|------|------|-------------|
| `customers` | `Array` | Full list of customer objects from API |
| `form` | `Object` | Controlled form state for add/edit modal |
| `setForm` | `Function` | Setter for form |
| `rewards` | `Object` | Loyalty reward config `{ salesAmount, rewardPoints }` |
| `setRewards` | `Function` | Setter for rewards |
| `onCreateCustomer` | `async Function` | Called when a new customer is submitted |
| `onUpdateCustomer` | `async Function(id, payload)` | Called when an existing customer is saved |
| `onSaveRewards` | `async Function` | Called when rewards settings are saved |

## Design Rules
> **No custom CSS allowed.** All styling must use Tailwind utility classes only.

- Accent color: `orange-500` (`#f97316`)
- Background: `slate-50/60`
- Cards: `bg-white rounded-2xl border border-slate-100 shadow-sm`
- Header: **sticky** (`sticky top-0 z-30`)
- Rewards accent: `amber-500`

## Reusable Components
- `CustomerAvatar` — pass `name` and optional `size="sm | md | lg"`
- `DueBadge` — pass `amount` (number); auto-detects green vs red
- `LoyaltyBadge` — pass `discount` percentage number
- `FormField` + `inputClass` / `selectClass` — import from `reusable/FormField.jsx`

## Key UI Behaviors
- **Sticky header** — always visible while scrolling through long customer lists
- **Hover-reveal edit button** — edit icon appears on row hover, keeps table clean
- **Dr/Cr toggle** — styled toggle buttons instead of a dropdown for opening balance type
- **Collapsible extra fields** — legal name, tax number, credit limit hidden by default
- **Floating options menu** — appears below the `⋯` button, closes on outside click
