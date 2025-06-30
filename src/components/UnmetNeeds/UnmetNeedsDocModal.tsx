
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UnmetNeedsDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  unmetNeedId: number;
  unmetNeedTitle?: string;
}

export const UnmetNeedsDocModal: React.FC<UnmetNeedsDocModalProps> = ({
  isOpen,
  onClose,
  unmetNeedId,
  unmetNeedTitle
}) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && unmetNeedId) {
      fetchDocContent();
    }
  }, [isOpen, unmetNeedId]);

  const fetchDocContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching document content for ID:', unmetNeedId);
      
      const { data, error } = await supabase
        .from('UnmetNeeds_docu')
        .select('contenido_UN')
        .eq('ID_NUM_DD', unmetNeedId)
        .single();

      if (error) {
        console.error('Error fetching document:', error);
        setError('No se pudo cargar el documento');
        return;
      }

      if (data?.contenido_UN) {
        setContent(data.contenido_UN);
      } else {
        setError('No se encontró contenido para este documento');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar el documento');
    } finally {
      setLoading(false);
    }
  };

  // Simple markdown to HTML converter for basic formatting
  const convertMarkdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
      .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>')
      .replace(/<p class="mb-4"><\/p>/g, '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Documentación - {unmetNeedTitle || 'Unmet Need'}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Cargando documento...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 text-red-600">
              {error}
            </div>
          ) : (
            <ScrollArea className="h-[60vh] w-full">
              <div 
                className="prose prose-sm max-w-none p-4"
                dangerouslySetInnerHTML={{ 
                  __html: convertMarkdownToHtml(content) 
                }}
              />
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
