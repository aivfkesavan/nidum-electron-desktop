import { useRoutes } from 'react-router-dom';

import ForgetPass from './components/forget-pass';
import ResetPass from './components/reset-pass';
import Protected from './components/protected';
import Messages from './components/chat/messages';
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
        element: <Chat />,
        children: [
          {
            index: true,
            element: <Messages />,
          },
          {
            path: "/p/:project_id",
            element: <Messages />,
          },
          {
            path: "/p/:project_id/c/:chat_id",
            element: <Messages />,
          },
        ]
      },
    ]
  },
]

function App() {
  const routeList = useRoutes(routes)

  return routeList
}

export default App
