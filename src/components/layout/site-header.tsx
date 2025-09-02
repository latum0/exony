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

  // Gestion des erreurs
  useEffect(() => {
    if (profileError) {
      console.error("Erreur de profil:", profileError);
      toast.error("Erreur lors du chargement du profil");
    }
  }, [profileError]);

  // Charger les notifications initiales et surveiller les changements
  useEffect(() => {
    if (profile?.role === "ADMIN") {
      fetchNotifications();
      
      // Écouter les changements de localStorage pour les nouvelles notifications
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'notifications') {
          fetchNotifications();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [profile?.role]);

  // Charger les notifications quand le dropdown s'ouvre
  useEffect(() => {
    if (isNotificationsOpen && profile?.role === "ADMIN") {
      fetchNotifications();
    }
  }, [isNotificationsOpen, profile?.role]);

  // Calculer le nombre de notifications non lues
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Vérifier dans localStorage quelles notifications ont été lues
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      
      const unread = notifications.filter(notif => 
        !notif.resolved && !readNotifications.includes(notif.id)
      ).length;
      
      setUnreadCount(unread);
    } else {
      setUnreadCount(0);
    }
  }, [notifications]);

  // Fonction pour marquer une notification comme résolue avec localStorage
  const handleMarkAsResolved = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Récupérer les notifications depuis localStorage
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications) {
        const notificationsData: Notification[] = JSON.parse(storedNotifications);
        
        // Mettre à jour la notification spécifique
        const updatedNotifications = notificationsData.map(notif => 
          notif.id === id ? { ...notif, resolved: true } : notif
        );
        
        // Sauvegarder dans localStorage
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        
        // Rafraîchir les notifications affichées
        if (isNotificationsOpen) {
          fetchNotifications();
        }
        
        toast.success("Notification marquée comme résolue");
      }
    } catch (err) {
      console.error("Erreur lors du marquage comme résolu:", err);
      toast.error("Échec de l'opération");
    }
  };

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
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "LOW_STOCK":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
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
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    console.log("Voir détails:", notification.id);
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
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={handleMarkAllAsRead}
                      >
                        Tout marquer comme lu
                      </Button>
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
                    {notifications.map((notification) => {
                      // Vérifier si la notification a été lue
                      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
                      const isRead = readNotifications.includes(notification.id);
                      
                      return (
                        <DropdownMenuItem
                          key={notification.id}
                          className={`flex flex-col items-start p-3 rounded-md cursor-pointer hover:bg-accent ${isRead ? 'opacity-70' : 'bg-blue-50'}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start justify-between w-full mb-2">
                            <div className="flex items-center gap-2">
                              {getNotificationIcon(notification.type)}
                              <span className="text-sm font-medium">
                                {getNotificationLabel(notification.type)}
                                {!isRead && (
                                  <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                                )}
                              </span>
                            </div>
                            {notification.resolved ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Non résolu
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                            <span>
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString()}
                            </span>
                            <div className="flex gap-1">
                              {!notification.resolved && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => handleMarkAsResolved(notification.id, e)}
                                  title="Marquer comme résolu"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) =>
                                  handleDeleteNotification(notification.id, e)
                                }
                                disabled={deleting.includes(notification.id)}
                                title="Supprimer la notification"
                              >
                                {deleting.includes(notification.id) ? (
                                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                )}

                {notifications && notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-xs text-center text-muted-foreground cursor-pointer"
                      onClick={() => {
                        console.log("Voir toutes les notifications");
                      }}
                    >
                      Voir toutes les notifications
                    </DropdownMenuItem>
                  </>
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