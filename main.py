from flask import Flask, redirect, render_template, url_for, request
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'spdmvpo34#>Q'

#* Access food data
with open('./data/foods.json', mode='r') as file:
    data = json.load(file)

@app.route('/')
def index():
    return render_template('index.html')

#* Handle Calorie Search
@app.route('/search-calorie', methods=['POST', 'GET'])
def search_calorie():
    if request.method == 'POST':
        user_input = request.form.get('search-bar')
        for i in data:
                if user_input and user_input.lower() in i['name'].lower():
                    calories = i['calories']
                    serving = i['serving']
                    category = i['category']
                    food = i['name']
                    return render_template('index.html', food=food, calories=calories, serving=serving, category=category)
                elif not user_input:
                     return {'False': 'False'}
        if user_input.lower() not in i['name'].lower():
            return {'False': 'False'}
        
if __name__ == '__main__':
    app.run(debug=True)