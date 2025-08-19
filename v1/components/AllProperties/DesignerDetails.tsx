import {
  Paper,
  Box,
  Divider,
  Group,
  Button,
  Text,
  ActionIcon,
} from "@mantine/core";
import {
  IconPhoneCalling,
  IconMail,
  IconThumbUp,
  IconEye,
  IconEyeOff,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

export default function DesignerDetails({ data }: { data: PropertyProps }) {
  const [show, setShow] = useState<boolean>(false);

  function maskedNumber(phoneNumber: string) {
    // Define the number of digits to hide
    const digitsToHide = 6;
    // Extract the last part of the phone number
    const lastDigits = phoneNumber?.slice(-digitsToHide);
    // Replace the last digits with asterisks
    const hiddenPart = "*".repeat(digitsToHide);
    // Construct the masked phone number
    return phoneNumber?.replace(lastDigits, hiddenPart);
  }

  return (
    <Paper withBorder radius={8} className="w-full md:w-[349px] h-fit bg-white">
      <Box className="w-full p-5">
        <Box className="flex space-x-4 items-center">
          <Box
            w={100}
            h={100}
            className="rounded-full bg-white relative overflow-hidden"
          >
            <Image
              src="/cool_kid.jpg"
              alt="card property image"
              fill
              sizes="(min-width: 808px) 50vw, 100vw"
              priority
            />
          </Box>
          <Box className="flex-1">
            <Text
              fz={16}
              fw={500}
              mb={8}
              className="font-manrope-medium capitalize"
            >
              {data?.customer_name}
            </Text>
            <Text fz={14} fw={400} className="font-manrope-regular">
              {data?.address}
            </Text>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box className="w-full p-5">
        <Group spacing={16} mb={18}>
          <Paper
            withBorder
            radius={8}
            p={7}
            color="red"
            className="flex items-center justify-center "
          >
            <IconPhoneCalling size={24} className="text-primary-700" />
          </Paper>
          {!show && (
            <Box>
              <Text
                fz={14}
                fw={600}
                tt="capitalize"
                className="font-manrope-semibold"
              >
                call
              </Text>
              <Group>
                <Text
                  fz={14}
                  fw={500}
                  tt="capitalize"
                  className="font-manrope-medium"
                >
                  {maskedNumber(data?.mobile)}
                </Text>
                <ActionIcon
                  onClick={() => setShow((o) => !o)}
                  variant="transparent"
                  title="view"
                >
                  <IconEye size={20} />
                </ActionIcon>
              </Group>
            </Box>
          )}
          {show && (
            <Box>
              <Text
                fz={14}
                fw={600}
                tt="capitalize"
                className="font-manrope-semibold"
              >
                call
              </Text>

              <Group>
                <a
                  href={`tel:${data?.mobile}`}
                  className="no-underline text-black"
                >
                  <Text
                    fz={14}
                    fw={500}
                    tt="capitalize"
                    className="font-manrope-medium"
                  >
                    {data?.mobile}
                  </Text>
                </a>

                <ActionIcon
                  onClick={() => setShow((o) => !o)}
                  variant="transparent"
                  title="hide"
                >
                  <IconEyeOff size={20} />
                </ActionIcon>
              </Group>
            </Box>
          )}
        </Group>
        <a
          href={`https://wa.me/${data?.mobile}?text=Hello! I am interested in one of your listed properties. Can we discuss further?`}
          target="_blank"
          rel="noreferrer"
          className="no-underline "
        >
          <Button
            fullWidth
            className="text-white bg-primary-700 rounded-md font-manrope-regular text-sm font-normal hover:bg-primary-700 "
            leftIcon={<IconBrandWhatsapp size={30} className="text-white" />}
          >
            Send a WhatsApp Message
          </Button>
        </a>
      </Box>
    </Paper>
  );
}
