import { Center, Loader } from "@mantine/core";

function Loading() {
  return (
    <Center h={400}>
      <Loader c={"default.0"} />
    </Center>
  );
}

export default Loading;
