
import { useQuery, useMutation, type OptionalRestArgsOrSkip } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OptionalRestArgs, type FunctionReference } from "convex/server";

const useConvexQuery = <Query extends FunctionReference<"query">>(
  query: Query,
  ...args: OptionalRestArgsOrSkip<Query>
) => {
  const result = useQuery(query, ...args);

  const [data, setData] = useState<Query["_returnType"] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const isSkipped = args[0] === "skip";

  useEffect(() => {
    if (isSkipped) {
      setIsLoading(false);
      setData(undefined);
      setError(null);
      return;
    }
    if (result === undefined) {
      setIsLoading(true);
      return;
    }
    try {
      setData(result);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
        toast.error(err.message);
      } else {
        setError(new Error("An unknown error occurred"));
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, [result, isSkipped]);

  return {
    data,
    isLoading,
    error,
  };
};

export default useConvexQuery;

export const useConvexMutation = <
  Mutation extends FunctionReference<"mutation">
>(
  mutation: Mutation
) => {
  const mutationFn = useMutation(mutation);

  const [data, setData] = useState<Mutation["_returnType"] | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeMutation = async (
    ...args: OptionalRestArgs<Mutation>
  ): Promise<Mutation["_returnType"] | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await mutationFn(...args);
      setData(res);
      return res;
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
        toast.error(err.message);
      } else {
        setError(new Error("An unknown error occurred"));
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate: executeMutation,
    data,
    isLoading,
    error,
  };
};
