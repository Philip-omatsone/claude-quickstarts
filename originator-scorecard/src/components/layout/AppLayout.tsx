import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Sidebar from './Sidebar';
import ClaudeAssistant from '../ClaudeAssistant';
import ApiKeyBanner from '../ApiKeyBanner';

export default function AppLayout() {
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto relative flex flex-col">
        <ApiKeyBanner />
        <div className="p-6 max-w-[1400px] mx-auto flex-1 w-full">
          <Outlet />
        </div>
        <button
          onClick={() => setShowAssistant(true)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-accent text-white rounded-full shadow-lg hover:bg-accent-hover transition-colors flex items-center justify-center z-40"
          title="Ask Claude"
        >
          <MessageCircle size={20} />
        </button>
        {showAssistant && <ClaudeAssistant onClose={() => setShowAssistant(false)} />}
        <footer className="border-t border-border/40 bg-muted/30 px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <span>Originator Scorecard v{__APP_VERSION__}</span>
          <span>Built: {new Date(__BUILD_TIME__).toLocaleString()}</span>
        </footer>
      </main>
    </div>
  );
}
