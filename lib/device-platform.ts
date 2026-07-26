export type DevicePlatform = 'android' | 'ios' | 'other';

export interface DeviceNavigator {
  userAgent?: string;
  platform?: string;
  maxTouchPoints?: number;
  userAgentData?: {
    platform?: string;
  };
}

export function detectDevicePlatform(device: DeviceNavigator): DevicePlatform {
  const userAgent = device.userAgent ?? '';
  const platform = device.userAgentData?.platform ?? device.platform ?? '';

  if (platform === 'Android' || /Android/i.test(userAgent)) {
    return 'android';
  }

  if (
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (platform === 'MacIntel' && (device.maxTouchPoints ?? 0) > 1)
  ) {
    return 'ios';
  }

  return 'other';
}
