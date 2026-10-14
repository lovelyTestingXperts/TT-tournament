import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Trophy,
  Swords,
  Radio,
  Clock,
  ExternalLink,
  X,
  Sparkles,
} from 'lucide-react';

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  category: 'match' | 'tournament' | 'system';
  timestamp: string;
  read: boolean;
  sport?: string;
  link?: string;
  badge?: string;
  badgeColor?: string;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Quarterfinal Live: Sharath Kamal vs Manav Thakkar',
    message: 'Table Tennis Grand Smash Set 3 underway on Table 1. Match is heating up!',
    category: 'match',
    sport: 'Table Tennis',
    timestamp: '2m ago',
    read: false,
    badge: 'LIVE',
    badgeColor: 'border-rose-500/40 bg-rose-500/20 text-rose-300',
    link: '/matches',
  },
  {
    id: 'notif-2',
    title: 'Registration Open: WTT Star Contender 2026',
    message: '16 singles player slots opened. Register before deadline to participate in the $2,500 cup.',
    category: 'tournament',
    sport: 'Table Tennis',
    timestamp: '15m ago',
    read: false,
    badge: 'OPEN',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300',
    link: '/tournaments',
  },
  {
    id: 'notif-3',
    title: 'Fixtures Drawn: T20 Premier Cricket League',
    message: 'Wave 1 fixtures generated! Thunder Strikers vs Blazing Knights scheduled for opening match.',
    category: 'match',
    sport: 'Cricket',
    timestamp: '1h ago',
    read: false,
    badge: 'FIXTURE',
    badgeColor: 'border-amber-500/40 bg-amber-500/20 text-amber-300',
    link: '/matches',
  },
  {
    id: 'notif-4',
    title: 'Champion Crowned: PV Sindhu Wins Badminton Masters',
    message: 'PV Sindhu crowned tournament champion after a 21-18, 21-19 thriller in the final!',
    category: 'tournament',
    sport: 'Badminton',
    timestamp: '3h ago',
    read: true,
    badge: 'WINNER',
    badgeColor: 'border-yellow-500/40 bg-yellow-500/20 text-yellow-300',
    link: '/tournaments',
  },
  {
    id: 'notif-5',
    title: 'Chess Final: Gukesh Dommaraju vs Vidit Gujrathi',
    message: 'Grandmaster duel scheduled for tomorrow 10:00 AM. 1.0 Game Points format.',
    category: 'match',
    sport: 'Chess',
    timestamp: '5h ago',
    read: true,
    badge: 'UPCOMING',
    badgeColor: 'border-sky-500/40 bg-sky-500/20 text-sky-300',
    link: '/matches',
  },
  {
    id: 'notif-6',
    title: 'Carrom Board Queen Cover Victory',
    message: 'Rashmi Kumari secured maximum 25 points with Queen cover in board round 2.',
    category: 'match',
    sport: 'Carrom',
    timestamp: '1d ago',
    read: true,
    badge: 'RESULT',
    badgeColor: 'border-purple-500/40 bg-purple-500/20 text-purple-300',
    link: '/matches',
  },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NotificationDropdown({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'match' | 'tournament'>('all');

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (item.link) {
      onClose();
      navigate(item.link);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      data-testid="notifications-dropdown"
      className="absolute right-0 top-14 z-50 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-surface-900/95 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5 bg-surface-850/60">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
            <Bell className="size-4" />
          </div>
          <span className="font-bold text-white text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span
              data-testid="notifications-unread-pill"
              className="rounded-full bg-primary/25 border border-primary/40 px-2 py-0.5 text-[11px] font-bold text-primary"
            >
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {notifications.length > 0 && (
            <>
              {unreadCount > 0 && (
                <button
                  type="button"
                  data-testid="mark-all-read-btn"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white transition-all text-xs flex items-center gap-1"
                >
                  <CheckCheck className="size-3.5" />
                  <span className="hidden sm:inline text-[11px]">Read all</span>
                </button>
              )}
              <button
                type="button"
                data-testid="clear-notifications-btn"
                onClick={clearAll}
                title="Clear all notifications"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-rose-400 transition-all text-xs"
              >
                <Trash2 className="size-3.5" />
              </button>
            </>
          )}
          <button
            type="button"
            data-testid="close-notifications-btn"
            onClick={onClose}
            aria-label="Close notifications"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white transition-all"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-white/[0.06] px-3 pt-2 gap-1 bg-surface-850/30 text-xs">
        <button
          type="button"
          data-testid="filter-all-btn"
          onClick={() => setActiveTab('all')}
          className={`pb-2 px-2.5 font-medium border-b-2 transition-all ${
            activeTab === 'all'
              ? 'border-primary text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          data-testid="filter-match-btn"
          onClick={() => setActiveTab('match')}
          className={`pb-2 px-2.5 font-medium border-b-2 transition-all ${
            activeTab === 'match'
              ? 'border-primary text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Matches ({notifications.filter((n) => n.category === 'match').length})
        </button>
        <button
          type="button"
          data-testid="filter-tournament-btn"
          onClick={() => setActiveTab('tournament')}
          className={`pb-2 px-2.5 font-medium border-b-2 transition-all ${
            activeTab === 'tournament'
              ? 'border-primary text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Tournaments ({notifications.filter((n) => n.category === 'tournament').length})
        </button>
      </div>

      {/* Notification Items List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
        {filteredNotifications.length === 0 ? (
          <div
            data-testid="empty-notifications"
            className="flex flex-col items-center justify-center py-10 px-4 text-center text-slate-400"
          >
            <div className="size-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-500 mb-2.5">
              <Sparkles className="size-5" />
            </div>
            <p className="text-xs font-semibold text-slate-300">No notifications found</p>
            <p className="text-[11px] text-slate-500 mt-0.5">You are all caught up with match & tournament updates!</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isMatch = notif.category === 'match';
            return (
              <div
                key={notif.id}
                data-testid={`notification-item-${notif.id}`}
                onClick={() => handleNotificationClick(notif)}
                className={`group relative flex cursor-pointer gap-3 p-3.5 transition-all hover:bg-white/[0.04] ${
                  !notif.read ? 'bg-primary/[0.06]' : ''
                }`}
              >
                {/* Category Icon */}
                <div
                  className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border text-xs ${
                    isMatch
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                  }`}
                >
                  {isMatch ? <Swords className="size-4" /> : <Trophy className="size-4" />}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="font-semibold text-xs text-white truncate group-hover:text-primary transition-colors">
                      {notif.title}
                    </span>
                    {notif.badge && (
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.2 text-[9px] font-extrabold uppercase border ${
                          notif.badgeColor || 'border-primary/40 bg-primary/20 text-primary'
                        }`}
                      >
                        {notif.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-300 line-clamp-2">
                    {notif.message}
                  </p>

                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{notif.timestamp}</span>
                      {notif.sport && <span>• {notif.sport}</span>}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRead(notif.id);
                      }}
                      title={notif.read ? 'Mark as unread' : 'Mark as read'}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                    >
                      <Check className={`size-3 ${notif.read ? 'text-primary' : 'text-slate-400'}`} />
                    </button>
                  </div>
                </div>

                {/* Unread Glowing Dot */}
                {!notif.read && (
                  <span
                    data-testid="unread-indicator-dot"
                    className="absolute right-2 top-3 size-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(230,0,38,0.9)]"
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.06] bg-surface-850/60 px-4 py-2 text-[11px] text-slate-400">
        <span>TX Live Sports Notification System</span>
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/matches');
          }}
          className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
        >
          <span>View Matches</span>
          <ExternalLink className="size-3" />
        </button>
      </div>
    </div>
  );
}
