import { Mail, Phone, Shield, Edit3, Trash2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/ui/button/Button';
import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';
import { useDeleteUser, useRestoreUser } from '@/features/member/graphql/hooks';

interface Props {
  member: any;
  onRefresh?: () => void;
}

export default function MemberProfileCard({ member, onRefresh }: Props) {
  const navigate = useNavigate();
  const [deleteUser, { loading: deleting }] = useDeleteUser();
  const [restoreUser, { loading: restoring }] = useRestoreUser();

  const primaryRole = member.role?.[0]?.toLowerCase() ?? member.role?.toLowerCase() ?? 'member';

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to soft delete ${member.fullName}?`)) {
      await deleteUser({ variables: { id: member.id } });
      onRefresh?.();
      navigate('/members');
    }
  };

  const handleRestore = async () => {
    await restoreUser({ variables: { id: member.id } });
    onRefresh?.();
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div
            className="
              flex size-20 shrink-0
              items-center justify-center
              rounded-panel border border-primary/30
              bg-gradient-to-br from-primary/25 to-primary/5
              text-2xl font-bold text-white shadow-brandGlow
            "
          >
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.fullName}
                className="size-full rounded-panel object-cover"
              />
            ) : (
              `${(member.firstName?.[0] || 'U').toUpperCase()}${(member.lastName?.[0] || '').toUpperCase()}`
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {member.fullName}
              </h1>

              <RoleBadge role={primaryRole} />
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" />
                <span>{member.email}</span>
              </div>

              {member.phoneNumber && (
                <div className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-primary" />
                  <span>{member.phoneNumber}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2.5">
              <StatusBadge active={member.isActive} />

              {member.isEmailVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-badge border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                  <Shield className="size-3" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {member.isDeleted ? (
            <Button
              variant="outline"
              size="md"
              loading={restoring}
              onClick={handleRestore}
              className="gap-2"
            >
              <RotateCcw className="size-4" />
              <span>Restore Account</span>
            </Button>
          ) : (
            <Button
              variant="danger"
              size="md"
              loading={deleting}
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="size-4" />
              <span>Delete</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/members/${member.id}/edit`)}
            className="gap-2"
          >
            <Edit3 className="size-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
