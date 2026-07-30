# Notifications Section — Component Documentation

## Overview
The `notifications/` section displays real-time in-app notifications grouped by day.  
It supports **Order** and **Activity** tabs, rich filter controls, and **push notification** management (FCM/Web Push).

## Folder Structure
```
notifications/
├── header/
│   └── NotificationHeader.jsx     # Sticky header — Title, PushToggle, TestPush, Filter, MarkAll
│                                  # Sub-components: NotificationHeaderTitle, MarkAllReadButton,
│                                  #                 TestPushButton, FilterToggleButton
├── reusable/
│   ├── NotificationItem.jsx        # Single notification row (icon, body, timestamp, KOT link)
│   ├── NotificationGroup.jsx       # Day-grouped card (label + divider + items)
│   └── PushToggle.jsx              # Animated pill toggle for push enable/disable
├── filters/
│   └── NotificationFilters.jsx     # Filter chip bar + date/type/freetext popover
├── NotificationTabs.jsx            # Tab bar: Order / Activity (with underline active)
└── NotificationPage.jsx            # Root entry — wires all components, handles push state
```

## Root Props (`NotificationPage`)
| Prop | Type | Description |
|------|------|-------------|
| `notifications` | `Array` | List of notification objects from API |
| `onMarkAll` | `Function` | Called when "Mark all read" is clicked |
| `filters` | `Object` | Current active filter values |
| `onFilterChange` | `Function(partialFilters)` | Merges partial filters into existing state |

## Notification Object Shape
```js
{
  _id: string,
  title: string,
  type: string,        // e.g. "order paid", "staff invited"
  message: string,
  createdAt: string,   // ISO date string
}
```

## Design Rules
> **No custom CSS allowed.** All styling must use Tailwind utility classes only.

- Accent color: `orange-500` (`#f97316`)
- Background: `slate-50/60`
- Cards: `bg-white rounded-2xl border border-slate-100 shadow-sm`
- Header: **sticky** (`sticky top-0 z-30`)

## Key UI Behaviors
- **Audio ping** — plays a subtle sine tone when a new notification arrives
- **Push toggle** — auto-syncs FCM token on mount; re-subscribes if stale
- **Error banner** — shown inline below header, styled as rose alert
- **Filter chips** — date range, type, and freetext fields for activity log
- **Day grouping** — items grouped with a divider label (Today / Yesterday / full date)
- **KOT link** — shown only on Order tab items
- **Icon colors** — auto-mapped by notification type (orange=order, emerald=paid, rose=cancelled, blue=activity)
