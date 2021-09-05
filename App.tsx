import React, { useEffect, useState } from 'react';
import 'text-encoding';
import 'react-native-get-random-values'
import 'react-native-polyfill-globals/auto';
import "react-native-wasm";
import AppNavigation from './navigation/AppNavigation';
import { RecoilRoot } from 'recoil';
import { LogBox } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { graph } from './backend/graph/graph'


LogBox.ignoreLogs(['Setting a timer']);

const App = () => {
  const [myGraph, setMyGraph] = useState(null);
  async function createGraph() {
    const myGraph = await graph();
    return myGraph
  }

  useEffect(() => {
    (async () => {
      const temp = await createGraph()
      setMyGraph(temp)
    })()

  }, []);

  return (
    <RecoilRoot>
      <RootSiblingParent>
        <AppNavigation />
      </RootSiblingParent>
    </RecoilRoot>
  );
};

export default App;
