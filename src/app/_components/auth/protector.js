import { Suspense } from 'react';
import InrPtrctr from '@/app/_components/auth/inner';

export default function Prtctr({ fallback, children }) {
    return <Suspense fallback={fallback}><InrPtrctr fallback={fallback}>{children}</InrPtrctr></Suspense>;
}