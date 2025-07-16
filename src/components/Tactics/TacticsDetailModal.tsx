
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Presentation, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TacticsDetailModalProps {
  tactic: any;
  isOpen: boolean;
  onClose: () => void;
}

export const TacticsDetailModal: React.FC<TacticsDetailModalProps> = ({
  tactic,
  isOpen,
  onClose
}) => {
  if (!tactic) return null;

  const getFormatColor = (format: string) => {
    switch (format?.toLowerCase()) {
      case 'programa':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'webinar':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'podcast':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'documento':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleOpenUrl = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Simple function to convert basic Markdown to readable text
  const renderMarkdownAsText = (markdown: string) => {
    if (!markdown) return '';
    
    // Replace markdown syntax with HTML-like structure for better readability
    let text = markdown
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Bold and italic
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^- (.+)$/gm, '• $1')
      .replace(/^\d+\. (.+)$/gm, '$&')
      // Line breaks
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

    return text;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-xl font-semibold">
                {tactic.unmet_need}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getFormatColor(tactic.formato)}>
                  {tactic.formato}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Laboratorio</h4>
                <p className="text-gray-600 dark:text-gray-400">{tactic.laboratorio}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Área Terapéutica</h4>
                <p className="text-gray-600 dark:text-gray-400">{tactic.area_terapeutica}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Fármaco</h4>
                <p className="text-gray-600 dark:text-gray-400">{tactic.farmaco}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Molécula</h4>
                <p className="text-gray-600 dark:text-gray-400">{tactic.molecula}</p>
              </div>
            </div>

            {/* Text Documentation */}
            {tactic.text_docs && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Documentación</h4>
                <div 
                  className="prose prose-sm max-w-none bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdownAsText(tactic.text_docs) 
                  }}
                  style={{
                    lineHeight: '1.6',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              {tactic.URL_docs && (
                <Button
                  onClick={() => handleOpenUrl(tactic.URL_docs)}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Abrir Documentos
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
              
              {tactic.URL_ppt && (
                <Button
                  variant="outline"
                  onClick={() => handleOpenUrl(tactic.URL_ppt)}
                  className="flex items-center gap-2"
                >
                  <Presentation className="w-4 h-4" />
                  Abrir Presentación
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
