from lib.estimate import get_estimate
import lib.prompts as p


if __name__ == '__main__':
    print(get_estimate(
        p.sample_description,
        p.sample_followup,
        p.sample_followup_response
    ))