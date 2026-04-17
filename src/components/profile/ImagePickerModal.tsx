'use client';

import { useState, useCallback } from 'react';
import { Modal } from '@/components/ui/modal';
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
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <Tabs defaultValue="upload" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="size-4" /> Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2">
            <LinkIcon className="size-4" /> By URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all min-h-[240px]",
              dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 bg-muted/30",
              preview && "p-4"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button variant="destructive" size="sm" onClick={() => { setPreview(null); setSelectedFile(null); }}>
                    <X className="size-4 mr-2" /> Remove
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Camera className="size-8 text-primary" />
                </div>
                <p className="text-sm font-bold tracking-tight mb-1">Drag & drop your image here</p>
                <p className="text-xs text-muted-foreground mb-4 text-center px-4">
                  SVG, PNG, JPG or GIF (max. 5MB)
                </p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  <Button variant="outline" size="sm" asChild>
                    <span>Browse Files</span>
                  </Button>
                </label>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold tracking-tight">Image URL</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1"
              />
            </div>
            {imageUrl && (
              <div className="mt-4 rounded-lg overflow-hidden border border-border aspect-video bg-muted/20">
                <img 
                  src={imageUrl} 
                  alt="URL Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL')}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleApply} 
            disabled={activeTab === 'upload' ? !selectedFile : !imageUrl}
            className="px-8"
          >
            <Check className="size-4 mr-2" /> Apply Image
          </Button>
        </div>
      </Tabs>
    </Modal>
  );
}
