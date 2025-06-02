import React from 'react';
import Button from '../ui/Button';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionText?: string;
  actionIcon?: React.ReactNode;
  onActionClick?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actionText,
  actionIcon,
  onActionClick,
}) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </div>
      {actionText && onActionClick && (
        <div className="mt-4 md:mt-0">
          <Button 
            variant="primary" 
            onClick={onActionClick} 
            rightIcon={actionIcon}
          >
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PageHeader;