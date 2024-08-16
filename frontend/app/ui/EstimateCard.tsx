export default function EstimateCard({ estimate }: { estimate: any }) {
    return (
        <div>
            {
                Object.keys(estimate).map((k) => (
                    <div className="flex items-center justify-between" key={k}>
                        <span>{k}</span>
                        <span className="font-medium">
                            {estimate[k].min}-{estimate[k].max} {estimate[k].unit}
                        </span>
                    </div>
                ))
            }
        </div>
    )
}