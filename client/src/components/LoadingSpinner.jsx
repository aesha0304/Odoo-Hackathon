import { cn } from '../utils/cn';

const LoadingSpinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-gray-200 border-t-primary-600',
          sizeClasses[size]
        )}
      />
    </div>
  );
};

export default LoadingSpinner; 