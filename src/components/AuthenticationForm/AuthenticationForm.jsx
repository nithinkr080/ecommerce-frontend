import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import classes from "./AuthenticationForm.module.css";
import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";

import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { useAuth } from "../../hooks/useAuth";

export function AuthenticationForm() {
  const [type, toggle] = useToggle(["login", "register"]);
  const navigation = useNavigate();
  const { login } = useAuth();

  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
      terms: true,
    },

    validate: {
      username: (val) =>
        type === "register" &&
        (val?.trim() === "" ? "Please enter your username" : null),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 5 ? "Password should include at least 6 characters" : null,
    },
  });

  const onFormSubmit = async () => {
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/signIn",
        data: {
          emailId: form.values.email,
          password: form.values.password,
        },
      };
      const response = await axiosInstance.request(config);
      if (response.status === 200) {
        //TODO store username , values and role from api data
        const data = response.data.data;
        login("username", data.username);
        login("email", data.email);
        login("role", data.role);
        login("isLoggedIn", true);
        login("userId", data.userId);
        navigation("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container size={700} my={40}>
      {type === "login" ? (
        <>
          <Title ta="center" className={classes.title}>
            Welcome back!
          </Title>
          <Text
            style={{ width: "25rem" }}
            c="dimmed"
            size="sm"
            ta="center"
            mt={5}
          >
            Do not have an account yet?{" "}
            <Anchor size="sm" component="button" onClick={() => toggle()}>
              Create account
            </Anchor>
          </Text>{" "}
        </>
      ) : (
        <>
          <Title ta="center" className={classes.title}>
            Create account
          </Title>
          <Text
            style={{ width: "25rem" }}
            c="dimmed"
            size="sm"
            ta="center"
            mt={5}
          >
            Already have an account?{" "}
            <Anchor size="sm" component="button" onClick={() => toggle()}>
              Sign In
            </Anchor>
          </Text>{" "}
        </>
      )}
      <form onSubmit={form.onSubmit(onFormSubmit)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          {type === "register" && (
            <TextInput
              label="Username"
              placeholder="Your username"
              required
              value={form.values.username}
              onChange={(event) =>
                form.setFieldValue("username", event.currentTarget.value)
              }
              mb={15}
            />
          )}

          <TextInput
            label="Email"
            placeholder="Email"
            required
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
          />
          {type === "login" ? (
            <Group justify="space-between" mt="lg">
              <Anchor></Anchor>
              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group>
          ) : null}
          <Button fullWidth mt="xl" type="submit">
            {upperFirst(type)}
          </Button>
        </Paper>
      </form>
    </Container>
  );
}
