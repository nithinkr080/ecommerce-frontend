import {
  Button,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import Toast from "../../../common/Toast";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { axiosInstance } from "../../../utils/axiosInstance";
import classes from "./Cart.module.css";
import Loading from "../../../common/Loading";
import { useDispatch } from "react-redux";
import { removeCartProduct } from "../../../redux/slice/productsSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [userId] = useLocalStorage("userId", null);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const getCartList = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/cart/${userId}`);
      if (response?.data?.status === 200) {
        const data = response?.data?.data;

        data.sort((a, b) => a?.productId - b?.productId);
        const productMap = new Map();

        data.forEach((product) => {
          if (productMap.has(product.productId)) {
            productMap.set(
              product.productId,
              productMap.get(product.productId) + 1
            );
          } else {
            productMap.set(product.productId, 1);
          }
        });

        const uniqueProductsMap = new Map();

        data.forEach((product) => {
          if (!uniqueProductsMap.has(product.productId)) {
            const uniqueProduct = { ...product };
            const quantity = productMap.get(product.productId);
            if (quantity > 1) uniqueProduct.quantity = quantity;
            else uniqueProduct.quantity = 1;
            uniqueProductsMap.set(product.productId, uniqueProduct);
          }
        });

        const uniqueProducts = Array.from(uniqueProductsMap.values());
        setCartItems([...uniqueProducts]);
      } else {
        throw new Error("Something went wrong");
      }
      setIsLoading(false);
    } catch (error) {
      Toast.error(error.message);
      setIsLoading(false);
    }
  };

  function removeFirstOccurrence(arr, target) {
    const index = arr.indexOf(target);
    if (index !== -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  const removeFromCart = (id) => {
    const cartList = [];
    cartItems.forEach((item) => {
      if (item?.quantity > 1) {
        for (let i = 0; i < item.quantity; i++) {
          cartList.push(item.productId);
        }
      }
    });
    const updatedCart = removeFirstOccurrence(cartList.slice(), id);
    const payload = {
      type: "remove",
      cartList: JSON.stringify(updatedCart),
      userId: userId,
    };
    dispatch(removeCartProduct({ payload }))
      .unwrap()
      .then((res) => {
        getCartList();
      });
  };

  useEffect(() => {
    getCartList();
  }, []);

  return (
    <Container size="lg">
      <Text align="center" size="xl" style={{ marginBottom: "20px" }}>
        Your Shopping Cart
      </Text>
      <Grid>
        <Grid.Col span={8}>
          <Paper p="lg" padding="md" shadow="xl">
            <Group className={classes.cartHeader} spacing="md">
              <Text weight={700}>Item</Text>
              <Text weight={700}>Price</Text>
              <Text weight={700}>Quantity</Text>
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
                  <Text style={{ marginRight: "6.1rem" }}>₹{item.price}</Text>
                  <Text>{item.quantity}</Text>
                  <Button
                    variant="outline"
                    color="red"
                    size="xs"
                    onClick={() => removeFromCart(item.productId)}
                    className={classes.removeButton}
                  >
                    Remove
                  </Button>
                </Group>
              ))
            ) : (
              <Text align="center">Your cart is empty</Text>
            )}
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          {cartItems?.length > 0 ? (
            <Paper p="lg" padding="md" shadow="xl">
              <div className={classes.cartSummary}>
                <Stack>
                  <Text fw="bolder" size="xl">
                    Total
                  </Text>
                  <Text>₹{totalPrice}</Text>
                </Stack>
                <Button
                  variant="outline"
                  color="default.0"
                  size="md"
                  className={classes.checkoutButton}
                  onClick={() => navigation("/checkout", { state: cartItems })}
                >
                  Checkout
                </Button>
              </div>
            </Paper>
          ) : null}
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Cart;
