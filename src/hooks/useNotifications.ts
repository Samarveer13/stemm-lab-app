import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import {
  requestNotificationPermissions,
  getExpoPushToken,
  setupAndroidChannel,
  scheduleLocalNotification,
} from '../services/notificationService';

export function useNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [lastNotification, setLastNotification] = useState<Notifications.Notification | null>(null);

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    (async () => {
      await setupAndroidChannel();
      const granted = await requestNotificationPermissions();
      setPermissionGranted(granted);
      if (granted) {
        const t = await getExpoPushToken();
        setToken(t);
        await scheduleLocalNotification('Welcome to STEMM Lab!', 'Great to have you back.', 3);
      }
    })();

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setLastNotification(notification);
      },
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(
          '[Notifications] User tapped notification:',
          response.notification.request.content,
        );
      },
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { token, permissionGranted, lastNotification };
}
