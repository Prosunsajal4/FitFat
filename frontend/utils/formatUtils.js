export function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatWeight(kg) {
  return formatNumber(kg, 1);
}

export function formatVolume(vol) {
  if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
  return formatNumber(vol);
}

export function formatCalories(cal) {
  return formatNumber(Math.round(cal));
}

export function formatMacro(grams) {
  return `${formatNumber(grams)}g`;
}

export function formatPercentage(val, total) {
  if (!total || total === 0) return '0%';
  return `${Math.round((val / total) * 100)}%`;
}

export function abbreviateNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}