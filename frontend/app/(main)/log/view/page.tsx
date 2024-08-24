'use client'


import { format } from 'date-fns';
import { useRouter } from 'next/navigation';


export default function LogView() {
    const router = useRouter();
    const todaysDate = format(new Date(), 'MM-dd-yyyy')
    const url = `/log/view/${todaysDate}`
    router.replace(url)
    return (
        <></>
    );
};
