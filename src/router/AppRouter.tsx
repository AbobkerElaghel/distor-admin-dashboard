// Components
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { default as MuiLink } from '@mui/material/Link';
// Components

// Icons
// import HomeIcon from '@mui/icons-material/Home';
import Moon from '@mui/icons-material/Brightness2';
import Sun from '@mui/icons-material/WbSunny';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArticleIcon from '@mui/icons-material/Article';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import CreateIcon from '@mui/icons-material/Create';
// Icons

// Utils
import { Suspense, useContext, useState, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Switch, useLocation } from 'wouter';
// Utils

// Providers
import { AuthContext } from '../providers/AuthProvider';
import { ThemeContext } from '../providers/ThemeProvider';
import { RTLContext } from '../providers/RTLProvider';
// Providers

// Interfaces
import LinkRouterProps from '../interfaces/LinkRouterProps';
// Interfaces

// Objects
import transitionAllSX from '../helpers/transitionAllSX';
// Objects

// Lazy Loading Components //
// Pages
const LogInPage = lazy(() => import('../pages/LogInPage'));
const AddBlogs = lazy(() => import('../pages/Blogs/AddBlogs'));
const Users = lazy(() => import('../pages/Users/Users'));
const Blogs = lazy(() => import('../pages/Blogs/Blogs'));
const MainPage = lazy(() => import('../pages/MainPage'));
const PublicRoute = lazy(() => import('./PublicRoute'));
const PrivateRoute = lazy(() => import('./PrivateRoute'));
const AddUser = lazy(() => import('../pages/Users/AddUser'));
const EditBlogs = lazy(() => import('../pages/Blogs/EditBlogs'));
const Files = lazy(() => import('../pages/Files/Files'));
const AddFile = lazy(() => import('../pages/Files/AddFile'));
const News = lazy(() => import('../pages/News/News'));
const AddNews = lazy(() => import('../pages/News/AddNews'));
const EditNews = lazy(() => import('../pages/News/EditNews'));
const Activities = lazy(() => import('../pages/Activities/Activities'));
const AddActivities = lazy(() => import('../pages/Activities/AddActivities'));
const EditActivities = lazy(() => import('../pages/Activities/EditActivities'));
const Signatures = lazy(() => import('../pages/Signatures/Signatures'));

