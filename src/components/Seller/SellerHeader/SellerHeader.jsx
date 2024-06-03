import {
  Autocomplete,
  Burger,
  Group,
  Menu,
  Select,
  Text,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconLogout, IconSearch } from "@tabler/icons-react";
import cx from "clsx";
import { useEffect, useState } from "react";
import { FaShop } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProfilePicture from "../../../common/ProfilePicture";
import { useAuth } from "../../../hooks/useAuth";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { getCategories } from "../../../redux/slice/categoriesSlice";
import { getProducts } from "../../../redux/slice/productsSlice";
import classes from "./SellerHeader.module.css";

const links = [{ link: "/addProduct", label: "Add Product" }];

const SellerHeader = () => {
  const naviagtion = useNavigate();
  const dispatch = useDispatch();
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
  const categories = useSelector((state) => state.categories?.categories);

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      to={link.link}
    >
      {link.label}
    </Link>
  ));

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group onClick={() => naviagtion("/")} style={{ cursor: "pointer" }}>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <FaShop size="2rem" color={"#21a3bf"} />
          <h2 style={{ color: "#21a3bf" }}>ShopSail</h2>
        </Group>

        <Group>
          <Select
            placeholder="Filter"
            data={categories?.map((category) => category?.categoryName)}
            onChange={(category) => dispatch(getProducts({ category }))}
            clearable
          />
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
              <Menu.Label>Account</Menu.Label>
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

export default SellerHeader;
