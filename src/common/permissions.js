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
      { key: 'menu:dishes:view', label: 'View Menu Dishes' },
      { key: 'menu:categories:view', label: 'View Menu Categories' },
      { key: 'menu:addons:view', label: 'View Menu Add-ons' },
      { key: 'menu:submenus:view', label: 'View Menu SubMenus' },
      { key: 'menu:combos:view', label: 'View Menu Combos' },
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
      { key: 'reports:view', label: 'View Reports Dashboard' },
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

export const WAITER_ALLOWED_PERMISSIONS = [
  'dashboard:view',
  'orders:view',
  'orders:edit',
  'orders:checkout:view',
  'orders:checkout:edit',
  'tables:view',
  'tables:edit',
  'menu:view',
  'menu:dishes:view',
  'menu:categories:view',
  'menu:addons:view',
  'menu:submenus:view',
  'menu:combos:view',
  'notifications:view',
  'customers:view',
  'customers:edit',
  'billing:view'
];

export const DEFAULT_ROLE_PERMISSIONS = {
  admin: ['*'],
  superadmin: ['*'],
  manager: [
    'dashboard:view',
    'orders:view',
    'orders:edit',
    'orders:checkout:view',
    'orders:checkout:edit',
    'tables:view',
    'tables:edit',
    'menu:view',
    'menu:edit',
    'menu:dishes:view',
    'menu:categories:view',
    'menu:addons:view',
    'menu:submenus:view',
    'menu:combos:view',
    'inventory:view',
    'inventory:edit',
    'reports:view',
    'reports:company',
    'reports:waiter',
    'reports:kitchen',
    'reports:stock',
    'notifications:view',
    'website:view',
    'website:edit',
    'staff:view',
    'staff:edit',
    'customers:view',
    'customers:edit',
    'suppliers:view',
    'suppliers:edit',
    'settings:view',
    'settings:edit',
    'settings:invoice',
    'settings:kot',
    'settings:printer',
    'roles:manage',
    'billing:view'
  ],
  waiter: WAITER_ALLOWED_PERMISSIONS,
  kitchen: [
    'dashboard:view',
    'orders:view',
    'orders:edit',
    'menu:view',
    'menu:dishes:view',
    'notifications:view'
  ],
  billing: [
    'dashboard:view',
    'orders:view',
    'orders:checkout:view',
    'orders:checkout:edit',
    'reports:view',
    'reports:company',
    'billing:view'
  ]
};

export const DEFAULT_ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'waiter', label: 'Waiter' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'billing', label: 'Billing' },
  { value: 'superadmin', label: 'SuperAdmin' }
];
