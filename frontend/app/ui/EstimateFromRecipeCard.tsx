export default function EstimateFromRecipeCard({ estimateFromRecipe, servings }: { estimateFromRecipe: any, servings: number }) {
    console.log(servings)
    return (
        <div>
            {
                Object.keys(estimateFromRecipe).map((k) => (
                    <div className="flex items-center justify-between" key={k}>
                        <span>{k}</span>
                        <span className="font-medium">{+(servings * estimateFromRecipe[k].val).toFixed(1)} {estimateFromRecipe[k].unit}</span>
                    </div>
                ))
            }
        </div>
    )
}