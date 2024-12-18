import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F

import time 
import requests
import threading
import json

# Serveur Flask avec torch
from flask import Flask, request, jsonify

# Initialisation de l'application Flask
app = Flask(__name__)

# Function to send requests to the Express server every 5 seconds
def send_to_express():
    url = "http://127.0.0.1:3000"  # Endpoint of the Express server
    while True:
        try:
            response = requests.get(url+'/messages', timeout=5)

            if response.status_code == 200:
                messages = json.loads(response.text)
                
                #if not messages:
                    #print("No unevaluated messages found.")
                if messages:
                    print(f"Fetched {len(messages)} messages.")
                    
                    # Iterate through each message
                    for message in messages:
                        harassment = getHarassment(message['message'])['harassment-probability']
                        # print(f"ID: {message['id']}")
                        # print(f"Harassment: {harassment}")

                        # Set toxicity 
                        payload = {"messageId": message['id'], "toxicity": harassment}
                        response = requests.post(url+'/evaluate', json=payload, timeout=5)
                    print("Evaluations done!")
        except Exception as e:
            print(f"Error while sending request to Express: {e}")
        finally:
            # Wait 5 seconds before the next request
            time.sleep(5)

# Route /evaluate pour evaluer le message
@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.get_json()
    
    # Vérification que 'text' existe dans les données
    if not data or 'message' not in data:
        return jsonify({"error": "Le champ 'text' est requis"}), 400
    
    # Transformation du texte en majuscules
    message = data['message']
    
    harassment = getHarassment(message)
    
    # Renvoi de la réponse sous forme JSON
    return jsonify(harassment)

def getHarassment(message):
    input = tokenizer(
        message,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=128
    )

    with torch.no_grad():
        output = model(**input)
        logit = output.logits
        probability = F.softmax(logit, dim=-1)

    prob = probability[0]
    
    return {"input": message, "harassment-probability": f"{prob[1]:.4f}", "no-harassment-probability": f"{prob[0]:.4f}"}

if __name__ == '__main__':
    # Initialisation du modele
    model_dir = "./harassment_model_save"
    model = AutoModelForSequenceClassification.from_pretrained(model_dir)
    tokenizer = AutoTokenizer.from_pretrained(model_dir)

    model.eval()

    # Start the background thread when Flask starts
    threading.Thread(target=send_to_express, daemon=True).start()

    # Lancement du serveur Flask
    app.run(port=5000)
