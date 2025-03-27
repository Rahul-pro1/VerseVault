from flask import Flask, request, jsonify  # type: ignore
from recommender import get_book_recommendations  # Ensure this function works correctly

app = Flask(__name__)

@app.route("/book_recommend", methods=['POST'])
def book_recommend():
    try:
        # Get JSON data from the request
        data = request.get_json()

        data = data['books']

        if not isinstance(data, list):
            return jsonify({'error': 'Expected a list of books'}), 400

        # Generate recommendations for each book
        recommendations = [get_book_recommendations(book) for book in data]

        return jsonify({'recommendations': recommendations})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
