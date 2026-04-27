export const ADMIN_SECTION_RULES = {
  dashboard: { permissions: ['dashboard:view'] },
  orders: { permissions: ['orders:view'] },
  users: { permissions: ['staff:view'] },
  customers: { permissions: ['customers:view'] },
  website: { permissions: ['website:view'] },
  notifications: { permissions: ['notifications:view'] },
  history: { permissions: ['reports:view'] },
  promotions: { permissions: ['staff:view'] },

  tables: { permissions: ['tables:view'] },
  'tables:table': { permissions: ['tables:view'] },
  'tables:space': { permissions: ['tables:view'] },
  'tables:qr': { permissions: ['tables:view'] },

  menus: { permissions: ['menu:view'] },
  'menu:dishes': { permissions: ['menu:dishes:view', 'menu:view'] },
  'menu:categories': { permissions: ['menu:categories:view'] },
  'menu:addons': { permissions: ['menu:addons:view'] },
  'menu:submenus': { permissions: ['menu:submenus:view'] },
  'menu:combos': { permissions: ['menu:combos:view'] },

  inventory: { permissions: ['inventory:view'] },
  'inventory:ingredients': { permissions: ['inventory:view'] },
  'inventory:recipes': { permissions: ['inventory:view'] },
  'inventory:transactions': { permissions: ['inventory:view'] },
  'inventory:suppliers': { permissions: ['suppliers:view'] },
  'inventory:purchases': { permissions: ['inventory:view'] },

  finance: { permissions: ['billing:view'] },
  'finance:dashboard': { permissions: ['billing:view'] },
  'finance:daybook': { permissions: ['billing:view'] },
  'finance:sales': { permissions: ['billing:view'] },
  'finance:purchase': { permissions: ['billing:view'] },
  'finance:transactions': { permissions: ['billing:view'] },

  reports: { permissions: ['reports:view'] },
  'reports:company': { permissions: ['reports:company', 'reports:view'] },
  'reports:sales': { permissions: ['reports:view'] },
  'reports:items': { permissions: ['reports:view'] },
  'reports:staff': { permissions: ['reports:waiter', 'reports:kitchen', 'reports:view'] },
  'reports:customer': { permissions: ['reports:view'] },
  'reports:waiter': { permissions: ['reports:waiter', 'reports:view'] },
  'reports:kitchen': { permissions: ['reports:kitchen', 'reports:view'] },
  'reports:stock': { permissions: ['reports:stock', 'reports:view'] },

  settings: { permissions: ['settings:view'], superadminOnly: true },
  'settings:restaurant-details': { permissions: ['settings:view'], superadminOnly: true },
  'settings:branches': { permissions: ['settings:view'], superadminOnly: true },
  'settings:roles': { permissions: ['roles:manage'], superadminOnly: true },
  'settings:permissions': { permissions: ['roles:manage'], superadminOnly: true },
  'settings:taxes': { permissions: ['settings:view'], superadminOnly: true },
  'settings:payment-methods': { permissions: ['settings:view'], superadminOnly: true },
  'settings:printers': { permissions: ['settings:printer', 'settings:view'], superadminOnly: true },
  'settings:webhooks': { permissions: ['settings:view'], superadminOnly: true }
};

export const ADMIN_SECTION_PRIORITY = [
  'dashboard',
  'orders',
  'notifications',
  'menu:dishes',
  'customers',
  'tables:table',
  'inventory:ingredients',
  'finance:dashboard',
  'reports:company',
  'website',
  'history',
  'settings:restaurant-details'
];

export const canAccessSection = (section, canPermission, { isSuperAdmin = false } = {}) => {
  if (!section) return false;

  const rule =
    ADMIN_SECTION_RULES[section] ||
    ADMIN_SECTION_RULES[section.split(':')[0]] ||
    null;

  if (!rule) return true;
  if (rule.superadminOnly && !isSuperAdmin) return false;

  const permissions = Array.isArray(rule.permissions) ? rule.permissions : [];
  if (!permissions.length) return true;

  return permissions.some((permission) => canPermission(permission));
};

export const findFirstAccessibleSection = (
  sections,
  canPermission,
  { isSuperAdmin = false } = {}
) =>
  (sections || []).find((section) =>
    canAccessSection(section, canPermission, { isSuperAdmin })
  ) || null;
