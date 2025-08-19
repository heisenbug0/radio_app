import InitialLoader from "@/components/InitialLoader";
import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import useProperties from "@/hooks/useProperties";
import useRealtors from "@/hooks/useRealtors";
import useUser from "@/hooks/useUser";
import { titleImageLoader, userImageLoader } from "@/services/utils";
import {
  Group,
  Text,
  ActionIcon,
  SimpleGrid,
  Button,
  Divider,
} from "@mantine/core";
import {
  IconBrandWhatsapp,
  IconCurrencyNaira,
  IconMapPin,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export default function Realtors() {
  const { user } = useUser();
  const { realtors, fetching } = useRealtors();
  const { properties } = useProperties({
    src: `get_property?&current_user=${user?.id}`,
  });

  const filtered = useMemo(() => {
    if (properties?.length) {
      return properties.slice(0, 5);
    }
  }, [properties]);

  return (
    <AllPropertyLayout>
      {fetching ? (
        <InitialLoader />
      ) : (
        <div className="w-full space-y-5 lg:space-y-0 lg:flex lg:space-x-7 px-4 py-6">
          <div className="flex-1 ">
            <SimpleGrid
              cols={3}
              spacing="md"
              breakpoints={[
                { maxWidth: "72rem", cols: 2, spacing: "md" },
                { maxWidth: "62rem", cols: 2, spacing: "md" },
                { maxWidth: "48rem", cols: 2, spacing: "sm" },
                { maxWidth: "36rem", cols: 1, spacing: "sm" },
              ]}
              className="w-full "
            >
              {realtors?.map((agent: RealtorsProps) => (
                <div
                  key={agent?.customer[0]?.id}
                  className="w-full p-5 space-y-4 bg-white rounded-xl  "
                >
                  <div className="w-full h-[250px] overflow-hidden relative">
                    {agent?.customer[0]?.profile ? (
                      <Image
                        src={agent.customer[0]?.profile}
                        alt={`${agent.customer[0]?.name} image`}
                        loader={userImageLoader}
                        fill
                        loading="lazy"
                        sizes="(min-width: 808px) 50vw, 100vw"
                      />
                    ) : (
                      <Image
                        src="/avatar.png"
                        alt={`${agent.customer[0]?.name} image`}
                        fill
                        sizes="(min-width: 808px) 50vw, 100vw"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <div className="mb-4 h-28">
                      <Text className="font-semibold font-manrope-semibold capitalize text-base">
                        {agent.customer[0]?.name}
                      </Text>
                      <Group spacing={2} mt={5} mb={20}>
                        <IconMapPin className="text-primary-700" size={16} />
                        <Text
                          lineClamp={3}
                          className="font-medium font-manrope-medium capitalize text-sm"
                        >
                          {agent.customer[0]?.address}
                        </Text>
                      </Group>
                    </div>
                    <div className="w-full ">
                      <Group position="apart">
                        <Link
                          href={`/realtors/${agent?.customer[0]?.username}`}
                        >
                          <Button
                            variant="white"
                            className="text-sm capitalize font-manrope-medium font-medium bg-primary-700 text-white"
                          >
                            view details
                          </Button>
                        </Link>

                        <div className="">
                          <a
                            href={`https://wa.me/${agent.customer[0]?.mobile}?text=Hello! I am interested in one of your listed properties. Can we discuss further?`}
                            target="_blank"
                            rel="noreferrer"
                            title="Contact via WhatsApp"
                            className="no-underline "
                          >
                            <ActionIcon
                              variant="transparent"
                              w={32}
                              h={32}
                              bg="green.8"
                              radius={10}
                            >
                              <IconBrandWhatsapp className="text-white" />
                            </ActionIcon>
                          </a>
                        </div>
                      </Group>
                    </div>
                  </div>
                </div>
              ))}
            </SimpleGrid>
          </div>

          <div className="w-full lg:max-w-xs  h-fit bg-white rounded-xl p-5">
            <Text className="text-2xl capitalize font-semibold font-manrope-semibold mb-3 text-black">
              latest listings
            </Text>
            <SimpleGrid
              cols={1}
              spacing="md"
              breakpoints={[
                { maxWidth: "62rem", cols: 2, spacing: "md" },
                { maxWidth: "48rem", cols: 2, spacing: "sm" },
                { maxWidth: "36rem", cols: 1, spacing: "sm" },
              ]}
              className="w-full "
            >
              {filtered?.map((property: PropertyProps) => (
                <Link
                  href={`/properties/${property?.id}`}
                  key={property?.id}
                  className="no-underline text-black"
                >
                  <div className="w-full">
                    <div className="w-full h-44 overflow-hidden relative">
                      <Image
                        src={property?.title_image}
                        alt={`${property?.title} image`}
                        loader={titleImageLoader}
                        fill
                        loading="lazy"
                        sizes="(min-width: 808px) 50vw, 100vw"
                      />
                    </div>
                    <Text className="text-base capitalize font-medium font-manrope-medium my-3 text-black/60">
                      {property?.category?.category}
                    </Text>
                    <Text
                      lineClamp={2}
                      className="text-sm capitalize font-medium font-manrope-medium mb-1 text-black"
                    >
                      {property?.title}
                    </Text>
                    <Group spacing={2} mt={5} mb={10}>
                      <IconMapPin className="text-primary-700" size={16} />
                      <Text
                        lineClamp={3}
                        className="font-medium font-manrope-medium capitalize text-sm"
                      >
                        {`${property?.city} ${property?.country}`}
                      </Text>
                    </Group>
                    <Group spacing={0} className="text-primary-700 ">
                      <IconCurrencyNaira size={20} />
                      <Text className="font-manrope-bold text-base  ">
                        {Number(property?.price).toLocaleString()}
                      </Text>
                    </Group>
                    <Divider my={20} />
                  </div>
                </Link>
              ))}
            </SimpleGrid>
          </div>
        </div>
      )}
    </AllPropertyLayout>
  );
}
