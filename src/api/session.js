const TOKEN_KEY = 'hotel_token';
const USER_KEY = 'hotel_user';
const BRANCH_KEY = 'hotel_branch';
const BRANCHES_KEY = 'hotel_branches';
const PROVIDER_KEY = 'hotel_auth_provider'; // 'backend' | 'firebase'

export const saveSession = (token, user, branches = [], provider = 'backend') => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
  localStorage.setItem(PROVIDER_KEY, provider);
  if (branches.length > 0) {
    localStorage.setItem(BRANCH_KEY, branches[0].branchId || branches[0]._id);
  }
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(BRANCH_KEY);
  localStorage.removeItem(BRANCHES_KEY);
  localStorage.removeItem(PROVIDER_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getAuthProvider = () => localStorage.getItem(PROVIDER_KEY) || 'backend';

export const getCurrentUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const getBranchId = () => localStorage.getItem(BRANCH_KEY);
export const setBranchId = (id) => localStorage.setItem(BRANCH_KEY, id);
export const getBranches = () => {
  const raw = localStorage.getItem(BRANCHES_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const updateBranchName = (branchId, branchName) => {
  if (!branchId || !branchName) return;
  const branches = getBranches();
  const updated = branches.map((b) => {
    const id = b.branchId || b._id;
    if (id === branchId) {
      return { ...b, branchName, name: branchName };
    }
    return b;
  });
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(updated));
};

export const getBranchPermissions = () => {
  const branches = getBranches();
  const branchId = getBranchId();
  const active = branches.find((b) => (b.branchId || b._id) === branchId) || branches[0];
  return active?.permissions || [];
};

export const getBranchRole = () => {
  const branches = getBranches();
  const branchId = getBranchId();
  const active = branches.find((b) => (b.branchId || b._id) === branchId) || branches[0];
  return active?.role || active?.roleName || '';
};

export const hasPermission = (permission) => {
  const user = getCurrentUser();
  if (!permission) return true;
  const perms = getBranchPermissions();
  if (perms.includes('*')) return true;
  if (user?.role && ['admin', 'superadmin'].includes(user.role.toLowerCase())) return true;
  return perms.map((p) => p.toLowerCase()).includes(permission.toLowerCase());
};
