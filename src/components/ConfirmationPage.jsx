import { AlertTriangle } from 'lucide-react';
import ButtonCard from './ButtonCard';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex items-start gap-4">
          <AlertTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-gray-600">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <ButtonCard
            onClick={onClose}
            color="secondary"
            size="medium"
          >
            {cancelText}
          </ButtonCard>
          <ButtonCard
            onClick={onConfirm}
            color="danger"
            size="medium"
          >
            {confirmText}
          </ButtonCard>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;