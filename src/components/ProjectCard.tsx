import { Cpu, Layout, MessageSquare, QrCode, Ticket } from 'lucide-react';
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const getIcon = (iconName?: string) => {
  const iconProps = { className: 'w-5 h-5 text-primary' };
  switch (iconName) {
    case 'MessageSquare':
      return <MessageSquare {...iconProps} />;
    case 'QrCode':
      return <QrCode {...iconProps} />;
    case 'Ticket':
      return <Ticket {...iconProps} />;
    case 'Layout':
      return <Layout {...iconProps} />;
    default:
      return <Cpu {...iconProps} />;
  }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden" sx={{ '&:hover': { boxShadow: 4, borderColor: 'primary.main' }, border: '1px solid', borderColor: 'rgba(93,112,127,0.4)' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <div className="flex flex-row items-start justify-between gap-2 mb-2">
          <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(93,112,127,0.2)', border: '1px solid rgba(93,112,127,0.4)' }}>
            {getIcon(project.icon)}
          </div>
          <div className="flex gap-1 flex-wrap justify-end min-w-0 max-w-[70%]">
            {project.tags.map((tag, j) => (
              <Chip key={j} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 20 }} />
            ))}
          </div>
        </div>
        <h3 className="font-semibold text-sm sm:text-base mb-1.5 sm:mb-2" style={{ color: '#ecebf3' }}>
          {project.title}
        </h3>
        <p className="text-[11px] sm:text-xs leading-relaxed mb-2" style={{ color: '#b5c1d2' }}>
          {project.description}
        </p>
        <div className="pt-2 border-t" style={{ borderColor: 'rgba(93,112,127,0.4)' }}>
          <span className="text-[10px] italic" style={{ color: '#b5c1d2' }}>
            Project demos will be live soon.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
