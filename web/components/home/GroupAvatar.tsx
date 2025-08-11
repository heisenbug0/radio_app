"use client";

import { Avatar } from "@mantine/core";

const GroupAvatar = () => {
  return (
    <Avatar.Group>
      <Avatar size={48} color="dark_colors.3" src="/avatars/a1.png" />
      <Avatar size={48} p={0} color="dark_colors.3" src="/avatars/a2.png" />
      <Avatar size={48} p={0} color="dark_colors.3" src="/avatars/a3.png" />
      <Avatar size={48} p={0} color="dark_colors.3" src="/avatars/a4.png" />
      <Avatar
        size={48}
        p={0}
        bg="dark_colors.3"
        color="light_colors.0"
        fz={15}
        ff={"Nunito_sans_medium"}
        fw={500}
      >
        +9
      </Avatar>
    </Avatar.Group>
  );
};

export default GroupAvatar;
