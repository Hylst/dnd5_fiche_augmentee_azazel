import { useEffect } from 'react';
import { useCharacterStore } from '../store/characterStore';
import { X, Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

export function Notifications() {
  const { notifications, removeNotification } = useCharacterStore();

  useEffect(() => {
    if (notifications.length > 0) {
      const timers = notifications.map(notif => 
        setTimeout(() => {
          removeNotification(notif.id);
        }, 6000)
      );
      
      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none items-end">
      {notifications.map((notif) => (
        <div 
          key={notif.id}
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-lg border-2 shadow-2xl min-w-[300px] animate-in slide-in-from-right-8 fade-in duration-500",
            notif.type === 'critical' ? "bg-or/20 border-or text-or-vif backdrop-blur-md" : "bg-rouge-sang/20 border-rouge-sang text-rouge-sang backdrop-blur-md"
          )}
        >
          <div className="flex items-center gap-3">
            {notif.type === 'critical' ? <Sparkles className="w-6 h-6 animate-pulse" /> : <AlertTriangle className="w-6 h-6 animate-pulse" />}
            <span className="font-title-alt text-lg">{notif.message}</span>
          </div>
          <button 
            onClick={() => removeNotification(notif.id)} 
            className="hover:opacity-70 transition-opacity p-1 bg-black/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
