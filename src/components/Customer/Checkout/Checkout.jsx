import { useState } from "react";
import {
  TextInput,
  Button,
  Paper,
  Textarea,
  Radio,
  Modal,
  Card,
  Title,
  Grid,
  Group,
} from "@mantine/core";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import Toast from "../../../common/Toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { orderProduct } from "../../../redux/slice/productsSlice";
import { generateRandomAlphanumeric } from "../../../helper/helper";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconBrandMastercard, IconBrandVisa } from "@tabler/icons-react";

const Checkout = () => {
  const [username] = useLocalStorage("username", null);
  const [userId] = useLocalStorage("userId", null);
  const [email] = useLocalStorage("email", null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [name, setName] = useState(username);
  const [emailId, setEmailId] = useState(email);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [checked, setChecked] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },

    validate: {
      cardNumber: (value) =>
        /^\d{16}$/.test(value) ? null : "Invalid card number",
      cardHolder: (value) =>
        value.length > 0 ? null : "Card holder name is required",
      expiryDate: (value) =>
        /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(value)
          ? null
          : "Invalid expiry date",
      cvv: (value) => (/^\d{3,4}$/.test(value) ? null : "Invalid CVV"),
    },
  });

  const handleSubmit = () => {
    if (!form.isValid() && checked === "card") return null;
    const date = new Date();
    const orderDate = date.toLocaleDateString("en-in");
    let randomInt = Math.round(Math.random() * 6);
    randomInt === 0 && (randomInt = 1);
    let deliveryDate = new Date(date.setDate(date.getDate() + randomInt));
    deliveryDate = deliveryDate.toLocaleDateString("en-in");

    try {
      if (
        name?.length &&
        email?.length &&
        emailId?.length &&
        address?.length &&
        city?.length &&
        zip?.length &&
        checked
      ) {
        let payload = {
          userId,
          orderDetails: [
            {
              city: city,
              address: address,
              pincode: Number(zip),
              orderDate,
              deliveryDate,
              paymentMethod: checked,
              orderStatus: "inprogress",
              productDetails: [],
            },
          ],
        };
        state.map((sT) => {
          const orderId = generateRandomAlphanumeric(10);
          payload.orderDetails[0].productDetails.push({
            image: sT?.image,
            price: sT?.price,
            userId,
            orderId,
            quantity: sT?.quantity,
            sellerId: sT?.seller?.sellerId,
            productId: sT?.productId,
            categoryId: sT?.category?.categoryId,
            categoryName: sT?.category?.categoryName,
            description: sT?.description,
            productName: sT?.productName,
            companyName: sT?.seller?.companyName,
          });
        });

        dispatch(orderProduct(payload))
          .unwrap()
          .then((res) => {
            if (res?.status === 200) {
              close();
              navigate("/");
            } else {
              throw new Error("Something went wrong");
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      } else {
        Toast.error("Please fill all the details");
      }
    } catch (error) {
      Toast.error(error?.message);
    }
  };

  return (
    <div style={{ padding: "2rem 15rem 0 15rem" }}>
      <Paper p="lg" shadow="xs" radius="md" withBorder>
        <h2 style={{ textAlign: "center" }}>Checkout</h2>
        <TextInput
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={{ marginBottom: "10px" }}
          withAsterisk
        />
        <TextInput
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={emailId}
          onChange={(event) => setEmailId(event.target.value)}
          style={{ marginBottom: "10px" }}
          withAsterisk
        />
        <Textarea
          label="Address"
          placeholder="Enter your address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          style={{ marginBottom: "10px" }}
          withAsterisk
        />
        <TextInput
          label="City"
          placeholder="Enter your city"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          style={{ marginBottom: "10px" }}
          withAsterisk
        />
        <TextInput
          label="ZIP"
          placeholder="Enter your ZIP code"
          value={zip}
          onChange={(event) => setZip(event.target.value)}
          style={{ marginBottom: "20px" }}
          withAsterisk
        />
        <Radio.Group
          value={checked}
          onChange={setChecked}
          name="payment"
          label="Select payment"
          withAsterisk
        >
          <Radio mt="sm" color="cyan" label="Cash on delivery" value="cod" />
          <Radio mt="sm" color="cyan" label="Credit/Debit card" value="card" />
        </Radio.Group>
        <div style={{ textAlign: "center" }}>
          {checked === "card" ? (
            <Button bg={"cyan"} onClick={open} style={{ width: "200px" }}>
              Next
            </Button>
          ) : (
            <Button
              bg={"cyan"}
              onClick={handleSubmit}
              style={{ width: "200px" }}
            >
              Submit
            </Button>
          )}
        </div>
      </Paper>
      <Modal
        opened={opened}
        onClose={close}
        title="Card details"
        transitionProps={{ transition: "fade", duration: 400 }}
        centered
      >
        <Card shadow="sm" padding="lg">
          <Title order={3} mb="lg" ta="left">
            Credit Card Details <IconBrandMastercard stroke={2} />{" "}
            <IconBrandVisa stroke={2} />
          </Title>

          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Card Number"
                placeholder="1234 5678 9123 4567"
                {...form.getInputProps("cardNumber")}
                maxLength={16}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Card Holder"
                placeholder="John Doe"
                {...form.getInputProps("cardHolder")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Expiry Date"
                placeholder="MM/YY"
                {...form.getInputProps("expiryDate")}
                maxLength={5}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="CVV"
                placeholder="123"
                {...form.getInputProps("cvv")}
                maxLength={4}
              />
            </Grid.Col>
          </Grid>
          <Group position="center" mt="lg">
            <Button justify="center" fullWidth onClick={handleSubmit}>
              Submit
            </Button>
          </Group>
        </Card>
      </Modal>
    </div>
  );
};

export default Checkout;
