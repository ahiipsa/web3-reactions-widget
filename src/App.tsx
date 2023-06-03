import React from 'react';
import {WidgetContainer} from "./ReactionWidget/WidgetContainer";
import {WagmiConfigProvider} from "./wagmi/WagmiConfigProvider";
import {RouterProvider, createBrowserRouter } from "react-router-dom";
import {WidgetEditor} from "./ReactionWidget/WidgetEditor";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WidgetEditor />,
  },
  {
    path: '/widget/:widgetId',
    element: <WidgetContainer />
  }
]);

function App() {
  return (
    <WagmiConfigProvider>
      <RouterProvider router={router} />
    </WagmiConfigProvider>
  );
}

export default App;
