import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { GraduationCap } from 'lucide-react';

interface TutoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TutoringFormData) => void;
}

export interface TutoringFormData {
  title: string;
  description: string;
  subjects: string[];
  hourlyRate: number;
  syllabus: string[];
  availability: string[];
}

export function TutoringModal({ isOpen, onClose, onSubmit }: TutoringModalProps) {
  const [formData, setFormData] = useState<TutoringFormData>({
    title: '',
    description: '',
    subjects: [],
    hourlyRate: 0,
    syllabus: ['', '', ''],
    availability: ['', '', ''],
  });

  const [newSubject, setNewSubject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addSubject = () => {
    if (newSubject.trim()) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, newSubject.trim()],
      });
      setNewSubject('');
    }
  };

  const removeSubject = (index: number) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index),
    });
  };

  const updateSyllabus = (index: number, value: string) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index] = value;
    setFormData({ ...formData, syllabus: newSyllabus });
  };

  const updateAvailability = (index: number, value: string) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = value;
    setFormData({ ...formData, availability: newAvailability });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              Offer Tutoring
            </div>
          </DialogTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Share your knowledge and help others learn. Fill in the details below
            to create your tutoring listing.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Python Programming & Data Structures"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your teaching experience and what students can expect..."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="h-20"
            />
          </div>

          <div className="space-y-2">
            <Label>Subjects</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a subject..."
                value={newSubject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSubject(e.target.value)}
              />
              <Button type="button" onClick={addSubject}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1"
                >
                  <span>{subject}</span>
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="0"
              step="50"
              value={formData.hourlyRate || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({
                  ...formData,
                  hourlyRate: parseInt(e.target.value) || 0,
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Syllabus (Key Topics)</Label>
            {formData.syllabus.map((item, index) => (
              <Input
                key={index}
                placeholder={`Topic ${index + 1}`}
                value={item}
                onChange={(e) => updateSyllabus(index, e.target.value)}
                required
              />
            ))}
          </div>

          <div className="space-y-2">
            <Label>Availability</Label>
            {formData.availability.map((item, index) => (
              <Input
                key={index}
                placeholder="e.g., Monday: 2 PM - 6 PM"
                value={item}
                onChange={(e) => updateAvailability(index, e.target.value)}
                required
              />
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Listing</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
