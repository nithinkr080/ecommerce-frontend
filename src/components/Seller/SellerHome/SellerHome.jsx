import { Center, Grid, Text } from "@mantine/core";
import classes from "./SellerHome.module.css";
import { useEffect } from "react";
import SellerProductCard from "./SellerProductCard";
import Loading from "../../../common/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/slice/productsSlice";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

function SellerHome() {
  const products = useSelector((state) => state.products?.products);
  const isLoading = useSelector((state) => state.products?.isLoading);
  const [userId] = useLocalStorage("userId", null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts({ sellerId: JSON.stringify(userId) }));
  }, []);

  return (
    <>
      <div className={classes.container}>
        {isLoading ? (
          <Loading />
        ) : products?.length ? (
          <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
            {products?.map((product) => {
              return (
                <SellerProductCard key={product?.productId} product={product} />
              );
            })}
          </Grid>
        ) : (
          <Center h={400}>
            <Text size="lg">No products found</Text>
          </Center>
        )}
      </div>
    </>
  );
}

export default SellerHome;
