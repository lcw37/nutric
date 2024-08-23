confidence_score_prompt = """
    Given the following description of food:
    {description}

    If you were to try to make a reasonable estimate of the nutrition facts from this description that is within plus-minus 50 calories of the actual value, how confident would you be in the accuracy? 

    Respond with a confidence score 1-10 as JSON: {{\"confidence_score\": <score>}}. Only return the JSON string.

    Examples:
    Input 1: \"a tofu salad\"
    Output 1: {{\"confidence_score\": 4}}
    Input 2: \"chicken parm (1 breast), half a box of penne, a scoop of parmesan cheese, a glass of white wine\"
    Output 2: {{\"confidence_score\": 7}}
"""

followup_prompt = """
    Given the following description of food:
    {description}

    Suppose you need to try to make a reasonable estimate of the nutrition facts from this description that is within plus-minus 50 calories of the actual value. 
    Other than exact portion sizes, what additional information could the user provide you to help you make a better estimate? Assume you are estimating for 1 serving.

    Respond with a string of at most 2 questions as JSON:
    {{\"followup\": <string of questions>}}. Only return the JSON string.

    Examples:
    Input 1: \"a tofu salad\"
    Output 1: {{\"followup\": \"Did your salad have any dressing or other toppings? Roughly what portion size was your salad?\"}}
"""

estimate_prompt = """
    Given the following description of food:
    {description}

    {followup_info}

    Try to make a reasonable estimate of the nutrition facts from this description that is within plus-minus 50 calories of the actual value.

    Respond with a meal title and estimate of min-max range pairs for each field in {nutrient_fields} as JSON:
    {{
        title: <string>,
        nutrition_breakdown: {{
        <field>: {{
            min: <number>, 
            max: <number>, 
            unit: <string>]
        }}
    }}. Only return the JSON string.
    
    Examples:
    Input 1: \"a tofu salad, carrots, a glass of wine\"
    Output 1: {{
        \"title\": \"tofu salad, carrots, and wine\", 
        \"nutrition_breakdown\": 
        {{\"calories\": 
            {{\"min\": 400, \"max\": 450, \"unit\": \"cal\"}}, 
        \"carbs\": 
            {{\"min\": 10, \"max\": 15, \"unit\": \"g\" }} 
        }}
    }}
    
    Double-check that each field in {nutrient_fields} is present in the final JSON output. 
"""

followup_info_prompt = """
    And the followup response for additional information: 
    Followup Question: {followup}
    User Response: {followup_response}
"""

########### SAMPLE INPUTS ###########

sample_description = """
    1 small plate/bowl of baked eggplant parm,
    1 small bowl of baked carrots,
    1 slice of whole wheat bread
"""

sample_followup = """
    What type of cheese and sauce were used in the eggplant parm? Were any oils or fats used in the preparation of the eggplant or carrots?
"""

sample_followup_response = """
    Mozzarella cheese, tomato sauce. Olive oil only.
"""