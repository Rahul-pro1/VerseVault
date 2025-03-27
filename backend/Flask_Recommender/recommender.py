import sys
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
from scipy.sparse import hstack
import difflib
import json

# Load and preprocess dataset globally to avoid reloading it for every call
dataset = pd.read_csv("./goodreads_data.csv")
dataset.fillna('', inplace=True)
combined_features = dataset['Author'] + dataset['Genres'] + dataset['Description']
dataset['combined_features'] = combined_features

# Fit the TF-IDF vectorizer globally to save computation time
vect = TfidfVectorizer()
feature_vectors = vect.fit_transform(combined_features)

# Precompute cosine similarity matrix
cosine_sim = cosine_similarity(feature_vectors)

def get_book_recommendations(book_title, top_n=3):
    """
    Generate book recommendations based on the given book title.

    Args:
        book_title (str): The title of the book to base recommendations on.
        top_n (int): The number of recommendations to return.

    Returns:
        list: A list of recommended book titles.
    """
    try:
        # Find the closest match for the given book title
        close_match = difflib.get_close_matches(book_title, dataset['Book'], n=1)
        if not close_match:
            return []  # Return empty list if no match is found
        
        # Get the index of the closest matching book
        index = dataset['Unnamed: 0'][dataset['Book'] == close_match[0]].values[0]
        
        # Compute similarity scores for the given book
        similarity_scores = list(enumerate(cosine_sim[index]))
        
        # Sort books by similarity scores in descending order
        sorted_books = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
        
        # Extract top N recommended book indices
        recommended_indices = [item[0] for item in sorted_books[:top_n + 1] if item[0] != index]  # Exclude the input book
        
        # Get the titles of the recommended books
        recommended_books = dataset.iloc[recommended_indices]['Book'].tolist()
        
        return recommended_books
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return []

# # Example usage
# if __name__ == "__main__":
#     book_title = sys.argv[1]
#     recommendations = get_book_recommendations(book_title)
#     print(json.dumps(recommendations))
