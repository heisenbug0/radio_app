interface CustomIconsProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
}

interface MeetingTypesProps {
  id: number;
  label: string;
  icon: any;
  bgColor: string;
  description: string;
  type: string;
  route: string;
}
interface ScheduleMeetingProps {
  date: Date;
  description: string;
}

export interface ChatCustomEvent {
  custom: {
    type?: string;
    message?: string;
    messageId?: string;
    userId?: string;
    userName?: string;
    userImage?: string;
    timestamp?: string | number | Date;
    // [key?: string]?: string | number | Date | undefined;
  };
  user?: {
    id?: string;
    name?: string;
    image?: string;
  };
}