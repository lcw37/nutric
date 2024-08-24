'use client'


import { format } from 'date-fns';
import { useRouter } from 'next/navigation';


export default function LogView() {
    // if the user visits /log/view, redirect them to /log/view/[today's date]
    const router = useRouter();
    const todaysDate = format(new Date(), 'MM-dd-yyyy')
    const url = `/log/view/${todaysDate}`
    router.replace(url)
    return (
        <></>
    );
};
