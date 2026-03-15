const TOKEN_KEY = 'hotel_token';
const USER_KEY = 'hotel_user';
const BRANCH_KEY = 'hotel_branch';
const BRANCHES_KEY = 'hotel_branches';

export const saveSession = (token, user, branches = []) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
  if (branches.length === 1) {
    localStorage.setItem(BRANCH_KEY, branches[0].branchId || branches[0]._id);
  }
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(BRANCH_KEY);
  localStorage.removeItem(BRANCHES_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

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
