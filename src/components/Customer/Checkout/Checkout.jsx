import { useState } from "react";
import { TextInput, Button, Paper, Textarea } from "@mantine/core";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

const Checkout = () => {
  const [username] = useLocalStorage("username", null);
  const [email] = useLocalStorage("email", null);
  const [name, setName] = useState(username);
  const [emailId, setEmailId] = useState(email);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const handleSubmit = () => {
    // Handle submission logic here, e.g., send data to server
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Address:", address);
    console.log("City:", city);
    console.log("ZIP:", zip);
  };

  return (
    <div style={{ padding: "5rem 15rem 0 15rem" }}>
      <Paper p={"lg"} shadow="xs" radius="md" withBorder>
        <h2 style={{ textAlign: "center" }}>Checkout</h2>
        <TextInput
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <TextInput
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={emailId}
          onChange={(event) => setEmailId(event.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Textarea
          label="Address"
          placeholder="Enter your address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <TextInput
          label="City"
          placeholder="Enter your city"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <TextInput
          label="ZIP"
          placeholder="Enter your ZIP code"
          value={zip}
          onChange={(event) => setZip(event.target.value)}
          style={{ marginBottom: "20px" }}
        />
        <div style={{ textAlign: "center" }}>
          <Button bg={"cyan"} onClick={handleSubmit} style={{ width: "200px" }}>
            Submit
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Checkout;
