import { useEffect, useRef } from "react";
import {
  Container,
  TextInput,
  Textarea,
  Select,
  Button,
  Image,
  Grid,
  useMantineTheme,
  FileButton,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../../redux/slice/categoriesSlice";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { addProduct } from "../../../redux/slice/productsSlice";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [userId] = useLocalStorage("userId", null);
  const categories = useSelector((state) => state.categories?.categories);
  const resetRef = useRef(null);
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
    },
    validationRules: {
      name: (value) => value.trim() !== "",
      description: (value) => value.trim() !== "",
      price: (value) =>
        /^\d+(\.\d{1,2})?$/.test(value) && parseFloat(value) > 0,
      category: (value) => value.trim() !== "",
      image: (value) => value !== null,
    },
    errorMessages: {
      name: "Please enter a product name",
      description: "Please enter a product description",
      price: "Please enter a valid price",
      category: "Please select a category",
      image: "Please select an image",
    },
  });

  const clearFile = () => {
    form.setFieldValue("image", null);
    resetRef.current?.();
  };

  const convertToBase64 = (image) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (response) => {
        const result = response.target.result;
        const data = result?.replace("data:image/jpeg;base64,", "");
        resolve(data);
      };
    });
  };

  const handleSubmit = async () => {
    const { categoryId } = categories.find(
      (category) => category?.categoryName === form.values.category
    );
    const base64Image = await convertToBase64(form.values.image);
    const payload = {
      productName: form.values.name,
      description: form.values.description,
      price: form.values.price,
      categoryId: categoryId,
      sellerId: userId,
      image: base64Image,
    };
    dispatch(addProduct({ payload }))
      .unwrap()
      .then((response) => {
        if (response.status === 200) {
          navigation("/");
        }
      })
      .catch((error) => {
        throw error;
      });
  };

  useEffect(() => {
    dispatch(getCategories());
  }, []);
  console.log("form.values.image", form.values.image);
  return (
    <Container size="sm">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid gutter="lg">
          <Grid.Col span={12}>
            <TextInput
              label="Product Name"
              placeholder="Enter product name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.target.value)
              }
              error={form.errors.name}
              required
              fullWidth
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Description"
              placeholder="Enter product description"
              value={form.values.description}
              onChange={(event) =>
                form.setFieldValue("description", event.target.value)
              }
              error={form.errors.description}
              required
              fullWidth
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Price"
              placeholder="Enter product price"
              type="number"
              value={form.values.price}
              onChange={(event) =>
                form.setFieldValue("price", event.target.value)
              }
              error={form.errors.price}
              required
              fullWidth
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Category"
              data={categories?.map((category) => category?.categoryName)}
              placeholder="Select category"
              value={form.values.category}
              onChange={(value) => {
                form.setFieldValue("category", value);
              }}
              error={form.errors.category}
              required
              fullWidth
            />
          </Grid.Col>
          <Grid.Col span={12}>
            {/* <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                form.setFieldValue("image", event.target.files[0])
              }
              required
            /> */}
            <FileButton
              resetRef={resetRef}
              onChange={(event) => form.setFieldValue("image", event)}
              accept="image/*"
            >
              {(props) => <Button {...props}>Upload image</Button>}
            </FileButton>
            <Button
              disabled={!form.values.image}
              color="red"
              onClick={clearFile}
              ms="md"
            >
              Reset
            </Button>
            {form.values.image && (
              <Text size="sm" ta="center" mt="sm">
                Picked file: {form.values.image.name}
              </Text>
            )}
            {form.errors.image && (
              <div style={{ color: theme.colors.red[6] }}>
                {form.errors.image}
              </div>
            )}
            {form.values.image && (
              <Image
                src={URL.createObjectURL(form.values.image)}
                alt="Product Image"
                style={{ marginTop: 16 }}
              />
            )}
          </Grid.Col>
          <Grid.Col span={12}>
            <Button
              type="submit"
              variant="filled"
              style={{ marginTop: 16 }}
              fullWidth
            >
              Add Product
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </Container>
  );
};

export default AddProduct;
