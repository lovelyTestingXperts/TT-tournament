import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
import {
  Trophy,
  Swords,
  UserCheck,
  Sparkles,
  Radio,
  ExternalLink,
  CheckCircle2,
  Clock,
  Check,
  Flame,
} from 'lucide-react';
import {
  useNotifications,
  useMarkNotificationAsRead,
} from '@/features/tournament/graphql/hooks';

type ActivityItem = {
  id: string;
  title: string;
  message: string;
  category: 'match' | 'tournament' | 'system' | string;
  sport?: string;
  link?: string;
  badge?: string;
  badgeColor?: string;
  read: boolean;
  createdAt: string;
};

const FALLBACK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'activity-1',
    title: 'Wave 1 Fixtures Drawn: T20 Premier Cricket League',
    message: 'Fixtures generated! Thunder Strikers vs Blazing Knights scheduled for opening match.',
    category: 'match',
    sport: 'Cricket',
    link: '/matches',
    badge: 'FIXTURE',
    badgeColor: 'border-amber-500/40 bg-amber-500/20 text-amber-300',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-2',
    title: 'Registration Open: WTT Star Contender 2026',
    message: '16 singles player slots opened. Register before deadline to participate in the $2,500 cup.',
    category: 'tournament',
    sport: 'Table Tennis',
    link: '/tournaments',
    badge: 'OPEN',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-3',
    title: 'Quarterfinal Live: Sharath Kamal vs Manav Thakkar',
    message: 'Table Tennis Grand Smash Set 3 underway on Table 1. Live scoring updated.',
    category: 'match',
    sport: 'Table Tennis',
    link: '/matches',
    badge: 'LIVE',
    badgeColor: 'border-rose-500/40 bg-rose-500/20 text-rose-300',
    read: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-4',
    title: 'Champion Crowned: PV Sindhu Wins Badminton Masters',
    message: 'PV Sindhu crowned tournament champion after a 21-18, 21-19 thriller in the final!',
    category: 'tournament',
    sport: 'Badminton',
    link: '/tournaments',
    badge: 'WINNER',
    badgeColor: 'border-yellow-500/40 bg-yellow-500/20 text-yellow-300',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function ActivityTimeline() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'tournament' | 'match'>('all');
  const { data, loading } = useNotifications();
  const [markNotificationAsRead] = useMarkNotificationAsRead();

  const rawNotifications: ActivityItem[] = useMemo(() => {
    if (data?.notifications && data.notifications.length > 0) {
      return data.notifications;
    }
    return FALLBACK_ACTIVITIES;
  }, [data]);

  const filteredActivities = useMemo(() => {
    if (filter === 'all') return rawNotifications;
    return rawNotifications.filter((item) =>
      item.category?.toLowerCase().includes(filter)
    );
  }, [rawNotifications, filter]);

  const handleItemClick = (item: ActivityItem) => {
    if (!item.read) {
      markNotificationAsRead({ variables: { id: item.id } }).catch(() => {});
    }
    if (item.link) {
      navigate(item.link);
    }
  };

  const getActivityIcon = (category: string, sport?: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('match') || cat.includes('score')) {
      return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-600/20 border border-sky-500/30 text-sky-300">
          <Swords className="size-4" />
        </div>
      );
    }
    if (cat.includes('tournament') || cat.includes('champion') || cat.includes('winner')) {
      return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border border-amber-500/30 text-amber-300">
          <Trophy className="size-4" />
        </div>
      );
    }
    if (cat.includes('member') || cat.includes('user') || cat.includes('team')) {
      return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 text-emerald-300">
          <UserCheck className="size-4" />
        </div>
      );
    }
    return (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30 text-violet-300">
        <Sparkles className="size-4" />
      </div>
    );
  };

  const getRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      return moment(isoString).fromNow();
    } catch {
      return 'Recently';
    }
  };

  return (
    <div
      data-testid="activity-timeline"
      className="glass-card flex flex-col justify-between rounded-[32px] p-6"
    >
      <div>
        {/* Header Section */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <Radio className="size-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-white leading-tight">
                  Recent Activity
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Feed
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time tournament events, matches & announcements
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              data-testid="activity-filter-all"
              onClick={() => setFilter('all')}
              className={`
                rounded-lg px-2.5 py-1 text-xs font-semibold transition-all
                ${
                  filter === 'all'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }
              `}
            >
              All
            </button>
            <button
              type="button"
              data-testid="activity-filter-tournaments"
              onClick={() => setFilter('tournament')}
              className={`
                rounded-lg px-2.5 py-1 text-xs font-semibold transition-all
                ${
                  filter === 'tournament'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }
              `}
            >
              Tournaments
            </button>
            <button
              type="button"
              data-testid="activity-filter-matches"
              onClick={() => setFilter('match')}
              className={`
                rounded-lg px-2.5 py-1 text-xs font-semibold transition-all
                ${
                  filter === 'match'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }
              `}
            >
              Matches
            </button>
          </div>
        </div>

        {/* Activity Stream */}
        {loading && rawNotifications.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-slate-400">
            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
            <Clock className="size-8 text-slate-500 mb-2" />
            <p className="text-sm font-medium">No activity records in this category.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.slice(0, 5).map((item) => (
              <div
                key={item.id}
                data-testid={`activity-row-${item.id}`}
                onClick={() => handleItemClick(item)}
                className={`
                  group
                  relative
                  flex
                  cursor-pointer
                  items-start
                  justify-between
                  gap-4
                  rounded-2xl
                  border
                  p-3.5
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-md
                  ${
                    !item.read
                      ? 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-primary/40'
                      : 'border-white/[0.04] bg-white/[0.02] opacity-80 hover:opacity-100 hover:bg-white/[0.05]'
                  }
                `}
              >
                <div className="flex items-start gap-3 min-w-0">
                  {getActivityIcon(item.category, item.sport)}

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Sport Badge */}
                      {item.sport && (
                        <span className="rounded-md bg-white/10 border border-white/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                          {item.sport}
                        </span>
                      )}

                      {/* Event Status / Badge */}
                      {item.badge && (
                        <span
                          className={`
                            rounded-md
                            border
                            px-1.5
                            py-0.5
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            ${item.badgeColor || 'border-white/20 bg-white/10 text-white/90'}
                          `}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Seen / Unseen Status Pill */}
                      {!item.read ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                          <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          Unseen
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                          <Check className="size-3 text-emerald-400" />
                          Seen
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">
                        • {getRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-sm leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>

                {/* Right Action Icon */}
                <div className="flex shrink-0 items-center self-center pt-1">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-slate-400 transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
                    <ExternalLink className="size-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}