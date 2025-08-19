import { createStyles, getStylesRef } from "@mantine/core";

export const useLocalStyles = createStyles(() => ({
  controls: {
    ref: getStylesRef("controls"),
    transition: "opacity 150ms ease",
    opacity: 0,
  },

  root: {
    "&:hover": {
      [`& .${getStylesRef("controls")}`]: {
        opacity: 1,
      },
    },
  },
}));

export const inputStyle = {
  boxShadow: "inset 0 0 10px #eee !important",
};
