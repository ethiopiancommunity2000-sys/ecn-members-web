import { createBrowserRouter, type RouteObject } from "react-router-dom";
import App from "../layout/App";
import About from "../../../component/About";
import Account from "../../../component/Account";
import Contact from "../../../component/Contact";
import Home from "../../../component/Home";
import NotFound from "../../../component/NotFound";
import ReceiptImage from "../../../component/ReceiptImage";
import ECNPaymentInstructions from "../../../component/ECNPaymentInstructions";
import LoginPage from "../../../component/LoginForm";
import MemberDashboard from "../features/members/dashboard/MemberDashboard";
import DetailDisplay from "../features/members/dashboard/DetailDisplay";
import { MemberFormWrapper } from "../features/members/form/MemberFormWrapper";
import RequireAuth from "./RequireAuth";
 


const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'account', element: <Account /> },
      { path: 'contact', element: <Contact /> },
         { path: 'terms', element: <ECNPaymentInstructions /> },
          { path: 'about', element: <About /> },
   
     // { path: 'receipts/:fileId', element: <ReceiptImage /> },
   { path: 'members/receipt/:fileId', element: <ReceiptImage /> },


   
      {
        element: <RequireAuth />,
        children: [
          { path: 'memberList', element: <MemberDashboard /> },
          { path: 'card/:id', element: <DetailDisplay /> },
          { path: 'edit/:id', element: <MemberFormWrapper /> },
          { path: 'create', element: <MemberFormWrapper /> },
        
        ],
      },

      { path: '*', element: <NotFound /> },
    ],
  },
];



export const router = createBrowserRouter(routes); 


//*** */ MemberCard    -- details view
// MemberForm    -- create and edit form
// MemberList    -- list of members
// MemberDashboard -- dashboard view with list of members and create/edit form
// FormDisplaySection -- form display section with create/edit form
// DetailDisplay -- detail view of a single member
// App -- main app layout with routing
// Home -- home page
// About -- about page  
// Contact -- contact page
