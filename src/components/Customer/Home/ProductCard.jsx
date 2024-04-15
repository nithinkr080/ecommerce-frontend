import { useState } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import classes from "./ProductCard.module.css";
import {
  Button,
  Center,
  Divider,
  Grid,
  Group,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { FaCartPlus } from "react-icons/fa";
import Toast from "../../../common/Toast";

const ProductCard = ({ product }) => {
  const [userId] = useLocalStorage("userId", null);
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = async (productId) => {
    try {
      setIsLoading(true);
      const payload = { productId, userId };
      const response = await axiosInstance.post("/cart/add", payload);
      if (response?.data?.status == 200) {
        Toast.success(response?.data?.message?.message);
      } else {
        throw new Error("Something went wrong");
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Toast.error(error?.message);
      setIsLoading(false);
    }
  };

  return (
    <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
      <SimpleGrid className={classes["product-grid"]} cols={1}>
        <Center>
          <img
            className={classes["home-product-img"]}
            src={`data:image/png;base64,${product.image}`}
            alt={product.productName}
          />
        </Center>
        <Divider my="md" mb="0" />
        <Group justify="space-between" grow>
          <Text size="md" c={"lightBlack.0"}>
            {product.productName}
          </Text>
          <Button
            loading={isLoading}
            onClick={() => addToCart(product.productId)}
            bg={"default.0"}
          >
            <FaCartPlus size="1.1rem" />
          </Button>
        </Group>
        <Group>
          <Text c={"lightBlack.3"} size="sm">
            ₹{product.price}
          </Text>
        </Group>
      </SimpleGrid>
    </Grid.Col>
  );
};

export default ProductCard;
