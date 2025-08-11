import { Divider } from "@mantine/core";
import classes from "./home.module.css";

const CustomDivider = () => {
  return <Divider classNames={{ root: classes.divider_color }} mb={30} />;
};

export default CustomDivider;
