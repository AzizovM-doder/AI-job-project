'use client';

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link as LinkIcon, Camera, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: File | string) => void;
  title?: string;
}

export default function ImagePickerModal({ isOpen, onClose, onSelect, title = "Select Image" }: ImagePickerModalProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    if (activeTab === 'upload' && selectedFile) {
      onSelect(selectedFile);
    } else if (activeTab === 'url' && imageUrl) {
      onSelect(imageUrl);
    }
    handleClose();
  };

  const handleClose = () => {
    setPreview(null);
    setSelectedFile(null);
    setImageUrl('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[550px] border-none shadow-2xl bg-background/95 backdrop-blur-xl sm:rounded-lg p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Tabs defaultValue="upload" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="upload" className="gap-2 rounded-lg font-bold">
                <Upload className="size-4" /> Upload
              </TabsTrigger>
              <TabsTrigger value="url" className="gap-2 rounded-lg font-bold">
                <LinkIcon className="size-4" /> By URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 focus-visible:outline-none">
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all min-h-[240px]",
                  dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border/40 hover:border-primary/40 bg-muted/20",
                  preview && "p-4"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden group shadow-lg">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Button variant="destructive" size="sm" className="rounded-full shadow-xl font-bold" onClick={() => { setPreview(null); setSelectedFile(null); }}>
                        <X className="size-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-primary/10 p-5 rounded-full mb-4 ring-1 ring-primary/20">
                      <Camera className="size-8 text-primary" />
                    </div>
                    <p className="text-base font-bold tracking-tight mb-1">Drag & drop your image here</p>
                    <p className="text-xs text-muted-foreground mb-6 text-center px-4 font-medium uppercase tracking-widest opacity-60">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                      />
                      <Button variant="outline" size="sm" className="rounded-xl font-bold px-6 border-border/40" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4 focus-visible:outline-none">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1 block">Image URL</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 bg-muted/30 border-border/10 rounded-xl h-11 px-4 font-medium focus-visible:ring-primary/10"
                  />
                </div>
                {imageUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-border/40 aspect-video bg-muted/20 shadow-inner group">
                    <img 
                      src={imageUrl} 
                      alt="URL Preview" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL')}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="p-6 pt-0 flex flex-row justify-end gap-3">
          <Button variant="ghost" onClick={handleClose} className="rounded-xl font-bold h-11 px-6">
            Cancel
          </Button>
          <Button 
            onClick={handleApply} 
            disabled={activeTab === 'upload' ? !selectedFile : !imageUrl}
            className="rounded-xl font-bold h-11 px-8 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Check className="size-4 mr-2" /> Apply Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
