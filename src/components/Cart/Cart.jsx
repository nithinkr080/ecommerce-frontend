// Cart.js
import { useEffect, useState } from "react";
import {
  Container,
  Text,
  Paper,
  Image,
  Button,
  Badge,
  Group,
  Stack,
} from "@mantine/core";
import { axiosInstance } from "../../utils/axiosInstance";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import Toast from "../../common/Toast";
import Loading from "./Loading";
import { FaTrash } from "react-icons/fa";
import classes from "./Cart.module.css";

const Cart = () => {
  const [userId] = useLocalStorage("userId", null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  const getCartList = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/cart/${userId}`);
      if (response?.data?.status === 200) {
        const data = response?.data?.data;
        setCartItems(data);
      } else {
        throw new Error("Something went wrong");
      }
      setIsLoading(false);
    } catch (error) {
      Toast.error(error.message);
      setIsLoading(false);
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
  };

  useEffect(() => {
    getCartList();
  }, []);

  return (
    <Container size="lg" className={classes.cartContainer}>
      <Text align="center" size="xl" style={{ marginBottom: "20px" }}>
        Your Shopping Cart
      </Text>
      <Paper p="lg" padding="md" shadow="xl">
        <Group className={classes.cartHeader} spacing="md">
          <Text weight={700}>Item</Text>
          <Text weight={700}>Price</Text>
          <Text weight={700}>Remove</Text>
        </Group>
        {isLoading ? (
          <Loading />
        ) : cartItems?.length ? (
          cartItems.map((item) => (
            <Group
              p="lg"
              key={item.id}
              spacing="xs"
              className={classes.cartItem}
            >
              <Stack
                align="center"
                spacing="xs"
                className={classes.itemDetails}
              >
                <Image
                  src={`data:image/png;base64,${item.image}`}
                  alt={item.name}
                  width={120}
                  height={120}
                />
                <Text c={"lightBlack.0"} size="md">
                  {item.productName}
                </Text>
              </Stack>
              <Text>₹{item.price}</Text>
              <Button
                variant="outline"
                color="red"
                size="xs"
                onClick={() => removeFromCart(item.id)}
                icon={<FaTrash />}
                className={classes.removeButton}
              >
                Remove
              </Button>
            </Group>
          ))
        ) : (
          <Text align="center">Your cart is empty</Text>
        )}
        {cartItems?.length > 0 ? (
          <div className={classes.cartSummary}>
            <Badge
              color="default.0"
              variant="filled"
              className={classes.totalBadge}
            >
              Total: ₹{totalPrice}
            </Badge>
            <Button
              variant="outline"
              color="default.0"
              size="md"
              className={classes.checkoutButton}
            >
              Checkout
            </Button>
          </div>
        ) : null}
      </Paper>
    </Container>
  );
};

export default Cart;
