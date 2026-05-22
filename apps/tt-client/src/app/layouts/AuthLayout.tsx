import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div
      className="
      gradient-page
      relative
      flex
      min-h-screen
      items-center
      justify-center
      overflow-hidden
      px-4
    "
    >
      {/* background blur orbs */}
      <div
        className="
        absolute
        left-[-100px]
        top-[-100px]
        h-[300px]
        w-[300px]
        rounded-full
        bg-fuchsia-500/20
        blur-[100px]
      "
      />

      <div
        className="
        absolute
        bottom-[-100px]
        right-[-100px]
        h-[300px]
        w-[300px]
        rounded-full
        bg-cyan-500/20
        blur-[100px]
      "
      />

      <div className="relative z-10 w-full">
        <Outlet />
      </div>
    </div>
  );
}