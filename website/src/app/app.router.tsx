import { createBrowserRouter } from 'react-router-dom';
import App from './app';
import Bio from './bio/bio';
import Home from './home/home';
import Support from './support/support';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'bio',
        element: <Bio />,
      },
      {
        path: 'support',
        element: <Support />,
      },
    ],
  },
]);

export default AppRouter;
