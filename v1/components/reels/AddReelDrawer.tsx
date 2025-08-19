import { createStyles, Drawer } from "@mantine/core";
import AddReelForm from "./AddReelForm";

export default function AddReelDrawer({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const { classes } = useStyles();
  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="add reel"
        classNames={{ title: classes.title }}
        size="lg"
      >
        <AddReelForm />
      </Drawer>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  title: {
    textTransform: "capitalize",
    fontFamily: "manrope-bold",
    fontSize: 20,
  },
}));
