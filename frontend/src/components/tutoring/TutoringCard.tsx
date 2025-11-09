import type { TutoringListing } from '../../types/tutoring';
import { Button } from '../ui/button';
import { Clock, DollarSign, BookOpen } from 'lucide-react';

interface TutoringCardProps {
  listing: TutoringListing;
  onContactClick: (listing: TutoringListing) => void;
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2); // Take first 2 initials
};

// Helper function to generate a consistent color based on name
const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];

  // Generate a consistent index based on the name
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export function TutoringCard({ listing, onContactClick }: TutoringCardProps) {
  const initials = getInitials(listing.tutor.name);
  const avatarColor = getAvatarColor(listing.tutor.name);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tutor Info */}
        <div className="flex items-start gap-4 md:w-1/3">
          {/* Avatar with Initials */}
          <div className={`flex-shrink-0 w-16 h-16 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-xl`}>
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 truncate">
              {listing.tutor.name}
            </h3>

            {listing.tutor.year && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Year {listing.tutor.year}
                {listing.tutor.major && ` • ${listing.tutor.major}`}
              </p>
            )}

            {listing.tutor.collegeName && (
              <p className="text-xs text-slate-500 dark:text-slate-500 truncate">
                {listing.tutor.collegeName}
              </p>
            )}
          </div>
        </div>

        {/* Listing Details */}
        <div className="flex-1 md:w-2/3">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {listing.title}
            </h2>
            <div className="flex items-center gap-1 text-primary font-bold text-lg flex-shrink-0">
              <DollarSign className="w-5 h-5" />
              ₹{listing.hourlyRate}/hr
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
            {listing.description}
          </p>

          {/* Subjects */}
          {listing.subjects && listing.subjects.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {listing.subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                  >
                    {subject.iconUrl && (
                      <img
                        src={subject.iconUrl}
                        alt={subject.name}
                        className="w-4 h-4"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <span className="font-medium">{subject.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Syllabus */}
          {listing.syllabus && listing.syllabus.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                <BookOpen className="w-4 h-4" />
                Topics Covered
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-slate-600 dark:text-slate-400">
                {listing.syllabus.slice(0, 4).map((topic, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="line-clamp-1">{topic}</span>
                  </li>
                ))}
              </ul>
              {listing.syllabus.length > 4 && (
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  +{listing.syllabus.length - 4} more topics
                </p>
              )}
            </div>
          )}

          {/* Availability */}
          {listing.availability && listing.availability.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                <Clock className="w-4 h-4" />
                Availability
              </div>
              <div className="flex flex-wrap gap-2">
                {listing.availability.slice(0, 3).map((slot, index) => (
                  <span
                    key={index}
                    className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded px-2 py-1"
                  >
                    {slot}
                  </span>
                ))}
                {listing.availability.length > 3 && (
                  <span className="text-xs text-slate-500 dark:text-slate-500 px-2 py-1">
                    +{listing.availability.length - 3} more slots
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  listing.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : listing.status === 'BOOKED'
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {listing.status}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                Listed {new Date(listing.createdAt).toLocaleDateString()}
              </span>
            </div>

            <Button
              onClick={() => onContactClick(listing)}
              size="sm"
              disabled={listing.status !== 'ACTIVE'}
            >
              Contact Tutor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

