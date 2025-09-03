// src/hooks/useNotifications.ts
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/api/axios";
import {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  fetchNotificationStart,
  fetchNotificationSuccess,
  fetchNotificationFailure,
  deleteNotificationStart,
  deleteNotificationSuccess,
  deleteNotificationFailure,
} from "@/store/slices/notificationsSlice";
import type { RootState } from "@/store";

export interface Notification {
  id: string;
  produitId: string;
  type: "OUT_OF_STOCK" | "LOW_STOCK" | "OTHER";
  message: string;
  createdAt: string;
  resolved: boolean;
}

export interface NotificationsResponse {
  items: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Interface pour la réponse réelle de l'API
interface ApiNotificationsResponse {
  data: Notification[];
}

const NOTIFICATIONS_READ_KEY = "read_notifications";

export default function useNotifications() {
  const dispatch = useDispatch();
  const { notifications, currentNotification, loading, error, deleting } =
    useSelector((state: RootState) => state.notifications);

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Récupérer les IDs des notifications lues
  const getReadNotifications = (): string[] => {
    try {
      const read = localStorage.getItem(NOTIFICATIONS_READ_KEY);
      return read ? JSON.parse(read) : [];
    } catch {
      return [];
    }
  };

  // Marquer une notification comme lue
  const markAsRead = (id: string): void => {
    try {
      const readNotifications = getReadNotifications();
      if (!readNotifications.includes(id)) {
        const updated = [...readNotifications, id];
        localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(updated));
        // Mettre à jour le compteur
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = (): void => {
    try {
      if (notifications.items && notifications.items.length > 0) {
        const currentNotificationIds = notifications.items.map(
          (notif) => notif.id
        );
        localStorage.setItem(
          NOTIFICATIONS_READ_KEY,
          JSON.stringify(currentNotificationIds)
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error(
        "Erreur lors du marquage de toutes les notifications:",
        error
      );
    }
  };

  // Vérifier si une notification est lue
  const isNotificationRead = (id: string): boolean => {
    return getReadNotifications().includes(id);
  };

  // Récupérer toutes les notifications
  const fetchNotifications = async () => {
    try {
      dispatch(fetchNotificationsStart());
      setLocalLoading(true);
      setLocalError(null);

      const token = localStorage.getItem("accessToken");
      const response = await api.get<ApiNotificationsResponse>(
        `/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Adapter la réponse à la structure attendue par le slice
      const adaptedResponse: NotificationsResponse = {
        items: response.data.data || [], // Prendre le tableau depuis data
        meta: {
          total: response.data.data?.length || 0,
          page: 1,
          limit: response.data.data?.length || 0,
          totalPages: 1,
        },
      };

      dispatch(fetchNotificationsSuccess(adaptedResponse));

      // Mettre à jour le compteur de notifications non lues
      updateUnreadCount(adaptedResponse.items);

      return adaptedResponse;
    } catch (err: any) {
      console.error("Erreur récupération notifications :", err);
      const errorMessage = err?.response?.data?.message || "Erreur serveur";
      dispatch(fetchNotificationsFailure(errorMessage));
      setLocalError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  // Mettre à jour le compteur de notifications non lues
  const updateUnreadCount = (notifs: Notification[]) => {
    if (notifs && notifs.length > 0) {
      const unread = notifs.filter(
        (notif) => !notif.resolved && !isNotificationRead(notif.id)
      ).length;
      setUnreadCount(unread);
    } else {
      setUnreadCount(0);
    }
  };

  // Récupérer une notification par son ID
  const fetchNotification = async (id: string) => {
    try {
      dispatch(fetchNotificationStart());
      setLocalLoading(true);
      setLocalError(null);

      const token = localStorage.getItem("accessToken");
      const response = await api.get<Notification>(`/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(fetchNotificationSuccess(response.data));
      return response.data;
    } catch (err: any) {
      console.error("Erreur récupération notification :", err);
      const errorMessage = err?.response?.data?.message || "Erreur serveur";
      dispatch(fetchNotificationFailure(errorMessage));
      setLocalError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  // Supprimer une notification
  const deleteNotification = async (id: string) => {
    try {
      dispatch(deleteNotificationStart(id));
      setLocalError(null);

      const token = localStorage.getItem("accessToken");
      const response = await api.delete(`/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(deleteNotificationSuccess(id));

      // Mettre à jour le compteur après suppression
      if (!isNotificationRead(id)) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      return response.data;
    } catch (err: any) {
      console.error("Erreur suppression notification :", err);
      const errorMessage = err?.response?.data?.message || "Erreur serveur";
      dispatch(deleteNotificationFailure({ id, error: errorMessage }));
      setLocalError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Méthode pour marquer une notification comme lue
  const markNotificationAsRead = (id: string) => {
    markAsRead(id);
  };

  // Méthode pour marquer toutes les notifications comme lues
  const markAllNotificationsAsRead = () => {
    markAllAsRead();
  };

  // Méthode pour vérifier le statut de lecture
  const checkIfRead = (id: string): boolean => {
    return isNotificationRead(id);
  };

  // Réinitialiser les erreurs
  const resetError = () => {
    setLocalError(null);
  };

  return {
    // États
    notifications: notifications.items,
    meta: notifications.meta,
    currentNotification,
    loading: loading || localLoading,
    error: error || localError,
    deleting,
    unreadCount,

    // Méthodes
    fetchNotifications,
    fetchNotification,
    deleteNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    checkIfRead,
    resetError,
  };
}
