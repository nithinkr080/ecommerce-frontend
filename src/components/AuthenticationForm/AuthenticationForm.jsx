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
  Select,
} from "@mantine/core";
import classes from "./AuthenticationForm.module.css";
import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { signIn, signUp } from "../../redux/slice/authenticationSlice";

export function AuthenticationForm() {
  const [type, toggle] = useToggle(["login", "register"]);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuth();

  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
      role: null,
    },

    validate: {
      username: (val) =>
        type === "register" &&
        (val?.trim() === "" ? "Please enter your username" : null),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 5 ? "Password should include at least 6 characters" : null,
      role: (val) =>
        type === "register" && (!val?.length ? "Please select role" : null),
    },
  });

  const onFormSubmit = async () => {
    if (type === "register") {
      dispatch(
        signUp({
          username: form.values.email,
          emailId: form.values.email,
          password: form.values.password,
          role: form.values.role,
        })
      )
        .unwrap()
        .then((response) => {
          if (response.status !== 200) return;
          form.setFieldValue("password", "");
          toggle();
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    } else {
      dispatch(
        signIn({
          emailId: form.values.email,
          password: form.values.password,
        })
      )
        .unwrap()
        .then((response) => {
          if (response.status !== 200) return;
          const data = response.data;
          login("username", data.username);
          login("email", data.email);
          login("role", data.role);
          login("isLoggedIn", true);
          login("userId", data.userId);
          navigation("/");
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    }
  };

  return (
    <Container size={500} my={40}>
      {type === "login" ? (
        <>
          <Title ta="center" className={classes.title}>
            Welcome back!
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
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
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Already have an account?{" "}
            <Anchor size="sm" component="button" onClick={() => toggle()}>
              Sign In
            </Anchor>
          </Text>{" "}
        </>
      )}
      <form onSubmit={form.onSubmit(() => onFormSubmit())}>
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
          {type === "register" ? (
            <Select
              label="Role"
              placeholder="Pick Role"
              data={["Customer", "Seller"]}
              mt="md"
              value={form.values.role}
              onChange={(event) => form.setFieldValue("role", event)}
              error={form.errors.role && "Please select role"}
            />
          ) : null}
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
