
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateString; // return original if invalid
  }
};

export const formatRelativeTime = (timestamp: number): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - timestamp) / 1000);

  if (seconds < 60) {
    return `just now`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
     return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // For older entries, fallback to absolute date
  return formatDate(new Date(timestamp).toISOString());
};


export const getTaskStatusColor = (status: string): string => {
  switch (status) {
    case 'To Do': return 'bg-gray-400 text-gray-800';
    case 'In Progress': return 'bg-blue-500 text-white';
    case 'Review': return 'bg-yellow-400 text-gray-800';
    case 'Done': return 'bg-green-500 text-white';
    case 'Blocked': return 'bg-red-500 text-white';
    case 'Overdue': return 'bg-orange-500 text-white'; // New style for Overdue
    default: return 'bg-gray-200 text-gray-700';
  }
};

export const getTaskPriorityPill = (priority: string): string => {
    switch (priority) {
        case 'Low': return 'bg-green-100 text-green-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'High': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export const isDueWithinHours = (dateString?: string, hours: number = 48): boolean => {
  if (!dateString) return false;
  try {
    const dueDate = new Date(dateString);
    const now = new Date();
    const thresholdDate = new Date(now.getTime() + hours * 60 * 60 * 1000);
    // Task is due if its due date is after now and before or on the threshold date
    return dueDate > now && dueDate <= thresholdDate;
  } catch (e) {
    return false; // Invalid date string
  }
};
