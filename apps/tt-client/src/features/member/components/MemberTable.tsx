import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreVertical,
  UserX,
  ExternalLink,
  Edit2,
  Trash2,
} from 'lucide-react';
import moment from 'moment-timezone';
import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';
import { useDeleteUser } from '@/features/member/graphql/hooks';

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type MemberTableProps = {
  members: Member[];
  loading?: boolean;
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  onRefresh?: () => void;
};

export default function MemberTable({
  members,
  loading,
  meta,
  onPageChange,
  onRefresh,
}: MemberTableProps) {
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteUser, { loading: deleting }] = useDeleteUser();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async (id: string, name: string) => {
    setActiveMenuId(null);
    if (confirm(`Are you sure you want to delete user ${name}?`)) {
      await deleteUser({ variables: { id } });
      onRefresh?.();
    }
  };

  if (loading) {
    return (
      <div className="glass-card flex flex-col items-center justify-center p-14 text-slate-400">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-sm">Loading members...</p>
      </div>
    );
  }

  if (!members.length) {
    return (
      <div className="glass-card flex flex-col items-center justify-center p-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-panel border border-white/[0.08] bg-white/[0.03] text-slate-500">
          <UserX className="size-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-white">No members found</h3>
        <p className="mt-1 text-sm text-slate-400 max-w-sm">
          Try adjusting your search query or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-visible">
      {/* Table Head */}
      <div className="grid grid-cols-12 items-center border-b border-white/[0.07] bg-white/[0.02] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <div className="col-span-4">User Details</div>
        <div className="col-span-2">Assigned Role</div>
        <div className="col-span-3">Contact Info</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Joined</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/[0.04]">
        {members.map((member) => {
          const isMenuOpen = activeMenuId === member.id;

          return (
            <div
              key={member.id}
              className="
                grid
                grid-cols-12
                items-center
                px-6
                py-4
                transition-colors
                duration-150
                hover:bg-white/[0.03]
              "
            >
              {/* User Identity (Clickable to detail page) */}
              <div
                onClick={() => navigate(`/members/${member.id}`)}
                className="col-span-4 flex items-center gap-3.5 cursor-pointer group"
              >
                <div
                  className="
                    flex
                    size-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-panel
                    border
                    border-primary/30
                    bg-gradient-to-br
                    from-primary/25
                    to-primary/5
                    text-xs
                    font-bold
                    text-white
                    shadow-sm
                    transition-all
                    group-hover:border-primary
                    group-hover:shadow-brandGlow
                  "
                >
                  {(member.firstName?.[0] || 'U').toUpperCase()}
                  {(member.lastName?.[0] || '').toUpperCase()}
                </div>

                <div className="truncate">
                  <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                    {member.firstName} {member.lastName}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">{member.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="col-span-2">
                <RoleBadge role={member.role as any} />
              </div>

              {/* Contact */}
              <div className="col-span-3">
                <p className="text-sm text-slate-300">
                  {member.phoneNumber || (
                    <span className="text-slate-500 italic">None</span>
                  )}
                </p>
              </div>

              {/* Status */}
              <div className="col-span-1">
                <StatusBadge active={member.isActive} />
              </div>

              {/* Joined */}
              <div className="col-span-1">
                <p className="text-xs text-slate-400">
                  {moment(member.createdAt).format('MMM DD, YYYY')}
                </p>
              </div>

              {/* Action Dropdown Menu */}
              <div className="col-span-1 relative flex justify-end">
                <button
                  aria-label="Actions"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(isMenuOpen ? null : member.id);
                  }}
                  className="
                    flex
                    size-8
                    items-center
                    justify-center
                    rounded-button
                    text-slate-400
                    transition-all
                    hover:border
                    hover:border-white/10
                    hover:bg-white/[0.08]
                    hover:text-white
                  "
                >
                  <MoreVertical className="size-4" />
                </button>

                {isMenuOpen && (
                  <div
                    ref={menuRef}
                    className="
                      absolute right-0 top-10 z-50
                      min-w-[160px]
                      rounded-panel
                      border border-white/[0.12]
                      bg-surface-850/95
                      p-1.5
                      shadow-panel
                      backdrop-blur-2xl
                      animate-in fade-in-80 zoom-in-95
                    "
                  >
                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        navigate(`/members/${member.id}`);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-button px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white"
                    >
                      <ExternalLink className="size-3.5 text-slate-400" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        navigate(`/members/${member.id}/edit`);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-button px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white"
                    >
                      <Edit2 className="size-3.5 text-slate-400" />
                      <span>Edit Member</span>
                    </button>

                    <button
                      disabled={deleting}
                      onClick={() => handleDelete(member.id, `${member.firstName} ${member.lastName}`)}
                      className="flex w-full items-center gap-2.5 rounded-button px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete User</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Footer / Pagination */}
      <div className="flex flex-col gap-3 border-t border-white/[0.07] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-400">
          Showing <span className="font-medium text-slate-200">{(meta?.page ?? 1 - 1) * (meta?.limit ?? 10) + 1}</span>–
          <span className="font-medium text-slate-200">{Math.min((meta?.page ?? 1) * (meta?.limit ?? 10), meta?.total ?? 0)}</span> of{' '}
          <span className="font-medium text-slate-200">{meta?.total ?? 0}</span> members
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={(meta?.page ?? 1) <= 1}
            onClick={() => onPageChange((meta?.page ?? 1) - 1)}
            className="
              h-8.5
              rounded-button
              border
              border-white/[0.09]
              bg-surface-800
              px-3
              text-xs
              font-medium
              text-slate-300
              transition-colors
              hover:bg-surface-750
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Previous
          </button>

          <span className="flex h-8.5 items-center rounded-button bg-primary px-3 text-xs font-bold text-white shadow-brandGlow">
            {meta?.page ?? 1}
          </span>

          <button
            disabled={(meta?.page ?? 1) >= (meta?.totalPages ?? 1)}
            onClick={() => onPageChange((meta?.page ?? 1) + 1)}
            className="
              h-8.5
              rounded-button
              border
              border-white/[0.09]
              bg-surface-800
              px-3
              text-xs
              font-medium
              text-slate-300
              transition-colors
              hover:bg-surface-750
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
