import React from 'react';
import { useRoute } from './router.js';
import Landing from './screens/Landing.jsx';
import Host from './screens/Host.jsx';
import Player from './screens/Player.jsx';

export default function App() {
  const route = useRoute();

  if (route.name === 'host') return <Host />;
  if (route.name === 'join') return <Player initialCode={route.code} />;
  return <Landing />;
}
