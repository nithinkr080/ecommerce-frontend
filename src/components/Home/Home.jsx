import { Center, Grid, Text } from "@mantine/core";
import classes from "./Home.module.css";
import { axiosInstance } from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Loading from "../Cart/Loading";

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/products");
      if (response.data.status === 200) {
        const data = response.data.data;
        setProducts(data);
      } else {
        throw new Error("Something went wrong");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className={classes.container}>
      {isLoading ? (
        <Loading />
      ) : products?.length ? (
        <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
          {products?.map((product) => {
            return <ProductCard key={product.productId} product={product} />;
          })}
        </Grid>
      ) : (
        <Center h={400}>
          <Text size="lg">No products found</Text>
        </Center>
      )}
    </div>
  );
}

export default Home;
