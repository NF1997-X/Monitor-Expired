import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Settings,
  Bell,
  List,
  Trash2,
  Calendar,
  TrendingUp,
  User,
  Info,
  PackageOpen,
  ChevronDown,
  Home as HomeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { FoodItem, InsertFoodItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import MiniCalendar from "@/components/mini-calendar";
import FoodItemCard from "@/components/food-item-card";
import AddEditModal from "@/components/add-edit-modal";
import SettingsModal from "@/components/settings-modal";
import StatsModal from "@/components/stats-modal";
import CalendarModal from "@/components/calendar-modal";
import ProfileModal from "@/components/profile-modal";
import DescriptionModal from "@/components/description-modal";
import PasswordModal from "@/components/password-modal";
import Notification from "@/components/notification";
import { NotificationModal } from "@/components/notification-modal";
import {
  requestNotificationPermission,
  scheduleExpiryNotifications,
} from "@/lib/notifications";
import { getDaysUntilExpiry } from "@/lib/date-utils";
import { format, parseISO, startOfMonth } from "date-fns";

interface NotificationItem {
  id: string;
  message: string;
  type:
    | "success"
    | "warning"
    | "error"
    | "info"
    | "warning-3day"
    | "warning-8day"
    | "warning-15day";
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"active" | "trash">("active");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [viewedNotifications, setViewedNotifications] = useState<Set<string>>(new Set());
  const [passwordAction, setPasswordAction] = useState<{ type: 'edit' | 'delete', item: FoodItem } | null>(null);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Create BroadcastChannel for cross-tab communication
  const broadcastChannel = useRef<BroadcastChannel | null>(null);
  const notificationBellRef = useRef<HTMLButtonElement>(null);

  // Initialize BroadcastChannel for cross-tab communication
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel.current = new BroadcastChannel('foodtracker-sync');
      
      // Listen for messages from other tabs
      broadcastChannel.current.onmessage = (event) => {
        if (event.data.type === 'notification') {
          showNotification(event.data.message, event.data.notificationType);
        } else if (event.data.type === 'data-change') {
          // Sync data when changes occur in other tabs
          queryClient.invalidateQueries({ queryKey: ['/api/food-items'] });
          queryClient.invalidateQueries({ queryKey: ['/api/food-items/trash'] });
        }
      };
      
      return () => {
        broadcastChannel.current?.close();
      };
    }
  }, [queryClient]);

  // Request notification permission when app opens
  useEffect(() => {
    // Request notification permission if not already set
    if (
      "Notification" in window &&
      window.Notification.permission === "default"
    ) {
      requestNotificationPermission().then((permission) => {
        if (permission === "granted") {
          showNotification("Browser notifications enabled! 🔔", "success");
        } else if (permission === "denied") {
          showNotification(
            "Browser notifications blocked. Enable in browser settings for alerts.",
            "warning",
          );
        }
      });
    }
  }, []);

  // Fetch active food items
  const { data: foodItems = [], isLoading } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items"],
    refetchInterval: 60000, // Refetch every minute for expiry updates
  });

  // Fetch deleted food items
  const { data: deletedItems = [] } = useQuery<FoodItem[]>({
    queryKey: ["/api/food-items/trash"],
  });

  // Auto-delete expired items when app loads/data changes
  useEffect(() => {
    if (foodItems.length > 0 && !isLoading) {
      // Check if auto-delete is enabled in settings
      const savedSettings = localStorage.getItem("foodTracker-settings");
      let autoDeleteEnabled = true; // Default to enabled
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          autoDeleteEnabled = settings.autoDeleteExpired !== false;
        } catch (error) {
          console.error("Failed to parse settings:", error);
        }
      }

      if (autoDeleteEnabled) {
        const expiredItems = foodItems.filter((item) => {
          const days = getDaysUntilExpiry(item.expiryDate);
          return days <= -1; // Item expired by 1+ day
        });

        // Auto-delete expired items
        if (expiredItems.length > 0) {
          expiredItems.forEach((item) => {
            autoDeleteMutation.mutate(item.id);
          });

          // Show notification with item names
          const names = expiredItems.map(item => item.name);
          const displayNames = names.length <= 3 ? names.join(", ") : 
            `${names.slice(0, 3).join(", ")} and ${names.length - 3} more`;
          showNotification(
            `Auto-deleted: ${displayNames}`,
            "warning",
          );
        }
      } else {
        // If auto-delete is disabled, just show expired notifications
        const expiredItems = foodItems.filter((item) => {
          const days = getDaysUntilExpiry(item.expiryDate);
          return days <= 0;
        });

        if (expiredItems.length > 0) {
          expiredItems.forEach((item) => {
            showNotification(`${item.name} has expired!`, "error");
          });
        }
      }
    }
  }, [foodItems, isLoading]);

  // Check for upcoming expiry warnings (only on data changes)
  useEffect(() => {
    if (foodItems.length > 0) {
      const threeDayItems = foodItems.filter((item) => {
        const days = getDaysUntilExpiry(item.expiryDate);
        return days === 3;
      });

      const fifteenDayItems = foodItems.filter((item) => {
        const days = getDaysUntilExpiry(item.expiryDate);
        return days === 15;
      });

      const eightDayItems = foodItems.filter((item) => {
        const days = getDaysUntilExpiry(item.expiryDate);
        return days === 8;
      });

      // Show 3-day warning notifications
      threeDayItems.forEach((item) => {
        showNotification(`${item.name} expires in 3 days! Please double check again.`, "warning-3day");
      });
      // Show 8-day warning notifications
      eightDayItems.forEach((item) => {
        showNotification(`${item.name} expires in 8 days!`, "warning-8day");
      });
      // Show 15-day warning notifications
      fifteenDayItems.forEach((item) => {
        showNotification(`${item.name} expires in 15 days. Stand by, don't forget to stock out!`, "warning-15day");
      });
    }
  }, [foodItems]);

  // Create food item mutation
  const createMutation = useMutation({
    mutationFn: async (item: InsertFoodItem) => {
      const response = await apiRequest("POST", "/api/food-items", item);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      showNotification("Item added successfully", "success", true);
      // Broadcast data change to other tabs
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({ type: 'data-change' });
      }
    },
    onError: () => {
      showNotification("Failed to add item", "error");
    },
  });

  // Update food item mutation (with optional password)
  const updateMutation = useMutation({
    mutationFn: async (data: ({ id: string; adminPassword: string } | { id: string }) & InsertFoodItem) => {
      const { id, ...rest } = data;
      const adminPassword = 'adminPassword' in data ? data.adminPassword : undefined;
      const requestData = adminPassword ? { ...rest, adminPassword } : rest;
      return await apiRequest("PATCH", `/api/food-items/${id}`, requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      showNotification("Item updated successfully", "success", true);
      // Broadcast data change to other tabs
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({ type: 'data-change' });
      }
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to update item";
      showNotification(message, "error");
    },
  });

  // Delete food item mutation (with password)
  const deleteMutation = useMutation({
    mutationFn: async (data: { id: string; adminPassword?: string }) => {
      const requestData = data.adminPassword ? { adminPassword: data.adminPassword } : {};
      return await apiRequest("DELETE", `/api/food-items/${data.id}`, requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/food-items/trash"] });
      showNotification("Item moved to trash", "info", true);
      // Broadcast data change to other tabs
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({ type: 'data-change' });
      }
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to delete item";
      showNotification(message, "error");
    },
  });

  // Restore food item mutation
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(
        "POST",
        `/api/food-items/${id}/restore`,
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/food-items/trash"] });
      showNotification("Item restored", "success", true);
      // Broadcast data change to other tabs
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({ type: 'data-change' });
      }
    },
    onError: () => {
      showNotification("Failed to restore item", "error");
    },
  });

  // Permanent delete mutation
  const permanentDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(
        "DELETE",
        `/api/food-items/${id}/permanent`,
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items/trash"] });
      showNotification("Item permanently deleted", "warning", true);
      // Broadcast data change to other tabs
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({ type: 'data-change' });
      }
    },
    onError: () => {
      showNotification("Failed to permanently delete item", "error");
    },
  });

  // Clear trash mutation
  const clearTrashMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        "DELETE",
        "/api/food-items/trash/clear",
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items/trash"] });
      showNotification("Trash cleared", "warning", true);
      // Broadcast data change to other tabs
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({ type: 'data-change' });
      }
    },
    onError: () => {
      showNotification("Failed to clear trash", "error");
    },
  });

  // Auto-delete expired items mutation
  const autoDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/food-items/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/food-items/trash"] });
    },
    onError: () => {
      showNotification("Failed to auto-delete expired item", "error");
    },
  });

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Show welcome toast on first load
  useEffect(() => {
    toast({
      title: "Welcome to FoodTracker! 🥬",
      description: "Track your food expiration dates and reduce waste",
    });
  }, []);

  // Schedule notifications for expiring items
  useEffect(() => {
    if (foodItems.length > 0) {
      scheduleExpiryNotifications(foodItems);
    }
  }, [foodItems]);


  const showNotification = (
    message: string,
    type:
      | "success"
      | "warning"
      | "error"
      | "info"
      | "warning-3day"
      | "warning-8day"
      | "warning-15day",
    broadcast: boolean = false
  ) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    // Broadcast notification to other tabs if requested
    if (broadcast && broadcastChannel.current) {
      broadcastChannel.current.postMessage({
        type: 'notification',
        message,
        notificationType: type
      });
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSaveItem = (
    item: InsertFoodItem | (InsertFoodItem & { id: string }),
  ) => {
    if ("id" in item) {
      // Update existing item
      const currentItem = foodItems.find(i => i.id === item.id);
      if (currentItem) {
        const daysUntilExpiry = getDaysUntilExpiry(currentItem.expiryDate);
        
        // If more than 15 days, password should already be stored
        if (daysUntilExpiry > 15) {
          const adminPassword = (editingItem as any)?._adminPassword;
          if (!adminPassword) {
            showNotification("Authentication required for updates", "error");
            return;
          }
          updateMutation.mutate({ ...item, adminPassword });
        } else {
          // No password needed for items within 15 days
          updateMutation.mutate(item);
        }
      }
    } else {
      createMutation.mutate(item);
    }
    setEditingItem(null);
  };

  const handleEditItem = (item: FoodItem) => {
    if (!confirm(`Are you sure you want to edit "${item.name}"?`)) {
      return;
    }
    
    const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
    
    // If more than 15 days until expiry, require password
    if (daysUntilExpiry > 15) {
      setPasswordAction({ type: 'edit', item });
      setIsPasswordModalOpen(true);
    } else {
      // No password required for items within 15 days
      setEditingItem(item);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteItem = (id: string) => {
    const item = foodItems.find(item => item.id === id);
    if (!item) return;

    if (!confirm(`Are you sure you want to move "${item.name}" to trash?`)) {
      return;
    }

    const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
    
    // If more than 15 days until expiry, require password
    if (daysUntilExpiry > 15) {
      setPasswordAction({ type: 'delete', item });
      setIsPasswordModalOpen(true);
    } else {
      // No password required for items within 15 days - delete directly
      deleteMutation.mutate({ id: item.id });
    }
  };

  const verifyPassword = async (password: string) => {
    try {
      const response = await apiRequest('POST', '/api/verify-password', { password });
      const data = await response.json();
      
      if (data.valid) {
        if (passwordAction?.type === 'edit') {
          // Store password for later use in save operation
          setEditingItem({ ...passwordAction.item, _adminPassword: password } as any);
          setIsAddModalOpen(true);
        } else if (passwordAction?.type === 'delete') {
          deleteMutation.mutate({ id: passwordAction.item.id, adminPassword: password });
        }
        setIsPasswordModalOpen(false);
        setPasswordAction(null);
      } else {
        showNotification(data.message || 'Invalid password', 'error');
      }
    } catch (error: any) {
      showNotification(error?.message || 'Password verification failed', 'error');
    }
  };

  const handleRestoreItem = (id: string) => {
    restoreMutation.mutate(id);
  };

  const handlePermanentDelete = (id: string) => {
    if (confirm("Permanently delete this item? This cannot be undone.")) {
      permanentDeleteMutation.mutate(id);
    }
  };

  const handleClearTrash = () => {
    if (confirm("Clear all items from trash? This cannot be undone.")) {
      clearTrashMutation.mutate();
    }
  };

  const handleClearAllData = () => {
    queryClient.clear();
    showNotification("All data cleared", "warning");
  };

  const expiringItems = foodItems.filter((item) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(item.expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
  });

  const unviewedExpiringItems = expiringItems.filter(item => !viewedNotifications.has(item.id));
  const expiringItemsCount = unviewedExpiringItems.length;

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
    // Mark all current expiring items as viewed
    const newViewed = new Set(viewedNotifications);
    expiringItems.forEach(item => newViewed.add(item.id));
    setViewedNotifications(newViewed);
  };

  // Helper function to group food items by expiration month
  const groupItemsByMonth = (items: FoodItem[]) => {
    const grouped: { [key: string]: FoodItem[] } = {};
    
    items.forEach(item => {
      const expiryDate = typeof item.expiryDate === 'string' ? parseISO(item.expiryDate) : item.expiryDate;
      const monthKey = format(startOfMonth(expiryDate), 'yyyy-MM');
      const monthLabel = format(expiryDate, 'MMMM yyyy');
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(item);
    });

    // Sort by month/year
    const sortedKeys = Object.keys(grouped).sort();
    const sortedGroups: { monthLabel: string; items: FoodItem[] }[] = [];
    
    sortedKeys.forEach(key => {
      const items = grouped[key].sort(
        (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      );
      const monthLabel = format(parseISO(key + '-01'), 'MMMM yyyy');
      sortedGroups.push({ monthLabel, items });
    });

    return sortedGroups;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      {/* Notifications */}
      <div
        className="fixed top-4 right-4 z-50 space-y-2"
        data-testid="notifications"
      >
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            id={notification.id}
            message={notification.message}
            type={notification.type}
            onRemove={removeNotification}
          />
        ))}
      </div>

      {/* Header with Calendar */}
      <header className="glass-dark p-4 sticky top-0 z-40 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/FamilyMart.png" 
              alt="FamilyMart" 
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              onClick={() => setIsDescriptionOpen(true)}
              data-testid="description-button"
            >
              <Info className="w-4 h-4 transition-transform hover:rotate-12" />
            </button>
            <button
              ref={notificationBellRef}
              className={`relative p-2 text-muted-foreground hover:text-foreground transition-all duration-200 rounded-full ${expiringItemsCount > 0 ? 'animate-[notification-glow_2s_ease-in-out_infinite]' : ''}`}
              onClick={handleNotificationClick}
              data-testid="notification-bell"
            >
              <Bell className={`w-4 h-4 transition-transform hover:rotate-12 ${expiringItemsCount > 0 ? 'animate-[notification-pulse_1.5s_ease-in-out_infinite]' : ''}`} />
              {expiringItemsCount > 0 && (
                <>
                  <div className="notification-dot animate-[notification-pulse_1s_ease-in-out_infinite]"></div>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-[notification-pulse_1s_ease-in-out_infinite]">
                    {expiringItemsCount}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        <MiniCalendar />
      </header>

      {/* Tab Navigation */}
      <nav
        className="px-4 mb-4 animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="glass rounded-lg p-1 flex">
          <button
            className={`flex-1 py-2 px-3 font-medium rounded transition-all flex items-center justify-center space-x-1 ${
              activeTab === "active"
                ? "text-blue-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("active")}
            data-testid="active-tab"
            style={{ fontSize: '11px' }}
          >
            <List className="w-3 h-3" />
            <span>Active Items</span>
          </button>
          <button
            className={`flex-1 py-2 px-3 font-medium rounded transition-all flex items-center justify-center space-x-1 ${
              activeTab === "trash"
                ? "text-red-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("trash")}
            data-testid="trash-tab"
            style={{ fontSize: '11px' }}
          >
            <Trash2 className="w-3 h-3" />
            <span>Trash</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main
        className="px-4 pb-20 animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        {activeTab === "active" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-muted-foreground" style={{ fontSize: '11px' }}>
                Food Items
              </h2>
              <span
                className="text-muted-foreground"
                style={{ fontSize: '11px' }}
                data-testid="item-count"
              >
                {foodItems.length} items
              </span>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="glass rounded-lg p-3">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : foodItems.length === 0 ? (
              <div className="text-center py-8" data-testid="empty-state">
                <PackageOpen className="w-8 h-8 text-muted-foreground mb-2 mx-auto animate-bounce" />
                <p className="text-sm text-muted-foreground mb-4">
                  No food items added yet
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 text-xs font-medium"
                  data-testid="add-first-item"
                >
                  Add Your First Item
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {groupItemsByMonth(foodItems).map((group, index) => {
                  const currentMonth = format(new Date(), 'MMMM yyyy');
                  const isCurrentMonth = group.monthLabel === currentMonth;
                  
                  return (
                    <Collapsible key={group.monthLabel} defaultOpen={isCurrentMonth}>
                      <div className="space-y-3">
                        {/* Month Header */}
                        <CollapsibleTrigger asChild>
                          <button className="w-full flex items-center justify-between hover:opacity-80 transition-opacity">
                            <h3 className="font-semibold text-foreground flex items-center space-x-2" style={{ fontSize: '11px' }}>
                              <Calendar className="w-4 h-4 text-primary" />
                              <span>{group.monthLabel}</span>
                              <ChevronDown className="w-3 h-3 text-muted-foreground transition-transform duration-200" />
                            </h3>
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                              {group.items.length} items
                            </span>
                          </button>
                        </CollapsibleTrigger>
                        
                        {/* Items in this month */}
                        <CollapsibleContent>
                          <div className="space-y-3 pl-6 border-l-2 border-primary/20">
                            {group.items.map((item) => (
                              <FoodItemCard
                                key={item.id}
                                item={item}
                                onEdit={handleEditItem}
                                onDelete={handleDeleteItem}
                              />
                            ))}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "trash" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                Deleted Items
              </h2>
              {deletedItems.length > 0 && (
                <button
                  className="text-xs text-destructive hover:text-red-300 transition-colors"
                  onClick={handleClearTrash}
                  data-testid="clear-trash"
                >
                  Clear All
                </button>
              )}
            </div>

            {deletedItems.length === 0 ? (
              <div className="text-center py-8" data-testid="empty-trash">
                <Trash2 className="w-8 h-8 text-muted-foreground mb-2 mx-auto" />
                <p className="text-sm text-muted-foreground">Trash is empty</p>
              </div>
            ) : (
              deletedItems.map((item) => (
                <FoodItemCard
                  key={item.id}
                  item={item}
                  isDeleted
                  onRestore={handleRestoreItem}
                  onPermanentDelete={handlePermanentDelete}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 p-3 rounded-full shadow-lg glass animate-fade-in"
        style={{ animationDelay: "0.8s" }}
        onClick={() => setIsAddModalOpen(true)}
        data-testid="add-item-fab"
      >
        <Plus className="w-5 h-5" />
      </Button>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-dark p-2 animate-slide-up"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="flex justify-around items-center">
          <button
            className="flex flex-col items-center py-2 px-3 text-primary transition-colors duration-200"
            data-testid="nav-home"
          >
            <HomeIcon className="w-4 h-4 mb-1 transition-transform hover:rotate-12" />
            <span className="text-xs">Home</span>
          </button>
          <button
            className="flex flex-col items-center py-2 px-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
            onClick={() => setIsCalendarOpen(true)}
            data-testid="nav-calendar"
          >
            <Calendar className="w-4 h-4 mb-1" />
            <span className="text-xs">Calendar</span>
          </button>
          <button
            className="flex flex-col items-center py-2 px-3 text-primary hover:text-primary/80 transition-colors duration-200"
            onClick={() => setIsAddModalOpen(true)}
            data-testid="nav-add"
          >
            <Plus className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Add Item</span>
          </button>
          <button
            className="flex flex-col items-center py-2 px-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
            onClick={() => setIsStatsOpen(true)}
            data-testid="nav-stats"
          >
            <TrendingUp className="w-4 h-4 mb-1" />
            <span className="text-xs">Stats</span>
          </button>
          <button
            className="flex flex-col items-center py-2 px-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
            onClick={() => setIsSettingsOpen(true)}
            data-testid="nav-settings"
          >
            <Settings className="w-4 h-4 mb-1" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <AddEditModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editingItem={editingItem}
        existingItems={foodItems}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearAllData={handleClearAllData}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        foodItems={foodItems}
        deletedItems={deletedItems}
      />

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        foodItems={foodItems}
      />

      <DescriptionModal
        isOpen={isDescriptionOpen}
        onClose={() => setIsDescriptionOpen(false)}
      />

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPasswordAction(null);
        }}
        onConfirm={verifyPassword}
        title={passwordAction?.type === 'edit' ? 'Edit Item' : 'Delete Item'}
        description={passwordAction?.type === 'edit' 
          ? 'Please enter password for protection to edit this food item.'
          : 'Please enter password for protection to delete this food item.'
        }
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onClearAllData={handleClearAllData}
      />

      <NotificationModal
        open={isNotificationModalOpen}
        onOpenChange={setIsNotificationModalOpen}
        expiringItems={expiringItems}
        triggerRef={notificationBellRef}
      />
    </div>
  );
}
