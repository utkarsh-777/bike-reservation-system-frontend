import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import { useNavigate } from "react-router-dom";
import { remove_user } from "../../../actions/userActions";
import { toast, ToastContainer } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../../../context/context";
import { useCookies } from "react-cookie";

const pages = ["Reservations"];
const pages_manager = ["Reservations", "Users"];
const settings = ["Profile", "Logout"];
const settings_manager = ["Profile", "Logout"];

const NavBar = () => {
  const [props, setCookie] = useCookies(["user"]);
  const [user, setUser] = React.useState("regular");
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    if (page === "Users") {
      navigate("/users");
    } else if (page === "Reservations") {
      navigate("/reservations");
    }
    return setAnchorElNav(null);
  };

  const logout = () => {
    localStorage.clear();
    toast("Logout Successfull!", { type: "default" });
    setTimeout(() => {
      localStorage.clear();
      setCookie("user", "null");
      dispatch(remove_user());
      navigate("/");
    }, 2000);
  };

  const handleCloseUserMenu = (setting) => {
    if (setting === "Profile") {
      navigate(`/profile/${props?.user?.id}`);
    } else if (setting === "Users") {
      navigate("/users");
    } else if (setting === "Logout") {
      logout();
    }
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    if (props) {
      setUser(props?.user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.user]);

  return (
    <>
      {props.user !== "null" && (
        <AppBar position="static">
          <ToastContainer />
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <BookOnlineIcon
                sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
              />
              <Typography
                variant="h6"
                noWrap
                component="a"
                onClick={() => navigate("/home")}
                style={{ cursor: "pointer" }}
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                BIKES
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {user.role === "manager" ? (
                    <>
                      {pages_manager.map((page) => (
                        <MenuItem
                          key={page}
                          onClick={() => handleCloseNavMenu(page)}
                        >
                          <Typography textAlign="center">{page}</Typography>
                        </MenuItem>
                      ))}
                    </>
                  ) : (
                    <>
                      {pages.map((page) => (
                        <MenuItem
                          key={page}
                          onClick={() => handleCloseNavMenu(page)}
                        >
                          <Typography textAlign="center">{page}</Typography>
                        </MenuItem>
                      ))}
                    </>
                  )}
                </Menu>
              </Box>
              <BookOnlineIcon
                sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/home"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                BIKES
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {user.role === "manager" ? (
                  <>
                    {pages_manager.map((page) => (
                      <Button
                        key={page}
                        onClick={() => handleCloseNavMenu(page)}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        {page}
                      </Button>
                    ))}
                  </>
                ) : (
                  <>
                    {pages.map((page) => (
                      <Button
                        key={page}
                        onClick={() => handleCloseNavMenu(page)}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        {page}
                      </Button>
                    ))}
                  </>
                )}
              </Box>
              <Box>
                {props && (
                  <p style={{ margin: "10px" }}>{props?.user?.fullName}</p>
                )}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={props && props?.user?.fullName}
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {user.role === "manager" ? (
                    <>
                      {settings_manager.map((setting) => (
                        <MenuItem
                          key={setting}
                          onClick={() => handleCloseUserMenu(setting)}
                        >
                          <Typography textAlign="center">{setting}</Typography>
                        </MenuItem>
                      ))}
                    </>
                  ) : (
                    <>
                      {settings.map((setting) => (
                        <MenuItem
                          key={setting}
                          onClick={() => handleCloseUserMenu(setting)}
                        >
                          <Typography textAlign="center">{setting}</Typography>
                        </MenuItem>
                      ))}
                    </>
                  )}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </>
  );
};
export default NavBar;
