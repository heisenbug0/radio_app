import { Group, Button, Text } from "@mantine/core";
// {
//   pageInfo, setPageInfo, setRecords;
// }
export default function NextPrevButtons() {
  return (
    <Group spacing={10} position="center" mt={30}>
      <Button
        // onClick={() =>
        //   handle_Next_Prev({
        //     setPageInfo,
        //     setRecords,
        //     link: pageInfo.prev,
        //   })
        // }
        variant="outline"
        className="capitalize border-black text-black font-manrope-semibold  "
      >
        previous
      </Button>
      <Group spacing={3}>
        <Text fz={14} fw={700} className="font-manrope-bold">
          {/* {pageInfo.current} */}
          {Number(1).toLocaleString()}
        </Text>
        <Text fz={13} fw={400} className="font-manrope-regular">
          of
        </Text>
        <Text fz={14} fw={50} className="font-product-regular">
          {/* {pageInfo.last} */} {Number(10000).toLocaleString()}
        </Text>
      </Group>
      <Button
        // onClick={() =>
        //   handle_Next_Prev({
        //     setPageInfo,
        //     setRecords,
        //     link: pageInfo.next,
        //   })
        // }
        variant="outline"
        className="capitalize border-black text-black font-manrope-semibold "
      >
        next
      </Button>
    </Group>
  );
}
