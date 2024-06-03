import { useState } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import classes from "./SellerProductCard.module.css";
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
import { MdDeleteForever } from "react-icons/md";
import Toast from "../../../common/Toast";
import { useDispatch } from "react-redux";
import { deleteProduct, getProducts } from "../../../redux/slice/productsSlice";
const SellerProductCard = ({ product }) => {
  const [userId] = useLocalStorage("userId", null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const removeProduct = async (productId) => {
    try {
      setIsLoading(true);
      dispatch(deleteProduct({ productId: productId }))
        .unwrap()
        .then(() => {
          dispatch(getProducts({ sellerId: JSON.stringify(userId) }));
        });
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
            src={`data:image/png;base64,${product?.image}`}
            alt={product?.productName}
          />
        </Center>
        <Divider my="md" mb="0" />
        <Group justify="space-between" grow>
          <Text size="md" c={"lightBlack.0"}>
            {product?.productName}
          </Text>
          <Button
            loading={isLoading}
            onClick={() => removeProduct(product?.productId)}
            bg={"red"}
          >
            <MdDeleteForever size="1.3rem" />
          </Button>
        </Group>
        <Group>
          <Text c={"lightBlack.3"} size="sm">
            ₹{product?.price}
          </Text>
        </Group>
      </SimpleGrid>
    </Grid.Col>
  );
};

export default SellerProductCard;
