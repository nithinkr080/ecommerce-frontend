import React from "react";
import { Button } from "@mantine/core";
import { useAuth } from "../../hooks/useAuth";

function Home() {
  const { logout } = useAuth();
  return (
    <>
      <div>Home</div>
      <Button onClick={() => logout()}>Logout</Button>
    </>
  );
}

export default Home;
