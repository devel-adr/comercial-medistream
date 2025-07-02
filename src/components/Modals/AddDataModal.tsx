
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DrugDealerForm } from '@/components/Forms/DrugDealerForm';
import { UnmetNeedsForm } from '@/components/Forms/UnmetNeedsForm';

interface AddDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'drugDealer' | 'unmetNeeds';
  onSuccess: () => void;
}

export const AddDataModal: React.FC<AddDataModalProps> = ({ isOpen, onClose, type, onSuccess }) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {type === 'drugDealer' ? 'Agregar Nuevo Medicamento' : 'Agregar Nueva Necesidad No Cubierta'}
          </DialogTitle>
        </DialogHeader>
        
        {type === 'drugDealer' ? (
          <DrugDealerForm onSuccess={handleSuccess} onCancel={onClose} />
        ) : (
          <UnmetNeedsForm onSuccess={handleSuccess} onCancel={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};
