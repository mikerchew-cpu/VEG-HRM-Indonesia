import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-charcoal tracking-tight">
            VEG HRM
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Indonesia — Mining Industry
          </p>
        </div>

        <LoginForm />

        <p className="mt-8 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} VEG HRM Indonesia
        </p>
      </div>
    </div>
  );
}
