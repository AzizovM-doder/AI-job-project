'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Info } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const SUGGESTIONS = [
  { id: 1, name: "Google Cloud", industry: "Cloud Computing", avatar: "G" },
  { id: 2, name: "Aziz Rahimov", industry: "Software Engineer", avatar: "A" },
  { id: 3, name: "Next.js Group", industry: "Technology", avatar: "N" },
];

export default function FeedSuggestionsCard() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <Card className="shadow-sm border-gray-200 bg-white rounded-xl overflow-hidden mt-1">
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-[14px] font-bold text-gray-900">Add to your feed</CardTitle>
        <Info className="size-3.5 text-gray-400 cursor-help" />
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-4 flex flex-col gap-5">
        {SUGGESTIONS.length > 0 ? (
          SUGGESTIONS.map((item) => (
            <div key={item.id} className="flex gap-2.5 items-start">
              <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs text-center shrink-0 border border-gray-100 overflow-hidden">
                {item.avatar}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[14px] font-bold text-gray-900 truncate leading-tight">{item.name}</p>
                <p className="text-[11px] text-gray-500 font-medium line-clamp-1 mt-0.5">{item.industry}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 h-7 rounded-full border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-900 font-bold text-xs px-4"
                >
                  <Plus className="size-3.5 mr-1" /> Follow
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[12px] text-gray-500 text-center py-4 italic font-medium">
            No suggestions available at the moment.
          </p>
        )}

        <button className="text-[14px] font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all mt-2 w-full text-left p-2 rounded-lg -ml-2">
          View all recommendations →
        </button>
      </CardContent>
    </Card>
  );
}
