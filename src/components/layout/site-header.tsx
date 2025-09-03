import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useProfile from "@/hooks/useProfile";
import useNotifications from "@/hooks/useNotifications";
import { NavUserHeader } from "./nav-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Eye, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Définition du type Notification
interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  resolved: boolean;
}

export function SiteHeader() {
  const { profile, error: profileError } = useProfile();
  const {
    notifications,
    loading,
    error: notificationsError,
    deleting,
    fetchNotifications,
    deleteNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    checkIfRead,
  } = useNotifications();

  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const user = {
    name: profile?.name || "",
    role: profile?.role || "",
    email: profile?.email || "",
  };

  useEffect(() => {
    if (profileError) {
      console.error("Erreur de profil:", profileError);
      toast.error("Erreur lors du chargement du profil");
    }
  }, [profileError]);

  useEffect(() => {
    if (profile?.role === "ADMIN") {
      fetchNotifications();

      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "notifications") {
          fetchNotifications();
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [profile?.role]);

  useEffect(() => {
    if (isNotificationsOpen && profile?.role === "ADMIN") {
      fetchNotifications();
    }
  }, [isNotificationsOpen, profile?.role]);

  // Calculer le nombre de notifications non lues
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const readNotifications = JSON.parse(
        localStorage.getItem("readNotifications") || "[]"
      );

      const unread = notifications.filter(
        (notif) => !notif.resolved && !readNotifications.includes(notif.id)
      ).length;

      setUnreadCount(unread);
    } else {
      setUnreadCount(0);
    }
  }, [notifications]);

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      toast.success("Notification supprimée");
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      toast.error("Échec de la suppression");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "OUT_OF_STOCK":
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
        );
      case "LOW_STOCK":
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100"></div>
        );
    }
  };

  const getNotificationLabel = (type: string) => {
    switch (type) {
      case "OUT_OF_STOCK":
        return "Rupture de stock";
      case "LOW_STOCK":
        return "Stock faible";
      default:
        return "Notification";
    }
  };

  // Marquer une notification comme lue quand on clique dessus
  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);

    // Mettre à jour le compteur de notifications non lues
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Marquer toutes les notifications comme lues
  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    setUnreadCount(0);
    toast.success("Toutes les notifications marquées comme lues");
  };

  return (
    <header className="sticky top-0 bg-[#fafafa] z-50 h-16 flex items-center shadow-sm border-b pr-4 lg:pr-6 pl-4">
      <div className="flex w-full items-center">
        <SidebarTrigger className="-ml-1" />

        <div className="flex items-center justify-end w-full gap-4">
          {/* Bouton de notifications pour les administrateurs */}
          {profile?.role === "ADMIN" && (
            <DropdownMenu
              open={isNotificationsOpen}
              onOpenChange={(open) => {
                setIsNotificationsOpen(open);
                if (!open && unreadCount > 0) {
                  handleMarkAllAsRead();
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 max-h-96 overflow-y-auto"
              >
                <div className="flex items-center justify-between p-2 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {notifications && (
                      <Badge variant="outline">
                        {notifications.length}{" "}
                        {notifications.length > 1 ? "notifs" : "notif"}
                      </Badge>
                    )}
                  </div>
                </div>

                {loading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Chargement des notifications...
                  </div>
                ) : notificationsError ? (
                  <div className="p-4 text-center text-sm text-destructive">
                    Erreur: {notificationsError}
                  </div>
                ) : !notifications || notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Aucune notification
                  </div>
                ) : (
                  <div className="space-y-1 p-1">
                    {notifications.map((notification, index) => {
                      const readNotifications = JSON.parse(
                        localStorage.getItem("readNotifications") || "[]"
                      );
                      const isRead = readNotifications.includes(
                        notification.id
                      );

                      return (
                        <div
                          key={notification.id}
                          className={`group relative bg-gray-50 hover:bg-[#F8A67E]/5 border-b border-gray-100 cursor-pointer transition-colors ${
                            !isRead ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="p-3">
                            <div className="flex items-start gap-3">
                              {getNotificationIcon(notification.type)}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-900">
                                    {getNotificationLabel(notification.type)}
                                  </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-2">
                                  {notification.message}
                                </p>

                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    {new Date(
                                      notification.createdAt
                                    ).toLocaleDateString("fr-FR", {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>

                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                                      onClick={(e) =>
                                        handleDeleteNotification(
                                          notification.id,
                                          e
                                        )
                                      }
                                      disabled={deleting.includes(
                                        notification.id
                                      )}
                                      title="Supprimer"
                                    >
                                      {deleting.includes(notification.id) ? (
                                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                      ) : (
                                        <Trash2 className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <NavUserHeader user={user} />
        </div>
      </div>
    </header>
  );
}
