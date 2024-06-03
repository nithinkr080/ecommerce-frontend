import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { getOrders, cancelOrder } from "../../../redux/slice/productsSlice";
import Loading from "../../../common/Loading";
import Toast from "../../../common/Toast";
import { useDisclosure } from "@mantine/hooks";

const Orders = () => {
  const [userId] = useLocalStorage("userId", null);
  const orders = useSelector((state) => state.orders?.orders);
  const isLoading = useSelector((state) => state.orders?.isLoading);
  const dispacth = useDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const onCancelOrder = () => {
    if (orderDetails?.orderId) {
      dispacth(cancelOrder({ userId: userId, orderId: orderDetails?.orderId }))
        .unwrap()
        .then((res) => {
          Toast.success(res?.message?.message);
          close();
          setOrderDetails(null);
          dispacth(getOrders({ userId }));
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };
  console.log("orderDetails", orderDetails);
  useEffect(() => {
    dispacth(getOrders({ userId }));
  }, []);

  return (
    <Container>
      <Title order={1} align="center" mb="lg">
        Orders
      </Title>
      {isLoading ? (
        <Loading />
      ) : orders?.length ? (
        orders?.map((order) =>
          order?.productDetails?.map((details) => {
            return (
              <Card
                key={details.productId}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                mb="lg"
              >
                <Group noWrap>
                  <Box me="lg">
                    <Image
                      src={`data:image/png;base64,${details?.image}`}
                      height={150}
                      width={150}
                      alt={details?.productName}
                    />
                  </Box>

                  <Stack spacing="xs" style={{ flex: 1 }}>
                    <Flex align="center" justify="space-between">
                      <Group position="apart" mt="md" mb="xs">
                        <Text weight={500} ms="-20">
                          {order?.productName}
                        </Text>
                        <Badge color="green" variant="light">
                          ₹{details?.price}
                        </Badge>
                      </Group>
                      {order?.orderStatus?.toLowerCase() !== "delivered" ? (
                        <Button
                          size="xs"
                          bg="red"
                          onClick={() => {
                            open();
                            setOrderDetails(details);
                          }}
                        >
                          Cancel order
                        </Button>
                      ) : null}
                    </Flex>
                    <Text size="sm" c="dimmed">
                      {details?.description}
                    </Text>
                    <Divider my="sm" />
                    <Grid>
                      <Grid.Col span={6}>
                        <Text size="sm">
                          <strong>Company:</strong> {details?.companyName}
                        </Text>
                        <Text size="sm">
                          <strong>Category:</strong> {details?.categoryName}
                        </Text>
                        <Text size="sm">
                          <strong>Pincode:</strong> {order?.pincode}
                        </Text>
                        <Text size="sm">
                          <strong>Address:</strong> {order?.address}
                        </Text>
                        <Text size="sm">
                          <strong>City:</strong> {order?.city}
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text size="sm" mb="md">
                          <strong>Order Status:</strong>{" "}
                          <Badge color="cyan" variant="light">
                            {order?.orderStatus}
                          </Badge>
                        </Text>
                        <Text size="sm">
                          <strong>Order Id:</strong> {details?.orderId}
                        </Text>
                        <Text size="sm">
                          <strong>Order Date:</strong> {order?.orderDate}
                        </Text>
                        <Text size="sm">
                          <strong>Delivery Date:</strong> {order?.deliveryDate}
                        </Text>
                        <Text size="sm">
                          <strong>Payment Method:</strong>{" "}
                          {order?.paymentMethod}
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Group>
              </Card>
            );
          })
        )
      ) : (
        <Center h="400">
          <Text size="xl" fw="bolder">
            No Orders found
          </Text>
        </Center>
      )}
      <Modal
        opened={opened}
        onClose={close}
        title="Cancel order"
        transitionProps={{ transition: "fade", duration: 400 }}
        centered
      >
        <Text>
          Are you sure you want to cancel order for {orderDetails?.productName}?
        </Text>
        <Flex align="center" justify="space-around" mt="md">
          <Button bg="red" onClick={onCancelOrder}>
            Yes
          </Button>
          <Button onClick={close} bg="cyan">
            No
          </Button>
        </Flex>
      </Modal>
    </Container>
  );
};

export default Orders;
