
#Question 2. TF*IDF-based IR Model 
#EISEN ED C. BRIONES
#12300098
# Week 2+3 (parsing) + Week 4 (df computation)


import glob, os
import string
import math
from stemming.porter2 import stem


# Doc Class
class Doc:
    def __init__(self, docID):
        self.docID = docID
        self.terms = {}
        self.doc_size = 0

    def get_docID(self):
        return self.docID

    def get_termList(self):
        return sorted(self.terms.keys())

    def get_doc_size(self):
        return self.doc_size

    def set_doc_size(self, size):
        self.doc_size = size

    def add_term(self, term):
        try:
            self.terms[term] += 1
        except KeyError:
            self.terms[term] = 1



# Task 1.1 - docParser
def docParser(stop_words, folder):
    
    #Parse all XML documents in the folder and return a dictionary {docID: Doc}.
    coll = {}
    curr_path = os.getcwd()
    os.chdir(folder)

    for file_ in glob.glob("*.xml"):
        curr_doc = Doc('')
        start_end = False
        word_count = 0

        for line in open(file_):
            line = line.strip()

            if(start_end == False):
                if line.startswith("<newsitem "):
                    for part in line.split():
                        if part.startswith("itemid="):
                            docid = part.split("=")[1].split("\"")[1]
                            curr_doc.docID = docid
                            break
                if line.startswith("<text>"):
                    start_end = True
            elif line.startswith("</text>"):
                break
            else:
                # Remove <p> and </p> tags
                line = line.replace("<p>", "").replace("</p>", "")
                # Remove digits and replace punctuations with spaces
                line = line.translate(str.maketrans('', '', string.digits)).translate(
                    str.maketrans(string.punctuation, ' ' * len(string.punctuation)))

                for term in line.split():
                    word_count += 1  # count all words for doc_size
                    term = stem(term.lower())
                    if len(term) > 2 and term not in stop_words:
                        curr_doc.add_term(term)

        curr_doc.set_doc_size(word_count)
        coll[curr_doc.docID] = curr_doc

    os.chdir(curr_path)
    return coll


# Task 1.2 - queryParser
def queryParser(query, stop_words):
    # Parse a query string using the same preprocessing as docParser and returns a dictionary {term: frequency}.
    query_terms = {}
    query = query.translate(str.maketrans('', '', string.digits)).translate(
        str.maketrans(string.punctuation, ' ' * len(string.punctuation)))

    for term in query.split():
        term = stem(term.lower())
        if len(term) > 2 and term not in stop_words:
            try:
                query_terms[term] += 1
            except KeyError:
                query_terms[term] = 1

    return query_terms




# Task 2.1 - df (follows wk4 c_df style)
def df(coll):
    #Calculate DF of each term in the collection.
    df_ = {}
    for id, doc in coll.items():
        for term in doc.terms.keys():
            try:
                df_[term] += 1
            except KeyError:
                df_[term] = 1
    return df_


# Task 2.2 - tf_idf using Equation (1)
#
#   w_ki = ((1 + log(f_ki)) * log(N / n_k))
#          / sqrt( sum_j [ (1+log(f_ji)) * log(N/n_j) ]^2 )
#
#   log = base 10
def tf_idf(doc, df_, ndocs):

    #Compute TF*IDF weight for each term in a document.
    if isinstance(doc, Doc):
        terms = doc.terms
    else:
        terms = doc

    # Compute unnormalised weights
    weights = {}
    for term, freq in terms.items():
        ni = df_.get(term, 0)
        if ni > 0:
            tf_part = 1 + math.log10(freq)
            idf_part = math.log10(ndocs / ni)
        else:
            tf_part = 1 + math.log10(freq)
            idf_part = math.log10(ndocs)
        weights[term] = tf_part * idf_part

    # Cosine normalisation
    norm = math.sqrt(sum(w ** 2 for w in weights.values()))

    tfidf = {}
    if norm > 0:
        for term, w in weights.items():
            tfidf[term] = w / norm
    else:
        tfidf = weights

    return tfidf


# Task 2.3 - Main
if __name__ == '__main__':

    # Load stop words
    stopwords_file = open('common-english-words.txt', 'r')
    stop_words = stopwords_file.read().split(',')
    stopwords_file.close()

    # Add extra stop words 
    stop_words += ["quot", "amp", "reuter", "reuters"]

    # Parse documents
    collection = docParser(stop_words, 'Subset_RCV1v2')
    ndocs = len(collection)

    # Compute document frequencies
    df_ = df(collection)

    out = open('EisenEdBriones_Q2.txt', 'w')

    # Print collection info
    header = "There are " + str(ndocs) + " documents in this data set and contains " + str(len(df_)) + " terms"
    print(header)
    out.write(header + '\n')

    print("The following are the terms' document-frequency:")
    out.write("The following are the terms' document-frequency:\n")
    sorted_df = sorted(df_.items(), key=lambda x: (-x[1], x[0]))
    for term, d in sorted_df:
        print(term + ' : ' + str(d))
        out.write(term + ' : ' + str(d) + '\n')
    print()
    out.write('\n')

    # Compute and print TF*IDF weights for each document (top 20)
    for docID in sorted(collection.keys(), key=lambda x: int(x)):
        doc = collection[docID]
        tfidf = tf_idf(doc, df_, ndocs)

        header = "Document " + docID + " contains " + str(len(doc.terms)) + " terms"
        print(header)
        out.write(header + '\n')

        sorted_tfidf = sorted(tfidf.items(), key=lambda x: (-x[1], x[0]))
        for term, weight in sorted_tfidf[:20]:
            print(term + ' : ' + str(weight))
            out.write(term + ' : ' + str(weight) + '\n')
        print()
        out.write('\n')

    # TF*IDF-based IR Model - Equation (2): R(q,doc) = sum_i(w_i(q) * w_i(doc))
    queries = [
        "The British-Fashion Awards",
        "US EPA ranks Geo Metro car most fuel-efficient 1997 car",
        "UK: Britain's Channel 5 to broadcast Fashion Awards."
    ]

    for q in queries:
        q_terms = queryParser(q, stop_words)
        q_tfidf = tf_idf(q_terms, df_, ndocs)

        scores = {}
        for docID, doc in collection.items():
            doc_tfidf = tf_idf(doc, df_, ndocs)
            score = 0.0
            for term in q_tfidf:
                if term in doc_tfidf:
                    score += q_tfidf[term] * doc_tfidf[term]
            scores[docID] = score

        sorted_scores = sorted(scores.items(), key=lambda x: (-x[1], x[0]))

        print("The Ranking Result for query: " + q)
        out.write("The Ranking Result for query: " + q + '\n')
        for docID, score in sorted_scores:
            print(docID + ' : ' + str(score))
            out.write(docID + ' : ' + str(score) + '\n')
        print()
        out.write('\n')

    out.close()
    print("Results saved to EisenEdBriones_Q2.txt")
