import { Outlet } from 'react-router-dom';
type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <main className="relative min-h-screen bg-appGradient overflow-hidden text-white">
      {/* pink glow */}
      <div
        className="
          absolute
          top-[-100px]
          left-[-100px]
          h-[350px]
          w-[350px]
          rounded-full
          bg-pink-500/30
          blur-[120px]
        "
      />

      {/* blue glow */}
      <div
        className="
          absolute
          bottom-[-100px]
          right-[-100px]
          h-[350px]
          w-[350px]
          rounded-full
          bg-blue-500/30
          blur-[120px]
        "
      />
      <div className="glass-card">hello</div>

      {/* page content */}
      <div className="relative z-10">
        <Outlet />
      </div>
    </main>
  );
}
