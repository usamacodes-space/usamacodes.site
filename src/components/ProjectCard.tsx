import { Cpu, Layout, MessageSquare, QrCode, Ticket } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
    <Card className="group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-2 p-4 sm:p-6 pb-3">
        <div className="p-2.5 sm:p-3 bg-muted rounded-lg border border-border group-hover:border-primary/50 transition-colors shrink-0">
          {getIcon(project.icon)}
        </div>
        <div className="flex gap-1 sm:gap-1.5 flex-wrap justify-end min-w-0 max-w-[70%]">
          {project.tags.map((tag, j) => (
            <Badge key={j} variant="outline" className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 sm:p-6 pt-0">
        <h3 className="font-semibold text-sm sm:text-base mb-1.5 sm:mb-2 text-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed">
          {project.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0 pt-3 border-t border-border/60">
        <span className="text-muted-foreground text-[10px] italic">
          Project demos will be live soon.
        </span>
      </CardFooter>
    </Card>
  );
};
