import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { MonitorProvider } from './services/monitor';
import { Example2 } from './example2';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/*<MonitorProvider>*/}
      <QueryClientProvider client={queryClient}>
        <Example2 />
      </QueryClientProvider>
    {/*</MonitorProvider>*/}
  </React.StrictMode>,
);

console.log(`branch: ${import.meta.env.GIT_BRANCH}`);
console.log(`commit: ${import.meta.env.GIT_SHA}`);
console.log(`e2e: ${import.meta.env.E2E || 'false'}`);
