import openai
import os


class Chatbot:
    def __init__(
        self,
        system_prompt="You are a helpful assistant",
        temperature=0.7,
        model_name="gpt-4o",
        max_tokens=1024,
    ):
        self.api_key = os.getenv(
            "OPENAI_API_KEY"
        )  # Use provided key or fallback to env var
        self.system_prompt = system_prompt
        self.temperature = temperature
        self.model_name = model_name
        self.max_tokens = max_tokens

        if not self.api_key:
            raise ValueError(
                "OpenAI API key is required. Set it in an environment variable or pass it to the constructor."
            )

        openai.api_key = self.api_key

    def get_response(self, user_message):
        """Generates a chatbot response given a user message."""
        try:
            response = openai.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": user_message},
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
            )
            return response.choices[0].message.content
        except openai.OpenAIError as e:
            return f"Error: {e}"
