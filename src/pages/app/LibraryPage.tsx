import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Library } from 'lucide-react';

export const LibraryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary-accent">Phase 1 Placeholder</Badge>
            <span className="text-xs text-[#8B94A3]">Route: /app/library</span>
          </div>
          <h1 className="font-display text-3xl text-[#F4F5F7]">Resource Library</h1>
        </div>
      </div>
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Library className="w-5 h-5 text-[#B9A7FF]" />
            <span>Learning Resources & Reference Library</span>
          </CardTitle>
          <CardDescription>
            Saved doubts, AI cheat-sheets, notes, and topic documentation.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
