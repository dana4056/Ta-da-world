import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './layout/RootLayout';

import MainPage from './pages/MainPage';
import CampsPage from './pages/CampsPage';
import UsPage from './pages/UsPage';
import MyCampPage from './pages/MyCampPage';
import DealPage from './pages/DealPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <MainPage/> },
      {
        path: "mycamp",
        element: <MyCampPage/>
      },
      {
        path: "camps",
        element: <CampsPage/>
      },
      {
        path: "deal",
        element: <DealPage/>
      },
      {
        path: "us",
        element: <UsPage/>
      }
    ]
  },
]);

export default router;