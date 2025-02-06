import { ToastContainer } from 'react-toastify';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppRoute from './routes/AppRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {

  return (
    <>
     <QueryClientProvider client={queryClient}>
        <AppRoute />
        <ToastContainer />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  )
}

export default App
