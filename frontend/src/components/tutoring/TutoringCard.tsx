import { StarIcon } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { TutoringListing } from '../../types/tutoring';

interface TutoringCardProps {
  listing: TutoringListing;
  onContactClick: (listing: TutoringListing) => void;
}

export function TutoringCard({ listing, onContactClick }: TutoringCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={listing.tutor.avatarUrl}
              alt={listing.tutor.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold">{listing.title}</h3>
              <p className="text-gray-600">{listing.tutor.name}</p>
              <div className="flex items-center mt-1">
                <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="font-medium">{listing.tutor.rating}</span>
                <span className="text-gray-500 text-sm ml-1">
                  ({listing.tutor.totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">₹{listing.hourlyRate}</p>
            <p className="text-sm text-gray-500">per hour</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-600">{listing.description}</p>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Subjects</h4>
          <div className="flex flex-wrap gap-2">
            {listing.subjects.map((subject) => (
              <Badge
                key={subject.id}
                variant="secondary"
                className="flex items-center space-x-1 px-3 py-1"
              >
                <img
                  src={subject.iconUrl}
                  alt={subject.name}
                  className="w-4 h-4"
                />
                <span>{subject.name}</span>
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Syllabus Highlights</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            {listing.syllabus.slice(0, 3).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Availability</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
            {listing.availability.map((time, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>{time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => onContactClick(listing)}
            className="w-full"
            size="lg"
          >
            Contact Tutor
          </Button>
        </div>
      </div>
    </Card>
  );
}
