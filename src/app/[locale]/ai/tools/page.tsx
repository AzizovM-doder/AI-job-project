'use client';

import { useAuth } from '@/src/context/AuthContext';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { aiService } from '@/src/services/ai.service';
import { Button } from '@/components/ui/button';
import { Brain, FileSearch, Target, FileText, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function AIToolsPage() {
  const { role } = useAuth();
  const [result, setResult] = useState<string | null>(null);

  const cvMutation = useMutation({
    mutationFn: aiService.analyzeCV,
    onSuccess: (data) => setResult(JSON.stringify(data.data, null, 2)),
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      cvMutation.mutate(file);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-1">
          <div className="flex items-center space-x-2">
            <Brain className="size-8 text-primary animate-pulse" />
            <h1 className="text-3xl font-black terminal-glow uppercase">AI_COPROCESSOR_v4</h1>
          </div>
          <p className="text-xs text-muted-foreground tracking-[0.3em]">ENHANCING HUMAN POTENTIAL VIA NEURAL INTERFACE</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tool 1: CV Analysis */}
          <Card className="border-primary/30 bg-primary/5 hover:border-primary transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <FileSearch className="mr-2 size-4" /> CV_ANALYSIS_ENGINE
              </CardTitle>
              <CardDescription className="text-[10px]">EXTRACT SKILLS AND EXPERIENCE DATA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-dashed border-primary/40 p-8 text-center space-y-4">
                <p className="text-[10px] text-muted-foreground">UPLOAD PDF/DOCX FOR SCANNING</p>
                <input 
                  type="file" 
                  id="cv-upload" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept=".pdf,.docx"
                />
                <Button 
                  onClick={() => document.getElementById('cv-upload')?.click()}
                  variant="outline"
                  className="w-full"
                  disabled={cvMutation.isPending}
                >
                  {cvMutation.isPending ? <Loader2 className="animate-spin" /> : 'UPLOAD_FILE'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tool 2: Skill Gap (Candidate only) */}
          {role === 'Candidate' && (
            <Card className="border-primary/30 bg-primary/5 hover:border-primary transition-all">
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Target className="mr-2 size-4" /> SKILL_GAP_ANALYZER
                </CardTitle>
                <CardDescription className="text-[10px]">COMPARE PROFILE WITH JOB REQUIREMENTS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[10px] text-muted-foreground">SELECT A SAVED VACANCY TO ANALYZE</p>
                <Button variant="outline" className="w-full">INITIALIZE_SCAN</Button>
              </CardContent>
            </Card>
          )}

          {/* Tool 3: Content Gen (Both) */}
          <Card className="border-primary/30 bg-primary/5 hover:border-primary transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Sparkles className="mr-2 size-4" /> NEURAL_DRAFTING_TOOL
              </CardTitle>
              <CardDescription className="text-[10px]">GENERATE COVER LETTERS OR JOB DESCRIPTIONS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                {role === 'Organization' ? 'IMPROVE_JOB_DESC' : 'GENERATE_COVER_LETTER'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Console Result Area */}
        {result && (
          <Card className="border-primary bg-background shadow-lg">
            <CardHeader className="border-b border-primary/20">
              <CardTitle className="text-xs">SYSTEM_OUTPUT</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <pre className="text-[10px] font-mono whitespace-pre-wrap text-primary/80 lowercase">
                {result}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
