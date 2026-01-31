import React from 'react';
import { ExternalLink, Phone, MapPin, Clock } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';

interface ResourceCardProps {
  id: string;
  title: string;
  description?: string;
  type: 'link' | 'phone' | 'location' | 'info';
  url?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  title,
  description,
  type,
  url,
  phone,
  address,
  hours,
}) => {
  const { logEvent } = useEvents();

  const handleClick = () => {
    logEvent('resource_clicked', {
      resource_id: id,
      resource_type: type,
    });
  };

  const renderIcon = () => {
    switch (type) {
      case 'link':
        return <ExternalLink className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getHref = () => {
    if (url) return url;
    if (phone) return `tel:${phone}`;
    return '#';
  };

  return (
    <a
      href={getHref()}
      target={type === 'link' ? '_blank' : undefined}
      rel={type === 'link' ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-violet-500/20 text-violet-300 group-hover:bg-violet-500/30 transition-colors">
          {renderIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white group-hover:text-violet-200 transition-colors">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{description}</p>
          )}
          {phone && (
            <p className="text-sm text-emerald-400 mt-1">{phone}</p>
          )}
          {address && (
            <p className="text-sm text-slate-400 mt-1">{address}</p>
          )}
          {hours && (
            <p className="text-xs text-slate-500 mt-1">{hours}</p>
          )}
        </div>
      </div>
    </a>
  );
};
