import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export default function useGetCalls() {
  const [allCalls, setAllCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const client = useStreamVideoClient();
  const { user } = useUser();

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return;
      setIsLoading(true);

      try {
        const { calls } = await client.queryCalls({
          sort: [
            {
              field: "starts_at",
              direction: -1,
            },
          ],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
          limit: 20,
        });

        setAllCalls(calls);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCalls();
  }, [client, user?.id]);

  const nowDate = new Date();
  const endedCalls: Call[] = allCalls.filter(
    ({ state: { startsAt, endedAt } }: Call) => {
      return (startsAt && new Date(startsAt) < nowDate) || !!endedAt;
    }
  );
  const upComingCalls: Call[] = allCalls.filter(
    ({ state: { startsAt } }: Call) => {
      return startsAt && new Date(startsAt) > nowDate;
    }
  );

  return {
    endedCalls,
    upComingCalls,
    callRecordings: allCalls,
    isLoading,
  };
}
