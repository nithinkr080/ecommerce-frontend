import cx from "clsx";
import {
  Autocomplete,
  Group,
  Burger,
  rem,
  Menu,
  UnstyledButton,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconLogout,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import classes from "./Header.module.css";
import { FaBeer } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import ProfilePicture from "../../common/ProfilePicture";

const links = [
  { link: "/cart", label: "Cart" },
  { link: "/orders", label: "Orders" },
];

const Header = () => {
  const naviagtion = useNavigate();
  const { logout } = useAuth();
  const [username] = useLocalStorage("username", null);
  const [email] = useLocalStorage("email", null);
  const user = {
    name: username,
    email: email,
    image: <ProfilePicture name={username} />,
  };

  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group onClick={() => naviagtion("/")} style={{ cursor: "pointer" }}>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <FaBeer size="2rem" />
          <h2>Logo</h2>
        </Group>

        <Group>
          <Autocomplete
            className={classes.search}
            placeholder="Search"
            leftSection={
              <IconSearch
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            data={[
              "React",
              "Angular",
              "Vue",
              "Next.js",
              "Riot.js",
              "Svelte",
              "Blitz.js",
            ]}
            visibleFrom="xs"
          />
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group gap={7}>
                  {user.image}
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {user.name}
                  </Text>
                  <IconChevronDown
                    style={{ width: rem(12), height: rem(12) }}
                    stroke={1.5}
                  />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconSettings
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Account settings
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={
                  <IconLogout
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
                onClick={logout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </header>
  );
};

export default Header;