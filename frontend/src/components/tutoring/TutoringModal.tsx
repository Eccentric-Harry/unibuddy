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
import { GraduationCap, Plus, X } from 'lucide-react';

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

    // Filter out empty syllabus and availability entries
    const filteredData = {
      ...formData,
      syllabus: formData.syllabus.filter(item => item.trim() !== ''),
      availability: formData.availability.filter(item => item.trim() !== ''),
    };

    onSubmit(filteredData);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      title: '',
      description: '',
      subjects: [],
      hourlyRate: 0,
      syllabus: ['', '', ''],
      availability: ['', '', ''],
    });
    setNewSubject('');
    onClose();
  };

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
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

  const addSyllabusField = () => {
    setFormData({
      ...formData,
      syllabus: [...formData.syllabus, ''],
    });
  };

  const addAvailabilityField = () => {
    setFormData({
      ...formData,
      availability: [...formData.availability, ''],
    });
  };

  const removeSyllabusField = (index: number) => {
    if (formData.syllabus.length > 1) {
      setFormData({
        ...formData,
        syllabus: formData.syllabus.filter((_, i) => i !== index),
      });
    }
  };

  const removeAvailabilityField = (index: number) => {
    if (formData.availability.length > 1) {
      setFormData({
        ...formData,
        availability: formData.availability.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2 text-xl">
                <GraduationCap className="w-6 h-6 text-primary" />
                Offer Tutoring
              </div>
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-1">
            Share your expertise and help fellow students succeed
          </p>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Python Programming & Data Structures"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="h-9"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your expertise and what students can expect..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Subjects */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Subjects <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a subject (e.g., Python)"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSubject();
                    }
                  }}
                  className="h-9"
                />
                <Button type="button" onClick={addSubject} size="sm" className="px-3">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                    >
                      <span>{subject}</span>
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hourly Rate */}
            <div className="space-y-1.5">
              <Label htmlFor="hourlyRate" className="text-sm font-medium">
                Hourly Rate (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="50"
                placeholder="e.g., 250"
                value={formData.hourlyRate || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hourlyRate: parseInt(e.target.value) || 0,
                  })
                }
                required
                className="h-9"
              />
            </div>

            {/* Syllabus */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Syllabus (Key Topics) <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addSyllabusField}
                  className="h-7 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Topic
                </Button>
              </div>
              <div className="space-y-2">
                {formData.syllabus.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Topic ${index + 1}`}
                      value={item}
                      onChange={(e) => updateSyllabus(index, e.target.value)}
                      className="h-9"
                    />
                    {formData.syllabus.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSyllabusField(index)}
                        className="px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Availability <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addAvailabilityField}
                  className="h-7 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Slot
                </Button>
              </div>
              <div className="space-y-2">
                {formData.availability.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Monday: 2 PM - 6 PM"
                      value={item}
                      onChange={(e) => updateAvailability(index, e.target.value)}
                      className="h-9"
                    />
                    {formData.availability.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAvailabilityField(index)}
                        className="px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose} size="sm">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            size="sm"
            disabled={
              !formData.title ||
              !formData.description ||
              formData.subjects.length === 0 ||
              !formData.hourlyRate ||
              formData.syllabus.filter(s => s.trim()).length === 0 ||
              formData.availability.filter(a => a.trim()).length === 0
            }
          >
            Create Listing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

