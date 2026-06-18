export function hasPermission(user, permission) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.permissions && user.permissions.includes(permission);
}

export function canEdit(user, resource) {
  if (!user || !resource) return false;
  if (user.role === 'admin') return true;
  return resource.userId === user._id;
}

export function canDelete(user, resource) {
  return canEdit(user, resource);
}

export function sanitizeUserData(user) {
  if (!user) return null;
  const { password, resetPasswordToken, resetPasswordExpire, __v, ...safe } = user;
  return safe;
}
