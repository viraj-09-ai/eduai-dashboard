import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center mb-8">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">

        <span className="text-gray-400">
          {user?.name} ({user?.role})
        </span>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>
  );
}