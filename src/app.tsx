import { useRoutes } from 'react-router-dom';

import ForgetPass from './components/forget-pass';
import ResetPass from './components/reset-pass';
import Protected from './components/protected';
import Signup from './components/signup';
import Login from './components/login';
import Chat from './components/chat';

const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forget-pass",
    element: <ForgetPass />,
  },
  {
    path: "/reset-pass",
    element: <ResetPass />,
  },
  {
    path: "/",
    element: <Protected />,
    children: [
      {
        path: "/",
        index: true,
        element: <Chat />,
      },
    ]
  },
]

function App() {
  const routeList = useRoutes(routes)

  return routeList
}

export default App
