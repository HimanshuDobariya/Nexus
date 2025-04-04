import { useAuthStore } from "@/store/authStore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import moment from "moment";
import DottedSeperator from "../common/DottedSeperator";

const Notifications = ({ userId, workspaceId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId || !workspaceId) return;

    const socket = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
    });

    socket.emit("user-connected", { userId, workspaceId });

    socket.on("task-notifications", (data) => {
      setNotifications(data);
      const unreadCount = data.filter((n) => !n.isRead).length;
      setUnreadCount(unreadCount);
    });

    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, workspaceId]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/notifications/${id}/read`
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/notifications/user/${userId}/read-all`
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/notifications/${id}`,
        { isDeleted: true }
      );

      setNotifications((prev) => prev.filter((n) => n._id !== id));

      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const renderNotifications = (filterFn, filterType) => {
    const filteredNotifications = notifications.filter(filterFn);

    let message = "No notifications";
    if (filterType === "read") message = "No read notifications";
    if (filterType === "unread") message = "No unread notifications";

    return filteredNotifications.length > 0 ? (
      filteredNotifications.map((notification) => (
        <DropdownMenuItem
          key={notification._id}
          className={cn(
            "p-4 border-b last:border-b-0 hover:bg-muted/70 transition-colors relative group",
            !notification.isRead
              ? "bg-blue-50 dark:bg-blue-950/20"
              : "bg-transparent"
          )}
          onClick={() => !notification.isRead && markAsRead(notification._id)}
        >
          <div className="flex justify-between">
            <div className="flex-1 pr-6">
              <pre className="text-sm mb-1 whitespace-pre-wrap font-popins">
                {notification.message}
              </pre>
              <p className="text-xs text-muted-foreground">
                {moment(notification.createdAt).fromNow()}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNotification(notification._id);
              }}
              className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Delete notification"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </DropdownMenuItem>
      ))
    ) : (
      <p className="text-center py-4">{message}</p>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative bg-muted hover:bg-muted/60 border-none size-10 text-primary">
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-medium">
              {unreadCount}
            </span>
          )}
          <Bell className="!size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" sideOffset={5}>
        <div className="flex items-center justify-between gap-5 py-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <Button
            variant="secondary"
            size="sm"
            className="mr-2"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        </div>

        <Tabs className="w-[400px]" defaultValue="all">
          <TabsList className="mt-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          <DottedSeperator className="mt-4" />

          <TabsContent value="all" className="!max-h-96 overflow-auto">
            {renderNotifications(() => true, "all")}
          </TabsContent>
          <TabsContent value="unread" className="!max-h-96 overflow-auto">
            {renderNotifications((n) => !n.isRead, "unread")}
          </TabsContent>
          <TabsContent value="read" className="!max-h-96 overflow-auto">
            {renderNotifications((n) => n.isRead, "read")}
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
