export const PERMISSION_GROUPS = [
  {
    title: 'General',
    items: [
      { key: 'dashboard:view', label: 'View Dashboard' },
      { key: 'orders:view', label: 'View Order' },
      { key: 'orders:edit', label: 'Edit Order' },
      { key: 'orders:checkout:view', label: 'View Order Checkout' },
      { key: 'orders:checkout:edit', label: 'Edit Order Checkout' },
      { key: 'tables:view', label: 'View Table and Space' },
      { key: 'tables:edit', label: 'Edit Table and Space' },
      { key: 'menu:view', label: 'View Menu' },
      { key: 'menu:edit', label: 'Edit Menu' },
      { key: 'inventory:view', label: 'View Inventory' },
      { key: 'inventory:edit', label: 'Edit Inventory' },
      { key: 'reports:view', label: 'View Reports' },
      { key: 'notifications:view', label: 'View Notifications' },
      { key: 'notifications:edit', label: 'Edit Notifications' },
      { key: 'website:view', label: 'View Website' },
      { key: 'website:edit', label: 'Edit Website' },
      { key: 'staff:view', label: 'View Staff' },
      { key: 'staff:edit', label: 'Edit Staff' },
      { key: 'customers:view', label: 'View Customer' },
      { key: 'customers:edit', label: 'Edit Customer' },
      { key: 'suppliers:view', label: 'View Suppliers' },
      { key: 'suppliers:edit', label: 'Edit Suppliers' },
      { key: 'restaurant:group:view', label: 'View Restaurant Group' },
      { key: 'restaurant:group:edit', label: 'Edit Restaurant Group' },
      { key: 'settings:view', label: 'View Settings' },
      { key: 'settings:edit', label: 'Edit Settings' },
      { key: 'roles:manage', label: 'Manage Roles' },
      { key: 'billing:view', label: 'View Billing' },
      { key: 'billing:edit', label: 'Edit Billing' }
    ]
  },
  {
    title: 'Order Settings',
    items: [
      { key: 'settings:invoice', label: 'Invoice Setting' },
      { key: 'settings:kot', label: 'KOT Setting' },
      { key: 'settings:printer', label: 'Printer Setting' }
    ]
  },
  {
    title: 'Reports',
    items: [
      { key: 'reports:company', label: 'Company Report' },
      { key: 'reports:waiter', label: 'Waiter Report' },
      { key: 'reports:kitchen', label: 'Kitchen Report' },
      { key: 'reports:stock', label: 'Stock Report' }
    ]
  },
  {
    title: 'Misc',
    items: [
      { key: 'support:view', label: 'Support & Feedback' },
      { key: 'release:view', label: 'Release Notes' }
    ]
  }
];

export const DEFAULT_ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'waiter', label: 'Waiter' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'billing', label: 'Billing' },
  { value: 'superadmin', label: 'SuperAdmin' }
];
