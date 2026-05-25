import MemberForm from "@/features/member/components/MemberForm";

export default function CreateMemberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Create User
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Add players, referees,
          members or admins to
          the system.
        </p>
      </div>

      <MemberForm mode="create" />
    </div>
  );
}