import MemberEditForm from "@/features/member/components/MemberEditForm";


export default function EditMemberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Edit User
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Update user information
          and permissions.
        </p>
      </div>

      <MemberEditForm />
    </div>
  );
}