from lib.estimate.estimate import get_confidence_score, get_followup, get_estimate
from src.lib.estimate.prompts import sample_description, sample_followup, sample_followup_response
from src.lib.models import EstimateFormData


sample_formdata: EstimateFormData = {
    'description': sample_description,
    # 'nutrient_fields': ['calories', 'fat']
}

def test_confidence_score():
    cs = get_confidence_score(sample_formdata['description'])
    print('CS: ', cs)
    assert isinstance(cs, int)
    assert 0 < cs <= 10
    
def test_followup():
    followup = get_followup(sample_formdata)
    print('FOLLOWUP: ', followup)
    assert isinstance(followup, str)
    
def test_estimate_without_followup():
    estimate_result = get_estimate(sample_formdata)
    print(estimate_result)
    
def test_estimate_with_followup():
    fd = sample_formdata
    fd['followup'] = sample_followup
    fd['followup_response'] = sample_followup_response
    estimate_result = get_estimate(fd)
    print(estimate_result)