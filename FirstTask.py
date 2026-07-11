
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("indexpractice.html")
def get_response(message):
    message = message.lower()
    if message in ["hi", "hello", "hey"]:
        return "Hello! How can I assist you today?"
    elif message=="how are you?":
        return "I'm Fine, thank you! How about you?"
    elif message=="what is your name?":
        return "I am your friendly assistant. You can call me ChatBot!"
    elif message=="what is machine learning?":
        return "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed."
    elif message=="what is deep learning?":
        return "Deep learning is a subset of machine learning that uses neural networks with many layers to analyze various factors of data."
    elif message=="what is artificial intelligence?":
        return "Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems."
    elif message=="what is natural language processing?":
        return "Natural language processing (NLP) is a field of artificial intelligence that focuses on the interaction between computers and humans through natural language."
    elif message=="what is LLM?":
        return "LLM stands for Large Language Model, which is a type of artificial intelligence model designed to understand and generate human-like text based on the data it has been trained on."
    elif message=="can you tell me about ai agent?":
        return "An AI agent is an AI system that doesn't just answer questions—it can plan, make decisions, use tools, and take actions to achieve a goal." \
        "Think of the difference like this:"\
        "Traditional chatbot:" "What's the weather tomorrow?" "→ Gives you the forecast."\
"AI agent:" "Plan a picnic for tomorrow." "→ Checks the weather, finds a park, suggests a packing list, creates a calendar event, and (if connected) could even book transportation or order supplies."
    
    elif message=="give me a definition of prompt?":
        return "A prompt is the input, question, or instruction given to an AI model" " " "to tell it what task to perform or what response to generate."
    elif message=="give me a definition of models":
        return"Models are AI systems that have been trained on large amounts of data to perform specific tasks, such as understanding language, recognizing images, or making predictions."
    elif message in ["bye", "goodbye", "see you later","exit"]:
        return "Goodbye! Have a great day!"
    else:
        return "I'm sorry, I don't understand that. Can you please rephrase or ask something else?"

@app.route("/chat", methods=["POST"])
def chat():

    data = request.json

    message = data["message"]

    reply = get_response(message)

    return jsonify({
        "reply": reply
    })


if __name__ == "__main__":
    app.run(debug=True)