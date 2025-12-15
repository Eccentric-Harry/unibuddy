import { Dialog, DialogContent } from './dialog';

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export function ImageViewer({ isOpen, onClose, imageUrl, alt }: ImageViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
        <img
          src={imageUrl}
          alt={alt || 'Full size image'}
          className="w-full h-full object-contain"
          onClick={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}