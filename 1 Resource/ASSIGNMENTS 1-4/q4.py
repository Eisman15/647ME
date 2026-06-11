
#Question 3: Question 4: BM25-Based IR for RAG Prompt Generation
#EISEN ED C. BRIONES
#12300098

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


# df - Q2
def df(coll):
    df_ = {}
    for id, doc in coll.items():
        for term in doc.terms.keys():
            try:
                df_[term] += 1
            except KeyError:
                df_[term] = 1
    return df_



def avg_len(coll):
    totalDocLength = 0
    for docID, doc in coll.items():
        totalDocLength += doc.get_doc_size()
    return totalDocLength / len(coll)



def bm_25(coll, q, df):
    #Calculate BM25 scores for all documents
    k1 = 1.2
    k2 = 500
    b = 0.75
    R = 0
    N = len(coll)
    avdl = avg_len(coll)

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


# Task 4.1 - RAG-Based Prompt Generator
def rag_prompt_generator(q, folder_name):
    
    # 1.) Document Retrieval
    coll = docParser(stop_wordList, folder_name)
    df_ = df(coll)
    scores = bm_25(coll, q, df_)

    # 2.) Top-4 Document Selection
    sorted_scores = sorted(scores.items(), key=lambda x: -x[1])
    top_k = sorted_scores[:4]

    # 3.) Frequent Term Extraction
    combined_freq = {}
    for docID, score in top_k:
        doc = coll[docID]
        for term, freq in doc.terms.items():
            try:
                combined_freq[term] += freq
            except KeyError:
                combined_freq[term] = freq

    sorted_freq = sorted(combined_freq.items(), key=lambda x: -x[1])
    T = [term for term, freq in sorted_freq[:10]]

    # 4.) Prompt Construction 
    frequent_words = ', '.join(T)

    prompt = ("You are an intelligent assistant. Use the following retrieved context to answer the query.\n\n"
              + "Retrieved Context:\n"
              + frequent_words + "\n\n"
              + "Query:\n"
              + q + "\n\n"
              + "Instructions: Answer the query using only the information from the retrieved context. "
              + "If the answer is not contained in the context, say \"I don't know\". Be concise and accurate.")

    return prompt, top_k, T


# Task 4.2 - Main
if __name__ == '__main__':

    # Load stop words
    stopwords_f = open('common-english-words.txt', 'r') # wk2
    stop_wordList = stopwords_f.read().split(',')
    stopwords_f.close()

    # Add extra stop words 
    stop_wordList += ["quot", "amp", "reuter", "reuters"]

    out = open('EisenEdBriones_Q4.txt', 'w')

    # Test with three queries
    queries = [
        "The British-Fashion Awards",
        "US EPA ranks Geo Metro car most fuel-efficient 1997 car",
        "UK: Britain's Channel 5 to broadcast Fashion Awards."
    ]

    for q in queries:
        prompt, top_k, T = rag_prompt_generator(q, 'Subset_RCV1v2')

        print("Query: " + q)
        out.write("Query: " + q + '\n')

        print("Top-4 documents retrieved by BM25:")
        out.write("Top-4 documents retrieved by BM25:\n")
        for docID, score in top_k:
            print("  Document " + docID + " -- BM25 Score: " + str(score))
            out.write("  Document " + docID + " -- BM25 Score: " + str(score) + '\n')

        print("\n10 most frequent terms from top-4 documents: " + str(T))
        out.write("\n10 most frequent terms from top-4 documents: " + str(T) + '\n')

        print("\nGenerated RAG Prompt:\n" + prompt)
        out.write("\nGenerated RAG Prompt:\n" + prompt + '\n')

        print("\n" + "=" * 70 + "\n")
        out.write("\n" + "=" * 70 + "\n\n")

    out.close()
    print("Results saved to EisenEdBriones_Q4.txt")
