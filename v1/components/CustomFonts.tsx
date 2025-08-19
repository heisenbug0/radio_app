import { Global } from "@mantine/core";

export default function CustomFonts() {
  return (
    <Global
      styles={[
        {
          "@font-face": {
            fontFamily: "manrope-bold",
            src: `url("/font/Manrope-Bold.ttf")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "manrope-extrabold",
            src: `url("/font/Manrope-ExtraBold.ttf")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "manrope-extralight",
            src: `url("/font/Manrope-ExtraLight.ttf")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "manrope-light",
            src: `url("/font/Manrope-Light.ttf")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "Manrope-medium",
            src: `url("/font/Manrope-Medium.ttf")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "Manrope-regular",
            src: `url("/font/Manrope-Regular.ttf")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "Manrope-semibold",
            src: `url("/font/Manrope-SemiBold.ttf")`,
          },
        },
      ]}
    />
  );
}
