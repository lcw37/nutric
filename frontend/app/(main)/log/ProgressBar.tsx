import { Skeleton } from "@/components/ui/skeleton"
import clsx from "clsx"


export function ProgressBar({
    title,
    minMaxPair,
    target
}: {
    title: string,
    minMaxPair: any
    target: number,
}) {
    const { min: currentMin, max: currentMax, unit } = minMaxPair
    const progressMin = currentMin / target * 100
    const progressMax = currentMax / target * 100
    const progressAvg = ( progressMin + progressMax ) / 2

    const isRange = (currentMin !== currentMax)


    let numberText = `${+(currentMin).toFixed(1)} / ${+(target).toFixed(1)} ${unit}`
    let percentText = `${progressAvg.toFixed(0)}%`
    if (isRange) {
        numberText = `(${+(currentMin).toFixed(1)} - ${+(currentMax).toFixed(1)}) / ${+(target).toFixed(1)} ${unit}`
        percentText = `~${progressAvg.toFixed(0)}%`
    }

    return (
        <div>
            {/* text above progress bar */}
            <div className="flex justify-between items-baseline">
                <div className="flex items-baseline gap-4">
                    <div>{title}</div>
                    <div className="text-xs text-muted-foreground">
                        {numberText}
                    </div>
                </div>
                <div 
                    className={clsx('text-right text-xs text-muted-foreground', {
                        'text-red-400 font-bold': progressMin > 100 // make text red if >100%
                    })}
                >
                    {percentText}
                </div>
                
            </div>

            {/* progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 relative">
                <div 
                    className={clsx('h-2 rounded-full', {
                        'bg-emerald-300': !(progressMin < 100 && 100 < progressMax) && !(progressMin > 100),
                        'bg-yellow-300': progressMin < 100 && 100 < progressMax,
                        'bg-red-300': progressMin > 100,
                    })}
                    style={{width: `${progressAvg}%`, maxWidth: '100%'}} 
                />
            </div>
        </div>
    )
}


export function SkeletonProgressBar() {
    return (
        <div className="grid gap-1">
            {/* text above progress bar */}
            <div className="flex justify-between items-baseline">
                <div className="flex items-baseline gap-4">
                    <Skeleton className="h-4 w-14"/>
                    <Skeleton className="h-3 w-16"/>
                </div>
                <Skeleton className="h-3 w-5"/>
            </div>

            {/* progress bar */}
            <Skeleton className="h-2 w-full rounded-full relative"/>
        </div>
    )
}