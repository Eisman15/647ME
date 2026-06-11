

#Question 3: BM25-based IR Model
#EISEN ED C. BRIONES
#12300098
# Week 2+3 (parsing) + Week 4 (df computation)+ Week 5 (inverted index)


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


# docParser 
def docParser(stop_words, folder):
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
                line = line.replace("<p>", "").replace("</p>", "")
                line = line.translate(str.maketrans('', '', string.digits)).translate(
                    str.maketrans(string.punctuation, ' ' * len(string.punctuation)))
                for term in line.split():
                    word_count += 1
                    term = stem(term.lower())
                    if len(term) > 2 and term not in stop_words:
                        curr_doc.add_term(term)
        curr_doc.set_doc_size(word_count)
        coll[curr_doc.docID] = curr_doc
    os.chdir(curr_path)
    return coll


# queryParser 
def queryParser(query, stop_words):
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


# df - from wk4 
def df(coll):
    """Calculate DF of each term. Returns {term: df}."""
    df_ = {}
    for id, doc in coll.items():
        for term in doc.terms.keys():
            try:
                df_[term] += 1
            except KeyError:
                df_[term] = 1
    return df_


# Task 3.1 - avg_len
def avg_len(coll):
    """Calculate and return the average document length of all documents."""
    totalDocLength = 0
    for docID, doc in coll.items():
        totalDocLength += doc.get_doc_size()
    return totalDocLength / len(coll)


# ============================================================
# Task 3.2 - bm_25(coll, q, df)
#
# BM25 Equation (3) - log base e (natural log):
#   score = sum_{i in Q} log((ri+0.5)/(R-ri+0.5) / ((ni-ri+0.5)/(N-ni-R+ri+0.5)))
#           * (k1+1)*fi / (K+fi)
#           * (k2+1)*qfi / (k2+qfi)
#
#   K = k1 * ((1-b) + b * dl/avdl)
#   k1=1.2, k2=500, b=0.75, R=0, ri=0
# ============================================================
def bm_25(coll, q, df):

    # Calculate BM25 scores for all documents for query q.
    k1 = 1.2
    k2 = 500
    b = 0.75
    R = 0
    N = len(coll)
    avdl = avg_len(coll)

    # Parse the query using module-level stop_wordList
    q_terms = queryParser(q, stop_wordList)

    scores = {}
    for docID, doc in coll.items():
        score = 0.0
        dl = doc.get_doc_size()
        K = k1 * ((1 - b) + b * (dl / avdl))

        for term, qfi in q_terms.items():
            ni = df.get(term, 0)
            fi = doc.terms.get(term, 0)
            ri = 0

            numerator = (ri + 0.5) / (R - ri + 0.5)
            denominator = (ni - ri + 0.5) / (N - ni - R + ri + 0.5)
            relevance_weight = math.log(numerator / denominator)

            tf_component = ((k1 + 1) * fi) / (K + fi)
            qf_component = ((k2 + 1) * qfi) / (k2 + qfi)

            score += relevance_weight * tf_component * qf_component

        scores[docID] = score

    return scores


# Task 3.3 - Main
if __name__ == '__main__':

    # Load stop words
    stopwords_f = open('common-english-words.txt', 'r') # wk2
    stop_wordList = stopwords_f.read().split(',')
    stopwords_f.close()

    # Add extra stop words 
    stop_wordList += ["quot", "amp", "reuter", "reuters"]

    # Parse documents and compute DF
    coll = docParser(stop_wordList, 'Subset_RCV1v2')
    df_ = df(coll)

    out = open('EisenEdBriones_Q3.txt', 'w')

    # Print average document length
    avdl = avg_len(coll)
    print("Average document length for this collection is: " + str(avdl))
    out.write("Average document length for this collection is: " + str(avdl) + '\n\n')

    # Test with three queries
    queries = [
        "The British-Fashion Awards",
        "US EPA ranks Geo Metro car most fuel-efficient 1997 car",
        "UK: Britain's Channel 5 to broadcast Fashion Awards."
    ]

    for q in queries:
        scores = bm_25(coll, q, df_)

        print("The query is: " + q)
        out.write("The query is: " + q + '\n')
        print("The following are the BM25 score for each document: ")
        out.write("The following are the BM25 score for each document: \n")

        for docID in sorted(scores.keys(), key=lambda x: int(x)):
            doc = coll[docID]
            line = "Document ID: " + docID + ", Doc Length: " + str(doc.get_doc_size()) + " -- BM25 Score: " + str(scores[docID])
            print(line)
            out.write(line + '\n')
        print()
        out.write('\n')

        # Print top-6 ranked documents
        sorted_scores = sorted(scores.items(), key=lambda x: -x[1])
        print("The following are the top-6 documents retrieved in response to the query -")
        out.write("The following are the top-6 documents retrieved in response to the query -\n")
        for docID, score in sorted_scores[:6]:
            print(docID + ' ' + str(score))
            out.write(docID + ' ' + str(score) + '\n')
        print()
        out.write('\n')

    out.close()
    print("Results saved to EisenEdBriones_Q3.txt")
