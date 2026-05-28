import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left — Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-tiffany flex-col justify-between p-12 text-white">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">VEG HRM</h1>
          <p className="text-tiffany-light mt-1 text-sm">Indonesia Mining Industry</p>
        </div>
        <blockquote className="max-w-md">
          <p className="text-lg leading-relaxed text-white/90 italic">
            "Mengelola SDM tambang dari pit hingga kantor pusat — patuh regulasi, akurat, dan terintegrasi."
          </p>
          <footer className="mt-3 text-sm text-white/60">— VEG HRM Indonesia</footer>
        </blockquote>
        <div className="text-sm text-white/50">
          &copy; {new Date().getFullYear()} VEG HRM Indonesia
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold text-charcoal">VEG HRM</h1>
            <p className="text-gray-500 text-sm mt-1">Indonesia Mining Industry</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
