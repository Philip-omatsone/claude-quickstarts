import { useState } from 'react';
import { FileSpreadsheet, FileText, PenLine, Grid3X3 } from 'lucide-react';
import ManualEntryForm from '../components/data-entry/ManualEntryForm';
import BulkEntryForm from '../components/data-entry/BulkEntryForm';
import CsvUploader from '../components/data-entry/CsvUploader';
import PdfUploader from '../components/data-entry/PdfUploader';

type Tab = 'manual' | 'bulk' | 'csv' | 'pdf';

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'manual', label: 'Manual Entry', icon: PenLine },
  { id: 'bulk', label: 'Bulk Entry', icon: Grid3X3 },
  { id: 'csv', label: 'CSV Upload', icon: FileSpreadsheet },
  { id: 'pdf', label: 'PDF Upload', icon: FileText },
];

export default function DataEntryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('manual');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Data Entry</h2>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            style={{ fontFamily: 'var(--font-family-body)' }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        {activeTab === 'manual' && <ManualEntryForm />}
        {activeTab === 'bulk' && <BulkEntryForm />}
        {activeTab === 'csv' && <CsvUploader />}
        {activeTab === 'pdf' && <PdfUploader />}
      </div>
    </div>
  );
}
