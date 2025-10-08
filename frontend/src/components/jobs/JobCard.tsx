import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { JobPosting } from '../../types/jobs';
import { MapPin, Building2, Clock, DollarSign, Calendar } from 'lucide-react';

interface JobCardProps {
  job: JobPosting;
  onApply?: (jobId: string) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const formatSalary = (salary: JobPosting['salary']) => {
    if (!salary) return 'Salary not disclosed';

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const min = formatter.format(salary.min);
    const max = formatter.format(salary.max);
    const period = salary.period === 'hourly' ? '/hr' : salary.period === 'monthly' ? '/mo' : '/yr';

    return `${min} - ${max}${period}`;
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;

    const date = new Date(deadline);
    const now = new Date();
    const daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Today';
    if (daysLeft === 1) return '1 day left';
    return `${daysLeft} days left`;
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType) {
      case 'Full-time':
        return 'bg-blue-100 text-blue-800';
      case 'Part-time':
        return 'bg-green-100 text-green-800';
      case 'Internship':
        return 'bg-purple-100 text-purple-800';
      case 'Contract':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(job.id);
    } else if (job.applicationUrl) {
      window.open(job.applicationUrl, '_blank');
    }
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            {job.company.logo && (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-12 h-12 object-contain rounded"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/48x48/e2e8f0/1e293b?text=' + job.company.name.charAt(0);
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">{job.title}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {job.company.name}
              </p>
            </div>
          </div>
          <Badge className={getJobTypeColor(job.jobType)}>
            {job.jobType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
            <Badge variant="outline" className="text-xs">
              {job.locationType}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 flex-shrink-0" />
            <span>{formatSalary(job.salary)}</span>
          </div>

          {job.applicationDeadline && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{formatDeadline(job.applicationDeadline)}</span>
            </div>
          )}

          <p className="text-sm text-gray-600 line-clamp-2 mt-3">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{job.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
          <Button onClick={handleApply} size="sm">
            Apply Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

