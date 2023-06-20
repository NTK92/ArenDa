import Home from "./components/Home";
import Ads from "./pages/Ads";
import FlatPage from "./pages/FlatPage";
import PersonalAccount from "./pages/PersonalAccount";
import AccountModify from "./pages/AccountModify";
import AccountManage from "./pages/AccountManage";
import AccountMessages from "./pages/AccountMessages";
import AccountAddNew from "./pages/AccountAddNew";

const AppRoutes = [
  {
    index: true,
    element: <Home />,
    path: '',
    exact: true
  },
 
  ,
  {
    index: true,
    element: <Ads />,
    path: 'ads',
    exact: true
  },
  
  {
    index: true,
    element: <FlatPage />,
    path: 'flats/:id',
    exact: true
  }
  ,
  {
    index: true,
    element: <PersonalAccount />,
    path: 'account',
    exact: true
  },
  {
    index: true,
    element: <AccountModify />,
    path: 'account/modify',
    exact: true
  },
  {
    index: true,
    element: <AccountManage />,
    path: 'account/manage',
    exact: true
  },
  {
    index: true,
    element: <AccountAddNew />,
    path: 'account/new_ad',
    exact: true
  },
  {
    index: true,
    element: <AccountMessages />,
    path: 'account/messages',
    exact: true
  }
];

export default AppRoutes;
