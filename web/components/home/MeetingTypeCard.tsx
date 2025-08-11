import { Box, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InstantMeeting from "../modal/InstantMeeting";
import ScheduleMeeting from "../modal/CreateMeeting";
import JoinMeeting from "../modal/JoinMeeting";
import { MeetingTypesProps } from "@/custom-type";

const MeetingTypeCard = ({ data }: { data: MeetingTypesProps }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isInstant, setIsInstant] = useState<boolean>(false);
  const [isJoin, setIsJoin] = useState<boolean>(false);
  const router = useRouter();

  return (
    <>
      <Box
        onClick={() => {
          switch (data.type) {
            case "instant":
              setIsInstant(true);
              break;
            case "join":
              setIsJoin(true);
              break;
            case "schedule":
              open();
              break;
            case "view":
              router.push(data.route);
              break;

            default:
              break;
          }
        }}
        style={{ backgroundColor: data.bgColor }}
        className="h-[260px] w-full rounded-[14px] p-6 flex flex-col justify-between cursor-pointer "
      >
        <Box
          w={56}
          h={56}
          className="rounded-[10px] flex items-center justify-center"
          bg="light_colors.3"
        >
          <data.icon />
        </Box>
        <Box>
          <Text
            fz={20}
            c="light_colors.0"
            tt="capitalize"
            fw={700}
            ff="Nunito_sans_bold"
          >
            {data.label}
          </Text>
          <Text fz={16} c="light_colors.2" fw={400} ff="Nunito_sans_regular">
            {data.description}
          </Text>
        </Box>
      </Box>
      <ScheduleMeeting show={opened} hide={close} />
      <InstantMeeting show={isInstant} hide={setIsInstant} />
      <JoinMeeting openJoin={isJoin} hideJoin={setIsJoin} />
    </>
  );
};

export default MeetingTypeCard;
