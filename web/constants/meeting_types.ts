import CreateIcon from "@/components/icons/Create";
import EventDateIcon from "@/components/icons/EventDate";
import UserPlusIcon from "@/components/icons/UserPlus";
import VideoIcon from "@/components/icons/Video";
import { MeetingTypesProps } from "@/custom-type";

export const meeting_types: MeetingTypesProps[] = [
  {
    id: 1,
    label: "new meeting",
    icon: CreateIcon,
    bgColor: "#FF742E",
    description: "Start an instant meeting",
    type: "instant",
    route: "",
  },
  {
    id: 2,
    label: "join meeting",
    icon: UserPlusIcon,
    bgColor: "#0E78F9",
    description: "Via invitation link",
    type: "join",
    route: "",
  },
  {
    id: 3,
    label: "schedule meeting",
    icon: EventDateIcon,
    bgColor: "#830EF9",
    description: "Plan your meeting",
    type: "schedule",
    route: "",
  },
  {
    id: 4,
    label: "view recordings",
    icon: VideoIcon,
    bgColor: "#F9A90E",
    description: "Meeting recordings",
    type: "view",
    route: "/recordings",
  },
];
