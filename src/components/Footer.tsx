export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="font-bold text-lg">🌏 WorkerVoice</h3>
            <p className="text-gray-400 text-sm">
              Helping migrant workers find safe workplaces
            </p>
          </div>
          <div className="text-gray-400 text-sm">
            <p>Thailand 🇹🇭 & Malaysia 🇲🇾</p>
            <p className="mt-1">© 2026 Migrant Review Platform</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