// Pages
// Lazy Loading Components //
const drawerWidth = 250;
export default function ResponsiveDrawer() {

  const [mobileOpen, setMobileOpen] = useState(false);
  const Theme = useContext(ThemeContext);
  const RTL = useContext(RTLContext);
  const Auth = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [location] = useLocation();

  const LinkRouter = (props: LinkRouterProps) => (
    <MuiLink {...props} component={Link as any} />
  );

  const breadcrumbNameMap: { [key: string]: string } = {
    '/': t('breadcrumbNameMap./'),
    '/news': t('breadcrumbNameMap./news'),
    '/news/new': t('breadcrumbNameMap./news/new'),
    '/news/edit': t('breadcrumbNameMap./news/edit'),
    '/activities': t('breadcrumbNameMap./activities'),
    '/activities/new': t('breadcrumbNameMap./activities/new'),
    '/activities/edit': t('breadcrumbNameMap./activities/edit'),
    '/blogs': t('breadcrumbNameMap./blogs'),
    '/blogs/new': t('breadcrumbNameMap./blogs/new'),
    '/blogs/edit': t('breadcrumbNameMap./blogs/edit'),
    '/users': t('breadcrumbNameMap./users'),
    '/users/new': t('breadcrumbNameMap./users/new'),
    '/users/edit/id': t('breadcrumbNameMap./users/edit/id'),
    '/files': t('breadcrumbNameMap./files'),
    '/files/new': t('breadcrumbNameMap./files/new'),
    '/signatures': t('breadcrumbNameMap./signatures'),
  };

  const pathnames = location.split('/').filter((x) => x);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div style={{
      padding: "0 0.5rem"
    }}>
      <Toolbar />
      {/* General */}
      <List subheader={<ListSubheader sx={{ ...transitionAllSX, fontSize: i18n.resolvedLanguage === 'ar' ? '1.4rem' : "'1.1rem'" }}>{t('sidebar.subheaderTitlesGeneral')}</ListSubheader>}>
        {[
          // { title: t('sidebar.main'), Icon: HomeIcon, href: "/" },
          { title: t('sidebar.blogs'), Icon: ArticleIcon, href: "/blogs" },
          { title: t('sidebar.news'), Icon: NewspaperIcon, href: "/news" },
          { title: t('sidebar.files'), Icon: FileCopyIcon, href: "/files" },
          { title: t('sidebar.activities'), Icon: LocalActivityIcon, href: "/activities" },
          { title: t('sidebar.signatures'), Icon: CreateIcon, href: "/signatures" }

        ].map(({ title, Icon, href }, index) => {
          const isSelected = location === href;
          return (
            <Link key={index} href={href}>
              <ListItemButton sx={transitionAllSX} selected={isSelected} key={title}>
                <ListItemIcon sx={transitionAllSX}>
                  <Icon fontSize='medium' sx={transitionAllSX} color={isSelected ? 'primary' : "action"} />
                </ListItemIcon>
                <ListItemText primary={<Typography sx={transitionAllSX} color={isSelected ? 'primary' : ""} fontSize={i18n.resolvedLanguage === 'ar' ? '1.3rem' : "'1rem'"} fontWeight={500}>{title}</Typography>} />
              </ListItemButton>
            </Link>
          );
        })}
      </List>

      {/* CONTROL - ADMIN ONLY */}
      {Auth?.user?.admin ? <List subheader={<ListSubheader sx={{ ...transitionAllSX, fontSize: i18n.resolvedLanguage === 'ar' ? '1.4rem' : "'1.1rem'" }}>{t('sidebar.subheaderTitlesControl')}</ListSubheader>}>
        {[{ title: t('sidebar.users'), Icon: ManageAccountsIcon, href: "/users" }].map(({ title, Icon, href }, index) => {
          const isSelected = location === href;
          return (
            <Link key={index} href={href}>
              <ListItemButton sx={transitionAllSX} selected={isSelected} key={title}>
                <ListItemIcon sx={transitionAllSX}>
                  <Icon fontSize='medium' sx={transitionAllSX} color={isSelected ? 'primary' : "action"} />
                </ListItemIcon>
                <ListItemText primary={<Typography sx={transitionAllSX} color={isSelected ? 'primary' : ""} fontSize={i18n.resolvedLanguage === 'ar' ? '1.3rem' : "'1.1rem'"} fontWeight={500}>{title}</Typography>} />
              </ListItemButton>
            </Link>
          );
        })}
      </List> : undefined}
    </div>
  );

  return (
    <Suspense fallback="Loading ....">
      <Box sx={{ ...transitionAllSX, display: 'flex' }}>
        {/* Start - SideBar */}
        {Auth?.user ? <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, display: true ? "block" : "none", flexShrink: { md: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{

              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { sm: 'block', md: 'none' },
              '& .MuiDrawer-paper': { ...transitionAllSX, boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{

              display: { xs: 'none', sm: 'none', md: 'block' },
              '& .MuiDrawer-paper': { ...transitionAllSX, boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box> : undefined}
        {/* End - SideBar */}


        {/* Main Section */}
        <Box
          component="main"
          sx={{ ...transitionAllSX, bgcolor: "background.default", height: "100vh", color: "text.primary", flexGrow: 1, p: 2, width: { md: `calc(100% - ${drawerWidth}px)` } }}
        >

          {/* START - Navbar */}
          <Paper variant="elevation" sx={{
            ...transitionAllSX,
            height: '4rem',
            display: "flex",
            marginBottom: 2,
            justifyContent: "space-between"
          }} elevation={3}>

            {/* START - Left Section of the navbar */}
            <Box display={'flex'} sx={{
              ...transitionAllSX,
              margin: "auto 1rem"
            }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mx: 1, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>

              {/* START - NAV Breadcrumbs */}
              <Breadcrumbs sx={{
                padding: 2,
              }} aria-label="breadcrumb">

                {pathnames.map((_, index) => {
                  const last = index === pathnames.length - 1;
                  const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                  return last ? (
                    <Typography color="text.primary" key={to}>
                      {breadcrumbNameMap[to]}
                    </Typography>
                  ) : (
                    <LinkRouter underline="hover" color="inherit" to={to} key={to}>
                      {breadcrumbNameMap[to]}
                    </LinkRouter>
                  );
                })}
              </Breadcrumbs>
              {/* END - NAV Breadcrumbs */}
            </Box>
            {/* END - Left Section of the navbar */}


            {/* START - Right Section of the navbar */}
            <Stack spacing={2} direction={'row'} marginY="auto" marginX={3}>
              <IconButton sx={{
                marginY: "auto"
              }} onClick={() => { Theme?.toggleDarkMode() }}>
                {Theme?.isDarkMode ? <Moon fontSize="medium" /> : <Sun fontSize="medium" />}
              </IconButton>

              <>
                <IconButton sx={{
                  marginY: "auto"
                }}
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  <LanguageOutlinedIcon fontSize="medium" />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={() => {
                    i18n.changeLanguage('en');
                    RTL?.setRTLMode(false);
                    handleClose();
                  }}>{t('navbar.languageMenu-english')}</MenuItem>
                  <MenuItem onClick={() => {
                    i18n.changeLanguage('ar');
                    RTL?.setRTLMode(true);
                    handleClose();
                  }} >{t('navbar.languageMenu-arabic')}</MenuItem>
                  {/* <MenuItem onClick={() => {
                    RTL?.setRTLMode(false);
                    handleClose();
                  }}>{t('navbar.languageMenu-french')}</MenuItem> */}
                </Menu>
              </>

              <Stack marginY="auto" spacing={2} direction="row">
                <Typography marginY="auto" >{Auth?.user?.displayName}</Typography>
                <Avatar src={Auth?.user?.photoURL ? Auth?.user?.photoURL : undefined}>{Auth?.user?.displayName ? Auth?.user?.displayName[0] : 'A'}</Avatar>
              </Stack>
            </Stack>
            {/* END - Right Section of the navbar */}
          </Paper>
          {/* END - Navbar */}

          {/* START - MAIN SECTION */}
          <Suspense fallback={<div>Loading...</div>}>
            <Switch location={location}>
              <PublicRoute path="/login" component={LogInPage} />
              <PrivateRoute path="/" component={MainPage} />
              <PrivateRoute path="/news" component={News} />
              <PrivateRoute path="/news/new" component={AddNews} />
              <PrivateRoute path="/news/edit/:id" component={EditNews} />
              <PrivateRoute path="/activities" component={Activities} />
              <PrivateRoute path="/activities/new" component={AddActivities} />
              <PrivateRoute path="/activities/edit/:id" component={EditActivities} />
              <PrivateRoute path="/blogs" component={Blogs} />
              <PrivateRoute path="/blogs/new" component={AddBlogs} />
              <PrivateRoute path="/blogs/edit" component={Blogs} />
              <PrivateRoute path="/blogs/edit/:id" component={EditBlogs} />
              <PrivateRoute path="/users" component={Users} />
              <PrivateRoute path="/users/new" component={AddUser} />
              <PrivateRoute path="/files" component={Files} />
              <PrivateRoute path="/files/new" component={AddFile} />
              <PrivateRoute path="/signatures" component={Signatures} />
            </Switch>
          </Suspense>
          {/* START - MAIN SECTION */}

        </Box>
      </Box>
    </Suspense >
  );
}