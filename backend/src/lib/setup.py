from dotenv import load_dotenv

# load env variables in separate file so I can import at the top of main.py
# otherwise, I will get a linting warning
_ = load_dotenv()