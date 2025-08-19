import HomeCard from "@/components/home/cards/HomeCard";
import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import useProperties from "@/hooks/useProperties";
import { Badge, Breadcrumbs, SimpleGrid, Tabs } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function RealtorProperties() {
  const router = useRouter();
  const { id } = router.query;

  const { properties, loading } = useProperties({
    src: `get_property?userid=${id ?? null}`,
  });
  const items = [
    { title: "Home", href: "/", current: false },
    { title: "Realtors", href: "/realtors", current: false },
    { title: properties[0]?.title, href: "#", current: true },
  ].map((item, index) => (
    <Link
      href={item.href}
      key={index}
      className={`${
        item.current ? "text-primary-700" : "text-black"
      } no-underline`}
      onClick={(e) => {
        if (item.current) e.preventDefault();
      }}
    >
      {item.title}
    </Link>
  ));

  const filtered = useMemo(() => {
    const sell: PropertyProps[] = [];
    const rent: PropertyProps[] = [];
    properties?.map((property: PropertyProps) => {
      if (property.propery_type.toLowerCase() === "sell") sell.push(property);
      else rent.push(property);
    });
    return {
      sell,
      rent,
    };
  }, [properties]);
  return (
    <AllPropertyLayout>
      <main className="font-manrope-medium capitalize p-5">
        <Breadcrumbs separator="→" mt="xs">
          {items}
        </Breadcrumbs>
        <div className="my-10">
          <Tabs color="primary.0" defaultValue="sell">
            <Tabs.List grow>
              <Tabs.Tab
                value="sell"
                className="text-base font-manrope-medium"
                icon={
                  <Badge
                    variant="transparent"
                    className="rounded-full bg-slate-400"
                  >
                    {`${
                      (filtered.sell?.length ?? 0).toString().length > 4
                        ? `${filtered.sell?.length.toString()[0]}`
                        : filtered.sell?.length
                    }`}
                  </Badge>
                }
              >
                Properties for Sell
              </Tabs.Tab>
              <Tabs.Tab
                value="rent"
                className="text-base font-manrope-medium"
                icon={
                  <Badge
                    variant="transparent"
                    className="rounded-full bg-slate-400"
                  >
                    {`${
                      (filtered.rent?.length ?? 0).toString().length > 4
                        ? `${filtered.rent?.length.toString()[0]}`
                        : filtered.rent?.length
                    }`}
                  </Badge>
                }
              >
                Properties for Rent
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="sell" pt="xs">
              <SimpleGrid
                cols={4}
                spacing="lg"
                breakpoints={[
                  { maxWidth: "62rem", cols: 2, spacing: "md" },
                  { maxWidth: "48rem", cols: 2, spacing: "sm" },
                  { maxWidth: "36rem", cols: 1, spacing: "sm" },
                ]}
                className="w-full "
              >
                <>
                  {filtered.sell?.map((item: PropertyProps) => (
                    <HomeCard key={item.id} data={item} />
                  ))}
                </>
              </SimpleGrid>
            </Tabs.Panel>

            <Tabs.Panel value="rent" pt="xs">
              <SimpleGrid
                cols={4}
                spacing="lg"
                breakpoints={[
                  { maxWidth: "62rem", cols: 2, spacing: "md" },
                  { maxWidth: "48rem", cols: 2, spacing: "sm" },
                  { maxWidth: "36rem", cols: 1, spacing: "sm" },
                ]}
                className="w-full "
              >
                <>
                  {filtered.rent?.map((item: PropertyProps) => (
                    <HomeCard key={item.id} data={item} />
                  ))}
                </>
              </SimpleGrid>
            </Tabs.Panel>
          </Tabs>
        </div>
      </main>
    </AllPropertyLayout>
  );
}
