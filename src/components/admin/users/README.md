# Users Section — Component Documentation

## Overview
The `users/` section handles all **staff management** for the admin panel.  
It allows administrators to invite, edit, filter, and manage staff accounts and their access levels.

## Folder Structure
```
users/
├── header/
│   └── UserHeader.jsx        # Sticky page header (Title + Search + Invite button)
├── reusable/
│   ├── UserAvatar.jsx         # Color-coded avatar (photo or initials fallback)
│   ├── UserStatusBadge.jsx    # Animated status pill (active / pending / inactive)
│   ├── RoleBadge.jsx          # Color-coded role chip (admin / waiter / kitchen…)
│   └── FormField.jsx          # Label wrapper + shared input/select class exports
├── table/
│   ├── UserTable.jsx          # Table card with column header + empty state
│   └── UserRow.jsx            # Single staff row with hover-reveal action menu
├── modals/
│   ├── UserInviteModal.jsx    # Create new staff account
│   └── UserEditModal.jsx      # Edit existing staff profile (avatar shown in header)
├── UserTabs.jsx               # Tab bar: Active / Pending / Inactive with counts
└── AdminUsers.jsx             # Root entry — wires all components together
```

## Root Props (`AdminUsers`)
| Prop | Type | Description |
|------|------|-------------|
| `users` | `Array` | Full list of staff objects from the API |
| `roles` | `Array` | Available role options `[{ value, label }]` |
| `userForm` | `Object` | Controlled form state for invite modal |
| `setUserForm` | `Function` | Setter for userForm |
| `onCreateUser` | `async Function` | Called when invite modal is submitted |
| `onEditUser` | `async Function(user, payload)` | Called when edit modal is saved |
| `onSetStatus` | `Function(id, status)` | Quick-status change from action menu |
| `onDeleteUser` | `Function(user)` | Remove staff action |
| `canEdit` | `Boolean` | Hides destructive actions when `false` |

## Design Rules
> **No custom CSS allowed.** All styling must use Tailwind utility classes only.

- Accent color: `orange-500` (`#f97316`)
- Background: `slate-50/60`
- Cards: `bg-white rounded-2xl border border-slate-100 shadow-sm`
- Header: **sticky** (`sticky top-0 z-30`)

## Reusable Components
- `UserAvatar` — use `size="sm | md | lg"` prop
- `UserStatusBadge` — pass `status="active | pending | inactive"`
- `RoleBadge` — pass `role="admin | waiter | kitchen | manager"`
- `FormField` + `inputClass` / `selectClass` — import from `reusable/FormField.jsx`
