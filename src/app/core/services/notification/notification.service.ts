import { Injectable } from '@angular/core';

export interface NotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  sound?: string;
  vibrate?: number[];
  actions?: NotificationAction[];
  timestamp?: number;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultOptions: NotificationOptions = {
    icon: '/assets/icons/notification-icon.png',
    badge: '/assets/icons/notification-badge.png',
    requireInteraction: false,
    silent: false
  };

  constructor() {
    this.checkPermission();
  }

  private checkPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  showNotification(title: string, options: NotificationOptions = {}): void {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      this.createNotification(title, options);
    } else if (Notification.permission !== 'denied') {
      this.requestPermission().then(granted => {
        if (granted) {
          this.createNotification(title, options);
        }
      });
    }
  }

  private createNotification(title: string, options: NotificationOptions): void {
    const notificationOptions = { ...this.defaultOptions, ...options };
    const notification = new Notification(title, notificationOptions);

    if (notificationOptions.requireInteraction === false) {
      setTimeout(() => notification.close(), 5000); // Auto close after 5 seconds
    }

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.data?.onClick) {
        options.data.onClick();
      }
    };
  }
}