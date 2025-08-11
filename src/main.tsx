import { createRoot } from 'react-dom/client'
import './index.css'
import "./fonts.css";
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
    defaultOptions: {
        queries : {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
            // @ts-ignore
            cacheTime: 1000 * 60 * 10,
        }
    }
})

createRoot(document.getElementById('root')!).render(
    <CookiesProvider>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
            <div className='flex items-center jakarta relative justify-center'>
                <Toaster position='top-center'/>
                <App />
            </div>
            </BrowserRouter>
        </QueryClientProvider>
    </CookiesProvider>
)
