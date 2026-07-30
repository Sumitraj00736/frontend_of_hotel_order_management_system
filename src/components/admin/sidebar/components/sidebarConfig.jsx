/**
 * sidebar/components/sidebarConfig.jsx
 * Shared icon maps and nav configuration — no React rendering, just data.
 */
import React from 'react';
import {
  Home, ListChecks, Users, Table as TableIcon, BookOpen, Boxes,
  BarChart, History, Settings, UserRound, Globe, Wallet, Bell,
  UtensilsCrossed, Layers, PlusSquare, Grid3x3, Package2,
  Wheat, Soup, PackageSearch, BarChart3, Layers2, ChefHat,
  ArrowUpDown, Book, FileText, ShoppingCart, Coins, TrendingDown,
  CreditCard, Landmark, Percent, ClipboardList, Network, HelpCircle,
  Clock, ScrollText, Printer, ShieldAlert,
} from 'lucide-react';

export const MOBILE_BREAKPOINT = 900;

export const coreSections = [
  'dashboard', 'orders', 'users', 'customers', 'website', 'notifications',
];

export const iconMap = {
  dashboard:     <Home size={16} strokeWidth={2} />,
  orders:        <ListChecks size={16} strokeWidth={2} />,
  users:         <Users size={16} strokeWidth={2} />,
  tables:        <TableIcon size={16} strokeWidth={2} />,
  menus:         <BookOpen size={16} strokeWidth={2} />,
  inventory:     <Boxes size={16} strokeWidth={2} />,
  website:       <Globe size={16} strokeWidth={2} />,
  reports:       <BarChart size={16} strokeWidth={2} />,
  history:       <History size={16} strokeWidth={2} />,
  settings:      <Settings size={16} strokeWidth={2} />,
  notifications: <Bell size={16} strokeWidth={2} />,
  customers:     <UserRound size={16} strokeWidth={2} />,
  finance:       <Wallet size={16} strokeWidth={2} />,
};

/** Nav groups config for expandable sections */
export const navGroups = {
  tables: {
    icon: <TableIcon size={16} strokeWidth={2} />,
    label: 'Table & Space',
    access: 'tables:table',
    prefix: 'tables',
    links: [
      { id: 'tables:table', label: 'Table',    icon: <TableIcon size={13} />, access: 'tables:table' },
      { id: 'tables:space', label: 'Space',    icon: <Layers size={13} />,    access: 'tables:space' },
      { id: 'tables:qr',    label: 'QR Codes', icon: <Grid3x3 size={13} />,  access: 'tables:qr' },
    ],
  },
  menu: {
    icon: <BookOpen size={16} strokeWidth={2} />,
    label: 'Menu',
    access: 'menus',
    prefix: 'menu',
    links: [
      { id: 'menu:dishes',     label: 'Dishes',         icon: <UtensilsCrossed size={13} />, access: 'menu:dishes' },
      { id: 'menu:categories', label: 'Category',       icon: <Layers size={13} />,          access: 'menu:categories' },
      { id: 'menu:addons',     label: 'Ad-Ons & Extras',icon: <PlusSquare size={13} />,      access: 'menu:addons' },
      { id: 'menu:submenus',   label: 'Sub Menu',       icon: <Grid3x3 size={13} />,         access: 'menu:submenus' },
      { id: 'menu:combos',     label: 'Combo Offer',    icon: <Package2 size={13} />,        access: 'menu:combos' },
    ],
  },
  inventory: {
    icon: <Boxes size={16} strokeWidth={2} />,
    label: 'Inventory',
    access: 'inventory:ingredients',
    prefix: 'inventory',
    links: [
      { id: 'inventory:ingredients',  label: 'Ingredients',        icon: <Wheat size={13} />,       access: 'inventory:ingredients' },
      { id: 'inventory:recipes',       label: 'Recipes',            icon: <Soup size={13} />,         access: 'inventory:recipes' },
      { id: 'inventory:transactions',  label: 'Stock Transactions', icon: <PackageSearch size={13} />,access: 'inventory:transactions' },
      { id: 'inventory:suppliers',     label: 'Suppliers',          icon: <Users size={13} />,        access: 'inventory:suppliers' },
    ],
  },
  reports: {
    icon: <BarChart size={16} strokeWidth={2} />,
    label: 'Reports',
    access: 'reports:company',
    prefix: 'reports',
    links: [
      { id: 'reports:company', label: 'Company', icon: <BarChart3 size={13} />, access: 'reports:company' },
      { id: 'reports:waiter',  label: 'Waiter',  icon: <Layers2 size={13} />,   access: 'reports:waiter' },
      { id: 'reports:kitchen', label: 'Kitchen', icon: <ChefHat size={13} />,   access: 'reports:kitchen' },
      { id: 'reports:stock',   label: 'Stock',   icon: <Boxes size={13} />,     access: 'reports:stock' },
    ],
  },
};

/** Finance sub-navigation configuration */
export const financeNavItems = [
  { id: 'dashboard',    label: 'Dashboard',       icon: <Home size={15} /> },
  { id: 'transactions', label: 'Transactions',     icon: <ArrowUpDown size={15} /> },
  { id: 'daybook',      label: 'Day Book',         icon: <Book size={15} /> },
  { id: 'sales',        label: 'Sales',          icon: <FileText size={15} />, sub: 'invoices' },
  { id: 'purchase',     label: 'Purchase',         icon: <ShoppingCart size={15} />, sub: 'bills' },
  { id: 'income',       label: 'Income',           icon: <Coins size={15} /> },
  { id: 'expenses',     label: 'Expenses',         icon: <TrendingDown size={15} /> },
  { id: 'payments',     label: 'Payments',         icon: <CreditCard size={15} /> },
  { id: 'cashbanks',    label: 'Cash & Banks',     icon: <Landmark size={15} /> },
  { id: 'reports',      label: 'Reports',          icon: <BarChart3 size={15} /> },
];

/** Settings sub-navigation sections configuration */
export const settingsNavGroups = [
  {
    title: 'General Setting',
    items: [
      { id: 'restaurant-details', label: 'Restaurant Details', icon: <Landmark size={13} /> },
      { id: 'tax-rates',          label: 'Tax & Rates',         icon: <Percent size={13} /> },
      { id: 'notifications',      label: 'Notifications',      icon: <Bell size={13} /> },
      { id: 'branches',           label: 'Branches',           icon: <Network size={13} /> },
      { id: 'activity-log',       label: 'Activity Log',       icon: <Clock size={13} /> },
      { id: 'department',         label: 'Department',         icon: <Layers size={13} /> },
      { id: 'billing',            label: 'Billing & Sub',      icon: <CreditCard size={13} /> },
      { id: 'users-role',         label: 'Users Role',         icon: <Users size={13} /> },
      { id: 'trash',              label: 'Trash',              icon: <ShieldAlert size={13} /> }
    ]
  },
  {
    title: 'Order Setting',
    items: [
      { id: 'invoice-setting',    label: 'Invoice Setting',    icon: <ScrollText size={13} /> },
      { id: 'kot-setting',        label: 'KOT Setting',        icon: <ClipboardList size={13} /> },
      { id: 'printer',            label: 'Printer',            icon: <Printer size={13} /> }
    ]
  },
  {
    title: 'MeroRestro Setting',
    items: [
      { id: 'support',            label: 'Support & Feedback', icon: <HelpCircle size={13} /> },
      { id: 'release',            label: 'Release Notes',      icon: <FileText size={13} /> }
    ]
  }
];
