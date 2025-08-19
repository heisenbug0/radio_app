import {
  Modal,
  Button,
  Divider,
  Title,
  Box,
  Text,
  NumberInput,
  Select,
} from "@mantine/core";
import { Dispatch, SetStateAction, useRef } from "react";

export default function AreaConverter({
  opened,
  close,
  conversion,
  setConversion,
}: {
  opened: boolean;
  close: () => void;
  conversion: string;
  setConversion: Dispatch<SetStateAction<string>>;
}) {
  const valueRef = useRef<HTMLInputElement>(null);
  const toUnitRef = useRef<HTMLInputElement>(null);
  const fromUnitRef = useRef<HTMLInputElement>(null);

  function handleConvert() {
    if (valueRef?.current && fromUnitRef?.current && toUnitRef?.current) {
      switch (fromUnitRef?.current?.value.toLowerCase()) {
        case "square feet":
          if (toUnitRef.current.value.toLowerCase() == "square meter") {
            const resultInMeter = Number(valueRef.current.value) * 0.0929;
            setConversion(`${resultInMeter.toFixed(4)} Square Meter`);
          } else if (toUnitRef.current.value.toLowerCase() == "acre") {
            const resultInAcre = Number(valueRef.current.value) * 0.0000229568;
            setConversion(`${resultInAcre.toFixed(4)} Acre`);
          } else if (toUnitRef.current.value.toLowerCase() == "hectare") {
            const resultInHectare = Number(valueRef.current.value) * 0.00000929;
            setConversion(`${resultInHectare.toFixed(4)} Hectare`);
          } else
            setConversion(
              `${Number(valueRef.current.value).toFixed(4)} Square Feet`
            );
          break;

        case "square meter":
          if (toUnitRef.current.value.toLowerCase() == "square feet") {
            const resultInFeet = Number(valueRef.current.value) * 10.7639104167;
            setConversion(`${resultInFeet.toFixed(4)} Square Feet`);
          } else if (toUnitRef.current.value.toLowerCase() == "acre") {
            const resultInAcre = Number(valueRef.current.value) * 0.0002471054;
            setConversion(`${resultInAcre.toFixed(4)} Acre`);
          } else if (toUnitRef.current.value.toLowerCase() == "hectare") {
            const resultInHectare = Number(valueRef.current.value) * 0.0001;
            setConversion(`${resultInHectare.toFixed(4)} Hectare`);
          } else
            setConversion(
              `${Number(valueRef.current.value).toFixed(4)} Square Meter`
            );
          break;

        case "acre":
          if (toUnitRef.current.value.toLowerCase() == "square meter") {
            const resultInMeter = Number(valueRef.current.value) * 4046.8564224;
            setConversion(`${resultInMeter.toFixed(4)} Square Meter`);
          } else if (toUnitRef.current.value.toLowerCase() == "square feet") {
            const resultInFeet = Number(valueRef.current.value) * 43560;
            setConversion(`${resultInFeet.toFixed(4)} Square Feet`);
          } else if (toUnitRef.current.value.toLowerCase() == "hectare") {
            const resultInHectare =
              Number(valueRef.current.value) * 0.4046856422;
            setConversion(`${resultInHectare.toFixed(4)} Hectare`);
          } else
            setConversion(`${Number(valueRef.current.value).toFixed(4)} Acre`);
          break;

        case "hectare":
          if (toUnitRef.current.value.toLowerCase() == "square meter") {
            const resultInMeter = Number(valueRef.current.value) * 10000;
            setConversion(`${resultInMeter.toFixed(4)} Square Meter`);
          } else if (toUnitRef.current.value.toLowerCase() == "square feet") {
            const resultInFeet =
              Number(valueRef.current.value) * 107639.1041671;
            setConversion(`${resultInFeet.toFixed(4)} Square Feet`);
          } else if (toUnitRef.current.value.toLowerCase() == "acre") {
            const resultInAcre = Number(valueRef.current.value) * 2.4710538147;
            setConversion(`${resultInAcre.toFixed(4)} Acre`);
          } else
            setConversion(
              `${Number(valueRef.current.value).toFixed(4)} Hectare`
            );
          break;

        default:
          break;
      }
    }
  }

  return (
    <>
      <Modal.Root
        size="lg"
        opened={opened}
        onClose={close}
        transitionProps={{
          transition: "fade",
          duration: 600,
          timingFunction: "linear",
        }}
        centered
      >
        <Modal.Overlay />
        <Modal.Content data-autofocus>
          <Modal.Header>
            <Modal.Title className="font-manrope-bold text-2xl capitalize">
              area converter
            </Modal.Title>
            <Modal.CloseButton size={28} />
          </Modal.Header>
          <Divider />
          <Modal.Body>
            <Box pt={20} className="h-full">
              <Title className="text-2xl capitalize font-manrope-semibold text-black">
                convert area
              </Title>
              <Text className="text-base normal-case font-manrope-regular text-black">
                Enter the value and desired units:
              </Text>
              <Box className="w-full my-8 space-y-2 md:flex md:space-y-0 md:space-x-2">
                <NumberInput
                  ref={valueRef}
                  step={0.001}
                  precision={3}
                  label="Value"
                  placeholder="Enter value"
                  styles={(theme) => ({
                    label: {
                      paddingBottom: 4,
                      fontSize: 14,
                      fontWeight: 500,
                      fontFamily: "manrope-bold",
                    },
                    input: {
                      borderColor: theme.colors.gray[2],
                      borderWidth: 1,
                      fontFamily: "manrope-medium",
                      "&:focus": {
                        borderColor: theme.colors.gray[4],
                      },
                    },
                  })}
                />
                <Select
                  ref={fromUnitRef}
                  label="From unit"
                  data={["Square Feet", "Square Meter", "Acre", "Hectare"]}
                  styles={(theme) => ({
                    label: {
                      paddingBottom: 4,
                      fontSize: 14,
                      fontWeight: 500,
                      fontFamily: "manrope-bold",
                    },
                    input: {
                      borderColor: theme.colors.gray[2],
                      borderWidth: 1,
                      fontFamily: "manrope-medium",
                      "&:focus": {
                        borderColor: theme.colors.gray[4],
                      },
                    },
                    item: {
                      "&[data-selected]": {
                        "&, &:hover": {
                          backgroundColor: "black",
                        },
                      },
                    },
                  })}
                />
                <Select
                  ref={toUnitRef}
                  label="To unit"
                  data={["Square Feet", "Square Meter", "Acre", "Hectare"]}
                  styles={(theme) => ({
                    label: {
                      paddingBottom: 4,
                      fontSize: 14,
                      fontWeight: 500,
                      fontFamily: "manrope-bold",
                    },
                    input: {
                      borderColor: theme.colors.gray[2],
                      borderWidth: 1,
                      fontFamily: "manrope-medium",
                      "&:focus": {
                        borderColor: theme.colors.gray[4],
                      },
                    },
                    item: {
                      "&[data-selected]": {
                        "&, &:hover": {
                          backgroundColor: "black",
                        },
                      },
                    },
                  })}
                />
              </Box>
              {conversion && (
                <Box className="w-full my-4 text-2xl font-manrope-bold text-center">
                  {conversion}
                </Box>
              )}
              <Button
                onClick={handleConvert}
                fullWidth
                variant="subtle"
                className="bg-primary-700 hover:bg-primary-700 text-white capitalize "
              >
                convert
              </Button>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
