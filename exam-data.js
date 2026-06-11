/* ============================================================
   IFN647 Interactive Exam — Question Bank
   Rebuilt from the course reviewer (weeks 2–12) + lecture set.
   Modules:
     1 = Text pre-processing, IR, IE & Indexing      (wk 2–4)
     2 = Language Models, Information Needs & Evaluation (wk 5)
     3 = Learning to Rank, User & Relevance Models    (wk 6–8)
     4 = Text Classification & Clustering             (wk 9, 11)
     5 = Web Search, Feature Dependencies & Multimodal (wk 12)
   kinds: mc | tf | calc | short | code
   ============================================================ */
const MODULES = {
  1:{name:"Text pre-processing, IR, IE & Indexing", color:"#3fd9c6", weeks:"Weeks 2–4"},
  2:{name:"Language Models, Information Needs & Evaluation", color:"#f0b15a", weeks:"Week 5"},
  3:{name:"Learning to Rank, User & Relevance Models", color:"#ef6f6f", weeks:"Weeks 6–8"},
  4:{name:"Text Classification & Clustering", color:"#56cf8e", weeks:"Weeks 9 & 11"},
  5:{name:"Web Search, Feature Dependencies & Multimodal", color:"#9d8bf0", weeks:"Week 12"}
};

const BANK = [

/* ===================== MODULE 1 — wk2–4 ===================== */
{
  id:"m1-stem-tf", module:1, week:"W2", kind:"tf", marks:2, diff:"Easy",
  prompt:"<b>Stemming.</b> “A <em>dictionary-based stemmer</em> uses a small program that relies on knowledge of word suffixes for a particular language to decide whether two words are related.”",
  answer:false,
  explain:"That description is the <em>algorithmic</em> stemmer. A dictionary-based stemmer has <strong>no logic of its own</strong> — it relies on a pre-created dictionary of related terms. The exam loves this mix-up between the two stemmer types."
},
{
  id:"m1-ngram", module:1, week:"W2", kind:"mc", marks:2, diff:"Easy",
  prompt:"For the document text <code>\"Tropical fish are\"</code>, which set is the correct list of <b>bigrams</b> (sliding window of 2)?",
  options:[
    "[\"Tropical fish\", \"fish are\"]",
    "[\"Tropical\", \"fish\", \"are\"]",
    "[\"Tropical fish are\"]",
    "[\"Tropical fish\", \"Tropical are\", \"fish are\"]"
  ],
  correct:0,
  explain:"A bigram window slides one word at a time, so the windows overlap: <code>\"Tropical fish\"</code> then <code>\"fish are\"</code>. Build them with <code>[stems[i]+' '+stems[i+1] for i in range(len(stems)-1)]</code> — note <code>-1</code> stops the window going out of bounds."
},
{
  id:"m1-bool-vsm", module:1, week:"W3", kind:"mc", marks:2, diff:"Normal",
  prompt:"Four statements about retrieval models. Which one is <b>FALSE</b>?",
  options:[
    "The Boolean model is exact-match retrieval — a document is retrieved only if it exactly matches the query.",
    "In the Boolean model relevance is binary (True/False) and explicit.",
    "“Searching by numbers” is a consequence of the limitations of the Boolean model.",
    "In the Vector Space Model, relevance is assumed to be explicitly stated, not inferred from similarity."
  ],
  correct:3,
  explain:"In the VSM, relevance is an <strong>implicit</strong> assumption — it is related to the <em>similarity</em> of the query and document vectors, not an explicit label. Everything else is true."
},
{
  id:"m1-bayes-calc", module:1, week:"W3", kind:"calc",
  marks:5, diff:"Hard",
  prompt:"Bayes classifier. Query \\(D=\\{US, ECONOM, ESPIONAG\\}\\). The relevant documents are D2, D3, D4. Each term's contribution is \\(p_i=P(d_i|R)=\\) (relevant docs containing the term) / (total relevant docs). Given <code>US</code> appears in 3/3, <code>ECONOM</code> in 3/3, <code>ESPIONAG</code> in 2/3, compute \\(P(D|R)=\\prod p_i\\).",
  accept:["0.667","0.6667","0.67",".667","2/3"],
  hint:"answer to 3 dp",
  steps:[
    "<strong>p₁ = P(US|R) = 3/3 = 1.0</strong>",
    "<strong>p₃ = P(ECONOM|R) = 3/3 = 1.0</strong>",
    "<strong>p₄ = P(ESPIONAG|R) = 2/3 = 0.667</strong>",
    "Terms are assumed <strong>independent</strong> → multiply: P(D|R) = 1 × 1 × 0.667"
  ],
  model:"\\(P(D|R)=1\\times1\\times0.667 = \\mathbf{0.667}\\). Key idea: \\(p_i=P(d_i|R)\\) is the fraction of relevant documents containing term \\(d_i\\)."
},
{
  id:"m1-prob-weight", module:1, week:"W3", kind:"mc", marks:2, diff:"Normal",
  prompt:"In the probabilistic term-weighting formula \\(w_1(t)=\\log\\!\\big[\\tfrac{r(t)/R}{n(t)/N}\\big]\\), what does a <b>high</b> \\(w_1(t)\\) tell you?",
  options:[
    "The term is common across all documents, so it is less useful for retrieval.",
    "The term appears more in relevant documents → it is more useful for retrieval.",
    "The term has been removed by stemming.",
    "The term's document frequency equals the collection size."
  ],
  correct:1,
  explain:"\\(r(t)\\)=relevant docs with term \\(t\\); \\(n(t)\\)=all docs with \\(t\\); \\(R\\),\\(N\\) totals. A high weight means the term is concentrated in relevant documents → <strong>more useful</strong>. A low weight means it's spread everywhere → less useful."
},
{
  id:"m1-docfeat", module:1, week:"W3", kind:"mc", marks:2, diff:"Normal",
  prompt:"About document features and ranking — which statement is <b>FALSE</b>?",
  options:[
    "A document feature is some attribute of the document we can express numerically.",
    "A ranking function combines document features with the query to produce a score.",
    "Topical features are the only features we can find in documents.",
    "A high score means the system thinks the document is a good match for the query."
  ],
  correct:2,
  explain:"Documents also have <strong>quality features</strong> — meta-information such as “days since last update.” So there are two types: <em>topical</em> (about the content) and <em>quality</em> (meta-information). The “topical only” claim is the false one."
},
{
  id:"m3-pairwise-rank", module:3, week:"W6", kind:"mc", marks:3, diff:"Normal",
  prompt:"In <b>pairwise Learning-to-Rank</b>, the preference function \\(f(A,B,Q)\\) converts the base scoring function \\(R(Q,D)\\) into a discrete <em>label</em>: <b>+1</b> = \"rank A above B\", <b>-1</b> = \"rank B above A\", <b>0</b> = tie. Suppose the ranker gives \\(R(Q,A)=0.82\\) and \\(R(Q,B)=0.54\\). What is \\(f(A,B,Q)\\)?",
  options:["-1","0","1","R(Q,A) - R(Q,B)"],
  correct:2,
  explain:"Since \\(R(Q,A)>R(Q,B)\\), A should rank higher → \\(f(A,B,Q)=\\mathbf{+1}\\). The function returns a <em>preference label</em> \\(\\{-1,0,+1\\}\\), not a numeric difference — though you compute the difference internally to decide the label."
},
{
  id:"m1-inverted-tf", module:1, week:"W4", kind:"tf", marks:2, diff:"Normal",
  prompt:"<b>Indexing.</b> “A <em>binary</em> inverted index, which stores only 1 (contains term) or 0 (does not), can tell you whether a document contains the exact phrase <code>\"tropical fish\"</code>.”",
  answer:false,
  explain:"A binary index can tell you a document contains <code>\"tropical\"</code> AND <code>\"fish\"</code> separately, but <strong>cannot</strong> confirm the exact phrase. For exact phrase matching you must add <strong>position information</strong> to the index."
},
{
  id:"m1-tat", module:1, week:"W4", kind:"calc", marks:5, diff:"Hard",
  prompt:"Term-at-a-time scoring. Query = {freshwater, fish, aquarium, tropical}. Inverted lists (doc:count):<br>L1 freshwater: 1:1, 4:1 · L2 aquarium: 3:1 · L3 fish: 1:2, 2:3, 3:2, 4:2 · L4 tropical: 1:2, 2:2, 3:1.<br>Process one list at a time, accumulating scores. What is the <b>final score of Document 1</b>?",
  accept:["5"],
  hint:"integer",
  steps:[
    "After L1 (freshwater): D1 = 1",
    "L2 (aquarium): D1 unchanged = 1",
    "L3 (fish): D1 += 2 → 1 + 2 = 3",
    "L4 (tropical): D1 += 2 → 3 + 2 = <strong>5</strong>"
  ],
  model:"Final scores: <strong>D1:5, D2:5, D3:4, D4:3</strong>. Rule: if a document already has a score, <em>add</em> to it; if it's new, <em>start</em> with that count. Lists are processed one at a time."
},
{
  id:"m1-markov", module:1, week:"W4", kind:"calc", marks:3, diff:"Normal",
  prompt:"Markov chain with states {Sleep, Run, Ice Cream}. Transition matrix rows (current → Sleep / Run / Ice Cream):<br>Sleep: 0.2 / 0.6 / 0.2 · Run: 0.1 / 0.6 / 0.3 · Ice Cream: 0.2 / 0.7 / 0.1.<br>If John spent today <b>sleeping</b>, what is the probability he will <b>run</b> tomorrow?",
  accept:["0.6","60%","60",".6"],
  hint:"e.g. 0.6 or 60%",
  steps:[
    "Read the matrix: <strong>row = current state, column = next state</strong>.",
    "Current = Sleep → use the Sleep row.",
    "Next = Run → take the Run column → <strong>0.6 = 60%</strong>."
  ],
  model:"Probability = value at [Sleep row][Run column] = <strong>0.6</strong>. Each row must sum to 1.0."
},
{
  id:"m1-textstats", module:1, week:"W2", kind:"code", marks:4, diff:"Normal",
  prompt:"<b>Python.</b> From an XML file, build a frequency dictionary <code>doc</code> of all terms with <code>len(term) &gt; 2</code> (lower-cased), then print the <b>top-10</b> terms by frequency, descending. Write the core code.",
  model:`<pre class="code"><span class="cm"># read + strip XML tags / newlines, keep &lt;p&gt; lines</span>
file_ = open(<span class="st">'6146.xml'</span>).readlines()
text = [l.replace(<span class="st">"&lt;p&gt;"</span>,<span class="st">""</span>).replace(<span class="st">"&lt;/p&gt;"</span>,<span class="st">""</span>).replace(<span class="st">"\\n"</span>,<span class="st">""</span>)
        <span class="kw">for</span> l <span class="kw">in</span> file_ <span class="kw">if</span> l.startswith(<span class="st">'&lt;p&gt;'</span>)]

doc = {}
<span class="kw">for</span> line <span class="kw">in</span> text:
    <span class="kw">for</span> term <span class="kw">in</span> line.split():
        term = term.lower()
        <span class="kw">if</span> len(term) &gt; <span class="st">2</span>:
            <span class="kw">try</span>:
                doc[term] += <span class="st">1</span>
            <span class="kw">except</span> KeyError:
                doc[term] = <span class="st">1</span>

myList = sorted(doc.items(), key=<span class="kw">lambda</span> x: x[<span class="st">1</span>], reverse=<span class="kw">True</span>)[:<span class="st">10</span>]
x, y = zip(*myList)        <span class="cm"># unpack for plotting</span></pre>`,
  notes:"Watch for: <code>try/except KeyError</code> to build the dictionary, <code>sorted(..., key=lambda x:x[1], reverse=True)</code> to sort by count descending, and <code>zip(*myList)</code> to split tuples into x/y for a plot."
},
{
  id:"m1-html", module:1, week:"W2", kind:"code", marks:4, diff:"Normal",
  prompt:"<b>Python.</b> Extract every hyperlink (the <code>href</code> value) from an HTML file using <code>HTMLParser</code>. Sketch the parser and the extraction line.",
  model:`<pre class="code"><span class="kw">from</span> html.parser <span class="kw">import</span> HTMLParser

<span class="kw">class</span> <span class="fn">Parser</span>(HTMLParser):
    <span class="kw">def</span> <span class="fn">handle_starttag</span>(self, tag, attrs):
        <span class="kw">global</span> start_tags, attrs_names
        <span class="kw">if</span> tag == <span class="st">'a'</span>:                 <span class="cm"># only anchor tags</span>
            start_tags.append(tag)
            attrs_names.append(attrs)

start_tags, attrs_names = [], []
parser = Parser()

file_html = open(<span class="st">'html_example.html'</span>).read()
parser.feed(file_html)

hyper_links = [x[<span class="st">0</span>][<span class="st">1</span>] <span class="kw">for</span> x <span class="kw">in</span> attrs_names]  <span class="cm"># first attr's value = href</span>
print(hyper_links)</pre>`,
  notes:"<code>handle_starttag()</code> fires on every start tag; filter <code>tag=='a'</code>; the link is <code>x[0][1]</code> — the value of the first attribute (<code>href</code>). Ethical issue: scraping at volume can look like a <strong>DoS</strong> attack, and copying content may breach the site's terms / copyright."
},
{
  id:"m1-word2vec", module:1, week:"W3", kind:"code", marks:3, diff:"Normal",
  prompt:"<b>Python.</b> Using NLTK + Gensim, tokenise <code>alice.txt</code> into sentences→words, train a Word2Vec (CBOW) model, and compute the similarity between two words.",
  model:`<pre class="code"><span class="kw">import</span> gensim
<span class="kw">from</span> nltk <span class="kw">import</span> sent_tokenize, word_tokenize

s = open(<span class="st">"alice.txt"</span>).read().replace(<span class="st">"\\n"</span>,<span class="st">" "</span>)
data = []
<span class="kw">for</span> i <span class="kw">in</span> sent_tokenize(s):
    temp = [j.lower() <span class="kw">for</span> j <span class="kw">in</span> word_tokenize(i)]
    data.append(temp)               <span class="cm"># list of lists (one per sentence)</span>

model = gensim.models.Word2Vec(data, min_count=<span class="st">1</span>,
                               vector_size=<span class="st">10</span>, window=<span class="st">5</span>)
model.wv.similarity(<span class="st">'alice'</span>, <span class="st">'wonderland'</span>)   <span class="cm"># ~0.945 (similar contexts)</span>
model.wv.similarity(<span class="st">'alice'</span>, <span class="st">'machines'</span>)     <span class="cm"># ~0.546 (less related)</span></pre>`,
  notes:"CBOW predicts a word from its context; Skip-gram predicts context from a word. <code>wv.similarity()</code> = cosine similarity between two learnt vectors. <code>min_count=1</code> keeps all words; <code>vector_size=10</code> = 10-d vectors; <code>window=5</code> = context width."
},
{
  id:"m1-cosine-formula", module:1, week:"W3", kind:"formula", marks:5, diff:"Hard",
  prompt:"Vector Space Model. Compute the <b>cosine similarity</b> between D1 and D2 using their TF-IDF weighted vectors.",
  formulas:[
    "sim(D1, D2) = (D1 · D2) / (|D1| × |D2|)",
    "D1 · D2 = Σ d1ᵢ × d2ᵢ     |D| = √(Σ dᵢ²)"
  ],
  table:{
    headers:["Term","D1 weight","D2 weight"],
    rows:[["fish","0.70","0.00"],["tropical","0.40","0.40"],["pet","0.00","0.60"]]
  },
  substeps:[
    {label:"D1 · D2 =",accept:["0.16","0.160"],              hint:"= 0.7×0.0 + 0.4×0.4 + 0.0×0.6"},
    {label:"|D1| =",   accept:["0.806","0.8062","0.81"],     hint:"= √(0.7² + 0.4² + 0.0²) = √0.65"},
    {label:"|D2| =",   accept:["0.721","0.7211","0.72"],     hint:"= √(0.0² + 0.4² + 0.6²) = √0.52"}
  ],
  finalLabel:"sim(D1, D2) =",
  accept:["0.275","0.2752","0.28"],
  hint:"4 dp",
  steps:[
    "D1 · D2 = 0.7×0.0 + 0.4×0.4 + 0.0×0.6 = <strong>0.16</strong>",
    "|D1| = √(0.49 + 0.16 + 0.00) = √0.65 = <strong>0.8062</strong>",
    "|D2| = √(0.00 + 0.16 + 0.36) = √0.52 = <strong>0.7211</strong>",
    "sim(D1,D2) = 0.16 / (0.8062 × 0.7211) = 0.16 / 0.5814 = <strong>0.2752</strong>"
  ],
  model:"\\(\\text{sim}(D1,D2)=\\dfrac{D1\\cdot D2}{|D1|\\,|D2|}=\\dfrac{0.16}{0.8062\\times0.7211}=\\dfrac{0.16}{0.5814}=\\mathbf{0.2752}\\). Documents with no shared terms get 0; identical normalised vectors get 1."
},
{
  id:"m1-tfidf-formula", module:1, week:"W3", kind:"formula", marks:5, diff:"Hard",
  prompt:"Compute the <b>TF-IDF weight</b> for a term that appears <b>4 times</b> in a document. The collection has <b>N = 10</b> documents, and the term occurs in <b>df = 2</b> of them. Use log-normalised TF and natural-log IDF.",
  formulas:[
    "tf_norm = 1 + ln(tf)     ·     idf = ln(N / df)",
    "tf-idf = tf_norm × idf"
  ],
  substeps:[
    {label:"tf_norm =", accept:["2.386","2.3863","2.39"], hint:"= 1 + ln(4) = 1 + 1.3863"},
    {label:"idf =",     accept:["1.609","1.6094","1.61"], hint:"= ln(10/2) = ln(5)"}
  ],
  finalLabel:"tf-idf =",
  accept:["3.840","3.8404","3.84"],
  hint:"4 dp",
  steps:[
    "\\(tf_{\\text{norm}}=1+\\ln(4)=1+1.3863=\\mathbf{2.3863}\\)",
    "\\(idf=\\ln\\!\\left(\\tfrac{10}{2}\\right)=\\ln(5)=\\mathbf{1.6094}\\)",
    "\\(tf\\text{-}idf=2.3863\\times1.6094=\\mathbf{3.8404}\\)"
  ],
  model:"\\(tf\\text{-}idf=\\left(1+\\ln 4\\right)\\times\\ln\\!\\tfrac{10}{2}=2.3863\\times1.6094=\\mathbf{3.8404}\\). Log normalisation dampens the raw count; IDF boosts terms that appear in few documents."
},

/* ===================== MODULE 2 — wk5 ===================== */
{
  id:"m2-jm-calc", module:2, week:"W5", kind:"calc", marks:5, diff:"Hard",
  prompt:"Jelinek-Mercer smoothing: \\(p(q_i|D)=(1-\\lambda)\\tfrac{f_{q_i,D}}{|D|}+\\lambda\\tfrac{c_{q_i}}{|C|}\\), with \\(\\lambda=0.4\\). For D2 = {US, US, ECONOM, SPY}: \\(|D2|=4\\), collection \\(|C|=23\\). Term <code>US</code>: \\(f_{US,D2}=2\\), \\(c_{US}=4\\). Compute \\(P(US|D2)\\).",
  accept:["0.368","0.37",".368","0.3686"],
  hint:"3 dp",
  steps:[
    "First term: \\((1-0.4)\\times(2/4)=0.6\\times0.5=0.30\\)",
    "Second term: \\(0.4\\times(4/23)=0.4\\times0.17\\approx0.068\\)",
    "Add: 0.30 + 0.068 = <strong>0.368</strong>"
  ],
  model:"\\(P(US|D2)=(1-0.4)\\cdot\\tfrac{2}{4}+0.4\\cdot\\tfrac{4}{23}=0.6\\cdot0.5+0.4\\cdot0.17=\\mathbf{0.368}\\). The whole-document score is \\(P(Q|D)=\\prod_i p(q_i|D)\\)."
},
{
  id:"m2-jm-smooth", module:2, week:"W5", kind:"mc", marks:2, diff:"Normal",
  prompt:"With Jelinek-Mercer smoothing, what happens to a query term that <b>does not appear</b> in document D (so \\(f_{q_i,D}=0\\))?",
  options:[
    "Its probability is exactly 0, making the whole P(Q|D) zero.",
    "It still receives a small non-zero probability from the \\(\\lambda\\tfrac{c_{q_i}}{|C|}\\) collection term.",
    "The document is removed from the ranking.",
    "Its probability becomes 1 by default."
  ],
  correct:1,
  explain:"That is the entire purpose of smoothing: even when \\(f_{q_i,D}=0\\), the collection component \\(\\lambda\\,c_{q_i}/|C|\\) keeps the probability above zero, so one missing term doesn't zero out the product."
},
{
  id:"m2-qlogs", module:2, week:"W5", kind:"mc", marks:2, diff:"Normal",
  prompt:"Four statements about query logs and pooling — which is <b>FALSE</b>?",
  options:[
    "Pooling selects top-k results from rankings of different retrieval algorithms, merges them into a pool, and removes duplicates.",
    "A typical query log does NOT contain a user identifier or session identifier, for privacy reasons.",
    "Many user actions (e.g. clicks in a query log) can be treated as implicit relevance judgments.",
    "Privacy becomes an issue when query logs are shared or distributed for research."
  ],
  correct:1,
  explain:"A typical query log <strong>does</strong> contain user ID, session ID, query terms, result URLs, ranks, click data and timestamps. Privacy is an issue precisely because logs are <em>shared</em>, not just collected — so the “does NOT contain” statement is false."
},
{
  id:"m2-recall", module:2, week:"W5", kind:"calc", marks:3, diff:"Normal",
  prompt:"Evaluation. Relevant set \\(A\\) has 8 docs; retrieved set \\(B\\) has 6 docs; \\(A\\cap B=\\{110,111,113,114,119\\}\\) = 5 docs. Compute <b>Recall</b> = \\(|A\\cap B|/|A|\\) as a percentage.",
  accept:["62.5","62.5%","0.625",".625","62.50"],
  hint:"e.g. 62.5%",
  steps:["Recall = |A∩B| / |A| = 5 / 8 = 0.625 = <strong>62.5%</strong>"],
  model:"\\(Recall=\\dfrac{|A\\cap B|}{|A|}=\\dfrac{5}{8}=62.5\\%\\) — coverage: of all relevant docs, how many were retrieved."
},
{
  id:"m2-precision", module:2, week:"W5", kind:"calc", marks:2, diff:"Normal",
  prompt:"Same data: \\(A\\cap B=5\\) docs, retrieved \\(|B|=6\\). Compute <b>Precision</b> = \\(|A\\cap B|/|B|\\) as a percentage (2 dp).",
  accept:["83.33","83.33%","0.8333",".8333","83.3"],
  hint:"e.g. 83.33%",
  steps:["Precision = |A∩B| / |B| = 5 / 6 = <strong>83.33%</strong>"],
  model:"\\(Precision=\\dfrac{5}{6}=83.33\\%\\) — accuracy: of all retrieved docs, how many were relevant."
},
{
  id:"m2-f1", module:2, week:"W5", kind:"calc", marks:3, diff:"Hard",
  prompt:"With Recall = 5/8 and Precision = 5/6, compute the <b>F1 measure</b> \\(=\\dfrac{2\\,R\\,P}{R+P}\\) as a percentage (2 dp).",
  accept:["71.43","71.43%","0.7143",".7143","71.4"],
  hint:"e.g. 71.43%",
  steps:[
    "Convert: \\(R=\\tfrac{5}{8}=0.625\\), \\(P=\\tfrac{5}{6}=0.8333\\)",
    "Numerator: \\(2\\times 0.625\\times 0.8333 = 1.0416\\)",
    "Denominator: \\(0.625 + 0.8333 = 1.4583\\)",
    "\\(F1=\\dfrac{1.0416}{1.4583}=0.7143=\\mathbf{71.43\\%}\\)"
  ],
  model:"\\(F1=\\dfrac{2\\times 0.625\\times 0.8333}{0.625+0.8333}=\\dfrac{1.0416}{1.4583}=71.43\\%\\) — the harmonic balance of recall and precision."
},
{
  id:"m2-fpfn", module:2, week:"W5", kind:"mc", marks:2, diff:"Normal",
  prompt:"In effectiveness evaluation, which pair of definitions is correct?",
  options:[
    "False Positive = relevant but not retrieved; False Negative = retrieved but not relevant.",
    "False Positive = retrieved but not relevant; False Negative = relevant but not retrieved.",
    "False Positive = relevant and retrieved; False Negative = neither relevant nor retrieved.",
    "False Positive and False Negative both count only relevant retrieved documents."
  ],
  correct:1,
  explain:"FP = \\(|A'\\cap B|/|A'|\\) → retrieved but <strong>non-relevant</strong>. FN = \\(|A\\cap B'|/|A|\\) → relevant but <strong>not retrieved</strong> (missed). In the worked example FP = 1/7 and FN = 3/8."
},
{
  id:"m2-likelihood-short", module:2, week:"W5", kind:"short", marks:2, diff:"Easy",
  prompt:"<b>Short answer.</b> Briefly describe the likelihood model implementation: what is called first, and what does the output look like?",
  model:"You call <em>index_docs()</em> first to build the index, then <em>likelihood_IR(I, Q)</em> to score documents. The output is a <strong>ranked list of documents ordered by likelihood score</strong> — the probability that the document's language model would generate the query.",
  keypoints:["index_docs() builds the index first","likelihood_IR(I, Q) computes scores","output = ranked list by likelihood / P(Q|D)"]
},

{
  id:"m2-jm-full", module:2, week:"W5", kind:"formula", marks:6, diff:"Hard",
  prompt:"Jelinek-Mercer smoothing, \\(\\lambda=0.7\\). Query <b>q = \"machine learning model\"</b>. Work out each term's smoothed probability, then compute the <b>log query likelihood</b> \\(\\log P_{JM}(q|D1)=\\sum_t\\ln P_{JM}(t|D1)\\).",
  formulas:[
    "P_JM(t|D) = (1-λ) · P(t|D) + λ · P(t|C)",
    "P(t|D) = tf(t,D) / |D|     ·     P(t|C) = tf(t,C) / |C|"
  ],
  table:{
    headers:["Term","tf in D1  (|D1|=50)","tf in corpus  (|C|=200)"],
    rows:[["machine","4","16"],["learning","6","10"],["model","2","20"]]
  },
  substeps:[
    {label:"P<sub>JM</sub>(machine|D1) =", accept:["0.08","0.080","0.0800"], hint:"= (1-λ)×(4/50) + λ×(16/200) = 0.3×0.08 + 0.7×0.08"},
    {label:"P<sub>JM</sub>(learning|D1) =", accept:["0.071","0.0710"],        hint:"= (1-λ)×(6/50) + λ×(10/200) = 0.3×0.12 + 0.7×0.05"},
    {label:"P<sub>JM</sub>(model|D1) =",   accept:["0.082","0.0820"],         hint:"= (1-λ)×(2/50) + λ×(20/200) = 0.3×0.04 + 0.7×0.10"}
  ],
  finalLabel:"log P<sub>JM</sub>(q|D1) =",
  accept:["-7.6718","-7.672","-7.67"],
  hint:"4 dp",
  steps:[
    "\\(P_{JM}(\\text{machine}|D1)=(1-0.7)\\times\\tfrac{4}{50}+0.7\\times\\tfrac{16}{200}=0.024+0.056=\\mathbf{0.0800}\\)",
    "\\(P_{JM}(\\text{learning}|D1)=(1-0.7)\\times\\tfrac{6}{50}+0.7\\times\\tfrac{10}{200}=0.036+0.035=\\mathbf{0.0710}\\)",
    "\\(P_{JM}(\\text{model}|D1)=(1-0.7)\\times\\tfrac{2}{50}+0.7\\times\\tfrac{20}{200}=0.012+0.070=\\mathbf{0.0820}\\)",
    "Sum of logs: \\(\\ln(0.0800)+\\ln(0.0710)+\\ln(0.0820)=-2.5257+(-2.6451)+(-2.5010)=\\mathbf{-7.6718}\\)"
  ],
  model:"\\(\\log P_{JM}(q|D1)=\\ln(0.080)+\\ln(0.071)+\\ln(0.082)=\\mathbf{-7.6718}\\). With \\(\\lambda=0.7\\) weighting the collection heavily, terms common in the corpus (like <em>model</em>) get a larger boost than document-frequent terms. The product-in-log-space gives the query likelihood."
},
{
  id:"m2-eval-chain", module:2, week:"W5", kind:"formula", marks:5, diff:"Normal",
  prompt:"Evaluation. Relevant set \\(|A|=8\\), retrieved set \\(|B|=6\\), overlap \\(|A\\cap B|=5\\). Compute Precision and Recall first, then use them to find the <b>F1 measure</b>.",
  formulas:[
    "Precision = |A∩B| / |B|     ·     Recall = |A∩B| / |A|",
    "F1 = 2PR / (P + R)"
  ],
  substeps:[
    {label:"Precision =", accept:["0.8333","0.833","83.33","83.3"], hint:"= |A∩B| / |B| = 5 / 6"},
    {label:"Recall =",    accept:["0.625","0.6250","62.5"],          hint:"= |A∩B| / |A| = 5 / 8"}
  ],
  finalLabel:"F1 =",
  accept:["0.7143","0.714","71.43","5/7"],
  hint:"4 dp or %",
  steps:[
    "Precision \\(=\\tfrac{5}{6}=\\mathbf{0.8333}\\) (83.33%)",
    "Recall \\(=\\tfrac{5}{8}=\\mathbf{0.6250}\\) (62.5%)",
    "\\(F1=\\dfrac{2\\times0.8333\\times0.6250}{0.8333+0.6250}=\\dfrac{1.0417}{1.4583}=\\mathbf{0.7143}\\)"
  ],
  model:"\\(F1=\\dfrac{2PR}{P+R}=\\dfrac{2\\times\\frac{5}{6}\\times\\frac{5}{8}}{\\frac{5}{6}+\\frac{5}{8}}=\\dfrac{50/48}{70/48}=\\dfrac{5}{7}=\\mathbf{71.43\\%}\\). F1 is the harmonic mean of precision and recall."
},

/* ===================== MODULE 3 — wk6–8 ===================== */
{
  id:"m3-editdist-tf", module:3, week:"W6", kind:"tf", marks:2, diff:"Normal",
  prompt:"<b>Edit distance.</b> “Damerau-Levenshtein distance counts the <em>maximum</em> number of insertions, deletions, substitutions and transpositions of single characters needed to transform one word into another.”",
  answer:false,
  explain:"It counts the <strong>minimum</strong> number of operations, not the maximum. (Damerau-Levenshtein adds transposition to the standard Levenshtein edit distance.)"
},
{
  id:"m3-noisy", module:3, week:"W6", kind:"mc", marks:2, diff:"Normal",
  prompt:"Noisy channel model for spelling correction: \\(P(w|e)\\propto P(e|w)\\times P(w)\\). When the edit distance and prior are roughly equal for two candidates (e.g. “fish tank” vs “fish think”), what decides the winner?",
  options:[
    "A coin flip — the model picks randomly.",
    "The context: the prior probability \\(P(w)\\) of the surrounding words (e.g. “tank” is more common after “fish”).",
    "Always the shorter word.",
    "The word that appears first alphabetically."
  ],
  correct:1,
  explain:"Context decides. “fish tank” is a far more common phrase than “fish think”, so the language-model prior \\(P(w)\\) tips the balance toward “tank”."
},
{
  id:"m3-pk", module:3, week:"W6", kind:"calc", marks:3, diff:"Normal",
  prompt:"Ranked output, relevant docs marked ✓. Top-10: 111✓,112✗,113✓,110✓,114✓,119✓,115✗,122✗,118✗,116✓. Compute <b>Precision@10</b> (P@10) as a percentage.",
  accept:["60","60%","0.6",".6"],
  hint:"e.g. 60%",
  steps:[
    "Relevant in the top 10: {111,113,110,114,119,116} = 6",
    "P@10 = 6 / 10 = <strong>60%</strong>"
  ],
  model:"\\(P@10=6/10=60\\%\\). (For reference P@6 = 5/6 = 83.33%.) P@k = relevant docs in top-k divided by k."
},
{
  id:"m3-ap", module:3, week:"W7", kind:"calc", marks:5, diff:"Hard",
  prompt:"Average Precision. Total relevant \\(|A|=8\\). Precision is computed only at the ranks where a relevant doc appears; these are: 1.0, 0.667, 0.75, 0.8, 0.833, 0.6, 0.636, 0.571. Compute <b>Average Precision</b> as a percentage (2 dp).",
  accept:["73.21","73.21%","0.7321",".7321","73.2"],
  hint:"sum ÷ 8",
  steps:[
    "Sum of precisions at relevant ranks = 1.0+0.667+0.75+0.8+0.833+0.6+0.636+0.571 = 5.857",
    "Divide by total relevant docs (8): 5.857 / 8 = 0.7321",
    "= <strong>73.21%</strong>"
  ],
  model:"\\(AP=\\dfrac{\\sum(\\text{precision at relevant ranks})}{|A|}=\\dfrac{5.857}{8}=73.21\\%\\). Never include non-relevant ranks in the sum."
},
{
  id:"m3-map", module:3, week:"W7", kind:"calc", marks:3, diff:"Normal",
  prompt:"MAP = mean of the Average Precision scores across queries. Query 1 AP = 0.62, Query 2 AP = 0.44. Compute <b>MAP</b>.",
  accept:["0.53",".53","0.530"],
  hint:"2 dp",
  steps:["MAP = (0.62 + 0.44) / 2 = 1.06 / 2 = <strong>0.53</strong>"],
  model:"\\(MAP=\\dfrac{\\sum_q AP(q)}{\\#\\text{queries}}=\\dfrac{0.62+0.44}{2}=\\mathbf{0.53}\\)."
},
{
  id:"m3-recall-levels", module:3, week:"W7", kind:"mc", marks:2, diff:"Normal",
  prompt:"For interpolated precision at standard recall levels, \\(P(R)=\\max\\{P':R'\\ge R\\}\\). As the recall level \\(R\\) increases, what generally happens to the interpolated precision?",
  options:[
    "It generally increases.",
    "It stays exactly constant.",
    "It generally decreases (fewer qualifying pairs, lower max precision).",
    "It oscillates with no pattern."
  ],
  correct:2,
  explain:"Standard recall levels run 0.0→1.0 in steps of 0.1. As \\(R\\) rises, fewer (R′,P′) pairs satisfy \\(R'\\ge R\\), so the maximum precision you can take generally <strong>decreases</strong>."
},
{
  id:"m3-mim", module:3, week:"W7", kind:"mc", marks:2, diff:"Normal",
  prompt:"Mutual Information Measure \\(MIM=\\log\\dfrac{P(a,b)}{P(a)\\,P(b)}\\). A <b>high</b> MIM value indicates what about words a and b?",
  options:[
    "They never appear together.",
    "They co-occur more often than would be expected by chance → likely related.",
    "They are antonyms.",
    "They have the same document frequency."
  ],
  correct:1,
  explain:"MIM compares observed co-occurrence \\(P(a,b)\\) to what chance predicts \\(P(a)P(b)\\). High MIM → words appear together more than expected → likely related. Low/negative → less than expected → unlikely related."
},
{
  id:"m3-tf-measure", module:3, week:"W7", kind:"calc", marks:4, diff:"Hard",
  prompt:"Term frequency measure over relevant docs only. Relevant set D⁺ = {D2,D3,D4}. ESPIONAG counts in D⁺ = 0+1+1 = 2. Total words across D⁺ = 4+4+4 = 12. Compute \\(tf(\\text{ESPIONAG})\\).",
  accept:["0.167","0.1667",".167","0.17","2/12","1/6"],
  hint:"3 dp",
  steps:[
    "Numerator = ESPIONAG count across all relevant docs = 0+1+1 = 2",
    "Denominator = total words across all relevant docs = 4+4+4 = 12",
    "tf = 2/12 = <strong>0.167</strong>"
  ],
  model:"\\(tf(t_k)=\\dfrac{\\sum_{d\\in D^+} f_{ik}}{\\sum_{d\\in D^+}\\sum_{t\\in T} f_{ij}}=\\dfrac{2}{12}=0.167\\). Only relevant documents (D⁺) are used."
},
{
  id:"m3-bm25-short", module:3, week:"W7", kind:"short", marks:2, diff:"Normal",
  prompt:"<b>Short answer.</b> In the BM25 weight \\(w_5(t)=\\log\\dfrac{(r(t)+0.5)/(R-r(t)+0.5)}{(n(t)-r(t)+0.5)/(N-n(t)-(R-r(t))+0.5)}\\), what do N, R, n(t), r(t) mean, and why is 0.5 added?",
  model:"<strong>N</strong> = total docs in training set; <strong>R</strong> = number of relevant docs; <strong>n(t)</strong> = docs containing term t (all docs); <strong>r(t)</strong> = relevant docs containing term t. The <em>0.5</em> is added to every count to avoid division by zero (smoothing).",
  keypoints:["N = len(D) all docs","R = len(Rel) relevant docs","n(t) = all docs with term t","r(t) = relevant docs with term t","+0.5 avoids divide-by-zero"]
},
{
  id:"m3-bm25-formula", module:3, week:"W7", kind:"formula", marks:4, diff:"Hard",
  prompt:"BM25 term weight. Collection: <b>N=8</b> docs, <b>R=3</b> relevant. Term <code>\"retrieval\"</code>: <b>n=4</b> docs contain it, <b>r=3</b> of those are relevant. Compute \\(w_5(\\text{retrieval})\\).",
  formulas:[
    "w₅(t) = ln[ (r+0.5)/(R−r+0.5)  ÷  (n−r+0.5)/(N−n−(R−r)+0.5) ]"
  ],
  substeps:[
    {label:"Numerator fraction =",   accept:["7","7.0"],              hint:"= (r+0.5) / (R−r+0.5) = 3.5 / 0.5"},
    {label:"Denominator fraction =", accept:["0.3333","0.333","1/3"], hint:"= (n−r+0.5) / (N−n−(R−r)+0.5) = 1.5 / 4.5"}
  ],
  finalLabel:"w₅(retrieval) =",
  accept:["3.0445","3.045","3.04"],
  hint:"4 dp  (use ln)",
  steps:[
    "Numerator: \\((r+0.5)/(R-r+0.5)=(3+0.5)/(3-3+0.5)=3.5/0.5=\\mathbf{7.0}\\)",
    "Denominator: \\((n-r+0.5)/(N-n-(R-r)+0.5)=(4-3+0.5)/(8-4-0+0.5)=1.5/4.5=\\mathbf{0.333}\\)",
    "\\(w_5=\\ln(7.0/0.333)=\\ln(21.0)=\\mathbf{3.0445}\\)"
  ],
  model:"\\(w_5=\\ln\\!\\left[\\dfrac{3.5/0.5}{1.5/4.5}\\right]=\\ln\\!\\left[\\dfrac{7.0}{0.\\overline{3}}\\right]=\\ln(21)=\\mathbf{3.0445}\\). High weight: all 3 relevant docs contain the term but only 1 non-relevant doc does → strongly predictive of relevance."
},
{
  id:"m3-rag-tf", module:3, week:"W8", kind:"mc", marks:2, diff:"Normal",
  prompt:"Five statements about LLMs and RAG — which is <b>FALSE</b>?",
  options:[
    "RAG enhances LLMs by retrieving relevant information from external knowledge bases, giving more factually grounded outputs.",
    "Chain-of-Thought prompting makes an LLM generate step-by-step reasoning before the final answer.",
    "LLM-based information filtering does not require labelled training data.",
    "The effectiveness of LLMs in real-world news recommendation systems has been fully established."
  ],
  correct:3,
  explain:"Their effectiveness in real-world news recommendation is <strong>not yet fully established</strong> — it is still being researched. LLMs have strong NLU, but this application is unproven. The other four are true."
},
{
  id:"m3-kl-tf", module:3, week:"W8", kind:"tf", marks:2, diff:"Hard",
  prompt:"<b>Query likelihood / smoothing.</b> “KL divergence is the technique used for <em>avoiding estimation problems and overcoming data sparsity</em> in the query likelihood model.”",
  answer:false,
  explain:"That describes <strong>smoothing</strong>. KL divergence is a <em>measure of the difference between two probability distributions</em> — a different concept. Don't mix them up: smoothing fixes sparsity; KL measures distance."
},
{
  id:"m3-prf-short", module:3, week:"W8", kind:"short", marks:3, diff:"Hard",
  prompt:"<b>Short answer.</b> Pseudo relevance feedback builds a probabilistic IF model in two phases with no labelled data. Outline phase 1 (the pseudo-feedback algorithm) at a high level.",
  model:"<strong>Phase 1 — generate a training set D:</strong> (1) rank the unlabelled collection C by query Q; (2) select top-k1 docs (e.g. k1=20) as <em>Rel1</em> — assumed relevant; (3) extract important topical features T (high tf×idf words); (4) compute P(w|d) for each word using smoothing: \\(P(w|d)=(1-\\lambda)tf(w,d)+\\lambda tf(w,C)\\); (5) re-rank Rel1 by KL-divergence score; (6) select top-k2 (e.g. k2=10) as <em>Rel2</em>; (7) set D⁺=Rel2, D⁻=C−Rel2. Phase 2 then designs a probabilistic IF model (BM25-based) on that pseudo-labelled set.",
  keypoints:["no labels → assume top-k relevant","rank → select top-k1 (Rel1) → extract features","smoothing P(w|d)=(1-λ)tf(w,d)+λtf(w,C)","re-rank by KL → select top-k2 (Rel2)","D⁺=Rel2, D⁻=C−Rel2; phase 2 = BM25 IF model"]
},
{
  id:"m3-cot-short", module:3, week:"W8", kind:"short", marks:2, diff:"Normal",
  prompt:"<b>Short answer.</b> For a CoT prompt that does query expansion via pseudo-relevance feedback, what should the prompt instruct the model to do, and what two clean-up steps matter?",
  model:"Instruct the model to <strong>assume the top retrieved documents are relevant</strong> and to <em>think step by step</em> to identify important terms in those documents for query expansion. Clean-up: <strong>remove overly general / non-informative terms</strong>, and ask it to <strong>briefly explain its reasoning (2–3 steps)</strong> before producing the expanded query. “Think step by step” is the phrase that triggers CoT reasoning.",
  keypoints:["assume top-k docs relevant (pseudo-feedback)","'think step by step' triggers CoT","extract expansion terms from those docs","remove overly general / non-informative terms"]
},
{
  id:"m3-tweet-short", module:3, week:"W8", kind:"short", marks:2, diff:"Hard",
  prompt:"<b>Short answer.</b> In the query-likelihood-for-tweets score \\(f(d,Q)=\\sum_{w\\in Q\\cap d} c(w,Q)\\log\\!\\big(1+\\tfrac{c(w,d)}{\\mu P(w|C)}\\big)+|Q|\\log\\tfrac{\\mu}{\\mu+|d|}\\), what does the sum range over, and what is μ for?",
  model:"The sum ranges <strong>only over words that appear in BOTH the query and the tweet</strong> (\\(w\\in Q\\cap d\\)). <em>c(w,d)</em> counts the word in the tweet, <em>c(w,Q)</em> in the query, and <em>P(w|C)</em> normalises against the whole collection. <strong>μ is the smoothing parameter</strong> — it balances the tweet-level probability against the collection probability and prevents division by zero.",
  keypoints:["sum over w ∈ Q∩d (words in both query AND tweet)","c(w,d)=count in tweet, c(w,Q)=count in query","P(w|C)=collection normalisation","μ = smoothing parameter / balances doc vs collection"]
},

/* ===================== MODULE 4 — wk9 & 11 ===================== */
{
  id:"m4-pc-calc", module:4, week:"W9", kind:"calc", marks:2, diff:"Easy",
  prompt:"Multinomial Naïve Bayes. Training set has N=10 documents. Class c1 (spam) = {d2,d4,d5} → Nc1 = 3. Compute the class prior \\(P(c1)=Nc1/N\\).",
  accept:["0.3",".3","3/10","0.30"],
  hint:"e.g. 0.3",
  steps:["P(c1) = Nc1 / N = 3 / 10 = <strong>0.3</strong>"],
  model:"\\(P(c)=\\dfrac{N_c}{N}\\) → P(c1)=3/10=0.3, and P(c2 not-spam)=7/10=0.7. The prior is just class size over total documents."
},
{
  id:"m4-laplace-calc", module:4, week:"W9", kind:"calc", marks:4, diff:"Hard",
  prompt:"Laplacian-smoothed conditional \\(P(w_i|c_j)=\\dfrac{tf_{w_i,c_j}+1}{|c_j|+|V|}\\). For spam (c1): total count of <code>cheap</code> = 10, total words in class \\(|c1|=20\\), vocabulary \\(|V|=5\\). Compute \\(P(\\text{cheap}|c1)\\).",
  accept:["0.44",".44","11/25","0.4400"],
  hint:"2 dp",
  steps:[
    "Numerator: tf + 1 = 10 + 1 = 11",
    "Denominator: |c1| + |V| = 20 + 5 = 25",
    "P(cheap|c1) = 11/25 = <strong>0.44</strong>"
  ],
  model:"\\(P(\\text{cheap}|c1)=\\dfrac{10+1}{20+5}=\\dfrac{11}{25}=0.44\\). Smoothing adds 1 to the numerator and |V| to the denominator so no term gets zero probability. Note \\(|c_j|\\) is the total <em>word count</em> in the class, not the number of docs."
},
{
  id:"m4-nb-formula", module:4, week:"W9", kind:"formula", marks:5, diff:"Hard",
  prompt:"Multinomial Naïve Bayes. Classify document <b>d = \"cheap cheap offer\"</b> (cheap×2, offer×1). Compute the <b>log score for the spam class c1</b>: \\(\\ln P(c1)+\\sum_{w\\in d}\\ln P(w|c1)\\).",
  formulas:[
    "P(cⱼ) = Ncⱼ / N     (class prior)",
    "P(w|cⱼ) = (tf(w,cⱼ)+1) / (|cⱼ|+|V|)     (Laplace)"
  ],
  table:{
    headers:["Parameter","Value"],
    rows:[["N (total docs)","10"],["Nc1 (spam docs)","3"],["|c1| (word count in spam)","20"],["|V| (vocab size)","5"],["tf(cheap, c1)","10"],["tf(offer, c1)","2"]]
  },
  substeps:[
    {label:"P(c1) =",       accept:["0.3","0.30","3/10"],    hint:"= Nc1 / N = 3 / 10"},
    {label:"P(cheap|c1) =", accept:["0.44","0.4400","11/25"],hint:"= (10+1) / (20+5) = 11/25"},
    {label:"P(offer|c1) =", accept:["0.12","0.1200","3/25"], hint:"= (2+1) / (20+5) = 3/25"}
  ],
  finalLabel:"log score(c1) =",
  accept:["-4.9662","-4.966","-4.97"],
  hint:"4 dp  (use ln)",
  steps:[
    "P(c1) = 3/10 = <strong>0.3</strong>",
    "P(cheap|c1) = (10+1)/(20+5) = 11/25 = <strong>0.44</strong>",
    "P(offer|c1) = (2+1)/(20+5) = 3/25 = <strong>0.12</strong>",
    "log score(c1) = ln(0.3) + 2×ln(0.44) + ln(0.12) = −1.2040 + 2×(−0.8210) + (−2.1203) = <strong>−4.9662</strong>"
  ],
  model:"\\(\\ln(0.3)+2\\ln(0.44)+\\ln(0.12)=-1.204-1.642-2.120=\\mathbf{-4.966}\\). To classify, compare against \\(\\log\\text{score}(c2)\\) — the higher value wins. Logs prevent arithmetic underflow from multiplying many small probabilities."
},
{
  id:"m4-nb-classify", module:4, week:"W9", kind:"code", marks:5, diff:"Hard",
  prompt:"<b>Python.</b> Implement <code>APPLY_MULTINOMIAL_NB(V, prior, condprob, d)</code>: score document d for each class using \\(\\log P(c)+\\sum_{w\\in d}\\log P(w|c)\\) and return the higher-scoring class.",
  model:`<pre class="code"><span class="kw">import</span> math
<span class="kw">def</span> <span class="fn">APPLY_MULTINOMIAL_NB</span>(V, prior, condprob, d):
    W = {V[i]: i <span class="kw">for</span> i <span class="kw">in</span> range(len(V)) <span class="kw">if</span> V[i] <span class="kw">in</span> d}
    score = {}
    <span class="kw">for</span> c <span class="kw">in</span> range(<span class="st">2</span>):
        score[c] = math.log(prior[c])
        <span class="kw">for</span> (w, i) <span class="kw">in</span> W.items():
            score[c] += math.log(condprob[c][i])
    <span class="kw">if</span> score[<span class="st">1</span>] &gt; score[<span class="st">0</span>]:
        <span class="kw">return</span> <span class="st">1</span>      <span class="cm"># spam</span>
    <span class="kw">else</span>:
        <span class="kw">return</span> <span class="st">0</span>      <span class="cm"># not spam</span></pre>`,
  notes:"Use <code>log</code> to avoid underflow when multiplying many small probabilities. Only terms present in <em>both</em> V and d contribute. Return the class with the higher log score. <code>prior[0]=P(not spam)</code>, <code>prior[1]=P(spam)</code>."
},
{
  id:"m4-rocchio-calc", module:4, week:"W9", kind:"calc", marks:3, diff:"Hard",
  prompt:"Rocchio classification. A centroid is the vector average of all docs in a class. For feature VM in the relevant class R101, the values across the 4 relevant docs are 0.17, 0.10, 0.00, 0.17. Compute the centroid value for VM.",
  accept:["0.11",".11","0.110","0.44/4"],
  hint:"2 dp",
  steps:[
    "Sum the feature across the class docs: 0.17 + 0.10 + 0.00 + 0.17 = 0.44",
    "Divide by class size |class| = 4: 0.44 / 4 = <strong>0.11</strong>"
  ],
  model:"\\(\\text{centroid}=\\dfrac{\\sum_{d\\in class}\\text{vector}(d)}{|class|}=\\dfrac{0.44}{4}=0.11\\). Relevant centroid = R101, non-relevant = !R101; divide by pos_n / neg_n respectively."
},
{
  id:"m4-sentiment-tf", module:4, week:"W9", kind:"mc", marks:2, diff:"Normal",
  prompt:"Five statements about sentiment analysis — which is <b>FALSE</b>?",
  options:[
    "Sentiment analysis (opinion mining) discovers users' opinions about products or services.",
    "An orientation is the opinion about an entity/aspect provided by the opinion holder at a specific time.",
    "The goal of emotion classification is to separate subjective from objective information — a binary classification task.",
    "Aspects are features/components/functions of the entity and can be nouns or noun phrases."
  ],
  correct:2,
  explain:"Separating subjective from objective information (binary) is <strong>subjectivity classification</strong>. <em>Emotion classification</em> classifies text into a predefined set of basic emotions (happy, sad, angry…). The statement swaps the two definitions."
},
{
  id:"m4-nltk-aspect", module:4, week:"W9", kind:"code", marks:4, diff:"Normal",
  prompt:"<b>Python.</b> Using NLTK, write <code>get_aspect(sentence)</code> that returns all tokens whose POS tag starts with <code>\"NN\"</code> (i.e. nouns — the aspect candidates).",
  model:`<pre class="code"><span class="kw">from</span> nltk <span class="kw">import</span> word_tokenize, pos_tag

<span class="kw">def</span> <span class="fn">get_aspect</span>(sentence):
    tokens = word_tokenize(sentence)
    tagged = pos_tag(tokens)
    aspects = [word <span class="kw">for</span> word, tag <span class="kw">in</span> tagged
               <span class="kw">if</span> tag.startswith(<span class="st">"NN"</span>)]
    <span class="kw">return</span> aspects</pre>`,
  notes:"<code>word_tokenize</code> → tokens, <code>pos_tag</code> → POS tags, <code>tag.startswith(\"NN\")</code> filters nouns: NN (singular), NNS (plural), NNP/NNPS (proper). ABSA prompt alternative uses few-shot examples and “return python list only” to force structured output — more accurate but less explainable than the NLTK rule-based method."
},
{
  id:"m4-jaccard-calc", module:4, week:"W11", kind:"calc", marks:3, diff:"Hard",
  prompt:"Binary distance. Comparing d1 and d2 term by term gives the contingency counts: q (both 1) = 0, r (d1=0,d2=1) = 3, s (d1=1,d2=0) = 2, t (both 0) = 2. Compute the <b>Jaccard distance</b> \\(\\dfrac{r+s}{q+r+s}\\).",
  accept:["1","1.0","5/5"],
  hint:"e.g. 1",
  steps:[
    "Jaccard ignores t (double zeros).",
    "= (r+s) / (q+r+s) = (3+2) / (0+3+2) = 5/5 = <strong>1</strong>"
  ],
  model:"\\(disJac(d1,d2)=\\dfrac{r+s}{q+r+s}=\\dfrac{5}{5}=1\\). Jaccard <em>ignores</em> double-zeros (t) → stricter, best for sparse binary data. Simple Matching includes t: \\(\\dfrac{r+s}{q+r+s+t}=\\dfrac{5}{7}\\)."
},
{
  id:"m4-clustprec", module:4, week:"W11", kind:"calc", marks:3, diff:"Normal",
  prompt:"Cluster precision = (sum of MaxClass sizes) / |D|. With 10 documents, C1={d2,d5,d10} has majority 'spam' → MaxClass(C1)=2; C2={d1,d3,d4,d6,d7,d8,d9} has majority 'not spam' → MaxClass(C2)=6. Compute cluster precision.",
  accept:["0.8",".8","8/10","0.80"],
  hint:"e.g. 0.8",
  steps:[
    "Sum of MaxClass sizes = 2 + 6 = 8",
    "Divide by total documents |D| = 10",
    "Cluster precision = 8/10 = <strong>0.8</strong>"
  ],
  model:"\\(\\text{Cluster Precision}=\\dfrac{\\sum_i|MaxClass(C_i)|}{|D|}=\\dfrac{2+6}{10}=0.8\\). MaxClass(Ci) = docs in cluster Ci that belong to the cluster's majority class. Higher = better clustering."
},
{
  id:"m4-recommender-short", module:4, week:"W11", kind:"short", marks:2, diff:"Normal",
  prompt:"<b>Short answer.</b> Describe the 3-step pipeline of a user-based collaborative-filtering recommender, naming the function for each step.",
  model:"(1) <em>my_correlation(Rvs)</em> → compute the user-user similarity (correlation) matrix; (2) <em>my_cluster(Rvs)</em> → group similar users into clusters; (3) <em>my_prediction(Rvs, C, U, I)</em> → predict the unseen ratings (the 0s — items not yet rated) using similar cluster members' ratings.",
  keypoints:["my_correlation() → user-user similarity matrix","my_cluster() → group similar users","my_prediction() → fill in 0 (unrated) entries","0 means user has NOT rated the item"]
},

/* ===================== MODULE 5 — wk12 ===================== */
{
  id:"m5-pagerank-calc", module:5, week:"W12", kind:"calc", marks:5, diff:"Hard",
  prompt:"PageRank \\(PR(u)=\\tfrac{\\lambda}{N}+(1-\\lambda)\\sum_{v\\in B_u}\\tfrac{PR(v)}{L_v}\\), with λ=0.15, N=4, initial PR=0.25. Graph links: A→B, A→D, C→A, D→B, C→B. Only C points to A, and \\(L_C=2\\). Compute \\(PR(A)\\) after the first iteration.",
  accept:["0.14375","0.144",".14375","0.1438"],
  hint:"5 dp",
  steps:[
    "Base score: λ/N = 0.15/4 = 0.0375",
    "A's in-links Bᴀ = {C}; C has Lᴄ = 2 outgoing links.",
    "Link contribution: (1−0.15) × PR(C)/Lᴄ = 0.85 × 0.25/2 = 0.85 × 0.125 = 0.10625",
    "PR(A) = 0.0375 + 0.10625 = <strong>0.14375</strong>"
  ],
  model:"\\(PR(A)=\\tfrac{0.15}{4}+0.85\\times\\tfrac{PR(C)}{L_C}=0.0375+0.85\\times\\tfrac{0.25}{2}=\\mathbf{0.14375}\\). After iteration 1: A=D=0.14375, B=0.4625 (highest, most inlinks), C=0.0375 (lowest, no inlinks)."
},
{
  id:"m5-pagerank-mc", module:5, week:"W12", kind:"mc", marks:2, diff:"Normal",
  prompt:"In the same PageRank example, page C has <b>no incoming links</b>. What is its PageRank after the first iteration, and why?",
  options:[
    "0.4625 — it has the most inlinks.",
    "0.25 — unchanged from the initial value.",
    "0.0375 — only the base score λ/N, because the summation term is 0.",
    "1.0 — pages with no inlinks get maximum rank."
  ],
  correct:2,
  explain:"With no pages pointing to C, the \\(\\sum PR(v)/L_v\\) term is 0, so C gets only the random-jump base score \\(λ/N = 0.15/4 = 0.0375\\) — the lowest in the graph. B, with the most inlinks, gets the highest (0.4625)."
},
{
  id:"m5-pagerank-formula", module:5, week:"W12", kind:"formula", marks:6, diff:"Hard",
  prompt:"PageRank iteration 1. \\(PR(u)=\\tfrac{\\lambda}{N}+(1-\\lambda)\\sum_{v\\in B_u}\\tfrac{PR(v)}{L_v}\\), \\(\\lambda=0.15\\), \\(N=4\\), initial \\(PR=0.25\\). Compute <b>all four pages</b> in the order that unlocks each calculation.",
  formulas:[
    "PR(u) = λ/N + (1−λ) × Σ PR(v)/L(v)   (sum over pages v that link to u)"
  ],
  table:{
    headers:["Page","Out-links L(v)","In-links B(u)"],
    rows:[["A","2  (→B, →D)","C"],["B","0  (dangling)","A, C, D"],["C","2  (→A, →B)","none"],["D","1  (→B)","A"]]
  },
  substeps:[
    {label:"PR(C) =", accept:["0.0375","0.038",".0375"],   hint:"No pages link to C → only base score λ/N = 0.15/4"},
    {label:"PR(A) =", accept:["0.14375","0.144","0.1438"], hint:"In-link: C (L_C=2) → 0.0375 + 0.85×(0.25/2)"},
    {label:"PR(D) =", accept:["0.14375","0.144","0.1438"], hint:"In-link: A (L_A=2) → 0.0375 + 0.85×(0.25/2)"}
  ],
  finalLabel:"PR(B) =",
  accept:["0.4625","0.463","0.46"],
  hint:"4 dp",
  steps:[
    "PR(C) = 0.15/4 + 0.85×0 = <strong>0.0375</strong> (no in-links, only random-jump base)",
    "PR(A) = 0.15/4 + 0.85×(PR(C)/L_C) = 0.0375 + 0.85×(0.25/2) = 0.0375 + 0.10625 = <strong>0.14375</strong>",
    "PR(D) = 0.15/4 + 0.85×(PR(A)/L_A) = 0.0375 + 0.85×(0.25/2) = 0.0375 + 0.10625 = <strong>0.14375</strong>",
    "PR(B) = 0.15/4 + 0.85×(PR(A)/L_A + PR(C)/L_C + PR(D)/L_D) = 0.0375 + 0.85×(0.125+0.125+0.25) = 0.0375 + 0.85×0.5 = <strong>0.4625</strong>"
  ],
  model:"\\(PR(B)=\\tfrac{0.15}{4}+0.85\\times\\!\\left(\\tfrac{0.25}{2}+\\tfrac{0.25}{2}+\\tfrac{0.25}{1}\\right)=0.0375+0.425=\\mathbf{0.4625}\\). B receives links from all three other pages; C receives none. The order C→A→D→B mirrors the dependency chain."
},
{
  id:"m5-attention-tf", module:5, week:"W12", kind:"mc", marks:2, diff:"Normal",
  prompt:"In BERT, what does the <code>attention_mask</code> do?",
  options:[
    "It is a binary mask where 1 = real token to attend to, and 0 = padding token to ignore.",
    "It deletes stopwords before encoding.",
    "It is a 0/1 label indicating whether the sentence is relevant.",
    "It stores the final contextualised embeddings."
  ],
  correct:0,
  explain:"<code>attention_mask</code> is a binary mask: <strong>1 = attend to a real token, 0 = ignore a padding token</strong>. Shorter sentences are padded, and the padding tokens should be ignored by the encoder."
},
{
  id:"m5-bert-embed", module:5, week:"W12", kind:"mc", marks:2, diff:"Normal",
  prompt:"What is the key difference between BERT's <b>initial</b> embeddings (<code>model.embeddings</code>) and the <b>contextualised</b> output (<code>last_hidden_state</code>)?",
  options:[
    "The contextualised embedding has a different shape ([1,10,768] vs [1,5,768]).",
    "Initial = the token's own embedding (no context); contextualised = the token's embedding after attending to all other tokens. Same shape, richer values.",
    "Initial embeddings are contextual; the encoder strips context away.",
    "They are identical — BERT does not change the values."
  ],
  correct:1,
  explain:"Both keep shape [1, 10, 768]. Initial = the token's own embedding, <strong>not context-aware</strong>. After passing through <code>model.encoder</code> with the attention_mask, <code>last_hidden_state</code> is <strong>context-aware</strong> — each token's vector is influenced by the surrounding tokens (richer values, same shape)."
},
{
  id:"m5-contrastive-short", module:5, week:"W12", kind:"short", marks:3, diff:"Hard",
  prompt:"<b>Short answer.</b> Describe the 3-step pipeline that integrates pseudo-relevance feedback with contrastive learning to train a retrieval encoder.",
  model:"(1) <strong>Build positive pairs:</strong> use a baseline IR model (e.g. BM25) to retrieve top-k docs and <em>assume they are positive</em> (pseudo-relevance feedback, no labels) → pairs (Q, D⁺). (2) <strong>Select negatives:</strong> random or low-ranked docs; the most useful are <em>hard negatives</em> — documents ranked just below top-k → pairs (Q, D⁻). (3) <strong>Train with contrastive loss</strong> (e.g. InfoNCE) so the encoder <em>increases</em> sim(Q, D⁺) and <em>decreases</em> sim(Q, D⁻). After training, encode the query and docs and rank by dot-product similarity.",
  keypoints:["pseudo-relevance feedback → top-k = positives, no labels","negatives = random / low-ranked; hard negatives = just below top-k","contrastive loss (InfoNCE): pull positives closer, push negatives further","after training: encode → rank by dot-product similarity"]
}
];

/* expose */
if (typeof window !== 'undefined') window.BANK = BANK, window.MODULES = MODULES;
