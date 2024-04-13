import { Center, Grid, Text } from "@mantine/core";
import classes from "./Home.module.css";
import { useEffect } from "react";
import ProductCard from "./ProductCard";
import Loading from "../Cart/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/slice/productsSlice";

function Home() {
  const products = useSelector((state) => state.products?.products);
  const isLoading = useSelector((state) => state.products?.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  return (
    <>
      <div className={classes.container}>
        {isLoading ? (
          <Loading />
        ) : products?.length ? (
          <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
            {products?.map((product) => {
              return <ProductCard key={product?.productId} product={product} />;
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

export default Home;
