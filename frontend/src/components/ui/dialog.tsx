import { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: ReactNode;
}

interface DialogTitleProps {
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>
  );
}

export function DialogContent({ children, className = '' }: DialogContentProps) {
  return (
    <div className={`relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4 ${className}`}>
      {children}
    </div>
  );
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return (
    <div className="mb-4">
      {children}
    </div>
  );
}

export function DialogTitle({ children }: DialogTitleProps) {
  return (
    <h2 className="text-lg font-semibold">
      {children}
    </h2>
  );
}
