export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="card-3d bg-white/5 backdrop-blur-md rounded-2xl p-12 text-center border border-white/10">
        <div className="text-7xl mb-4 text-purple-400">🔗</div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-gray-400">Short link not found</p>
      </div>
    </div>
  );
}
