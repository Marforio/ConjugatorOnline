export const DataProcessingAndVisualization = {
    "dataframe": {
    definition: "The primary pandas class representing a tabular data structure with labeled axes.",
    French: "table de données",
    German: "Datenrahmen",
    Italian: "struttura dati",
    image: "/images/vocab/dataframe.jpg",
    multiple_choice: ["data table", "spreadsheet object", "tabular array"]
  },

    "data processing": {
    definition: "Preparing and modifying raw data to make it ready for analysis and visualization.",
    French: "traitement des données",
    German: "Datenverarbeitung",
    Italian: "elaborazione dati",
    image: "/images/vocab/processing.jpg",
    multiple_choice: ["transformation", "preparation", "data handling"]
  },

  "outlier": {
    definition: "A data point that differs significantly from other observations in the dataset.",
    French: "valeur aberrante",
    German: "Ausreißer",
    Italian: "valore anomalo",
    image: "/images/vocab/outlier.jpg",
    multiple_choice: ["anomaly", "deviation", "extreme value"]
  },

  "data type casting": {
    definition: "Converting a data object from one type to another, typically using the pandas method df.astype().",
    French: "conversion de type de données",
    German: "Datentyp-Umwandlung",
    Italian: "conversione del tipo di dati",
    image: "/images/vocab/casting.jpg",
    multiple_choice: ["type conversion", "recasting", "data transformation"]
  },

  "data wrangling": {
    definition: "The process of cleaning and unifying complex data sets for easy access and analysis.",
    French: "nettoyage de données",
    German: "Datenaufbereitung",
    Italian: "preparazione dei dati",
    image: "/images/vocab/wrangling.jpg",
    multiple_choice: ["data munging", "data remediation", "data cleaning"]
  },

    "imputation": {
    definition: "The process of replacing missing data with substituted values, often using the pandas method df.fillna().",
    French: "imputation",
    German: "Imputation",
    Italian: "imputazione",
    image: "/images/vocab/imputation.jpg",
    multiple_choice: ["data replacement", "filling gaps", "substitution"]
  },


  "pivoting": {
    definition: "Reshaping data from a 'long' to a 'wide' format using the pandas method df.pivot().",
    French: "pivotage",
    German: "Pivotierung",
    Italian: "rotazione",
    image: "/images/vocab/pivoting.jpg",
    multiple_choice: ["reformatting", "reshaping", "cross-tabulation"]
  },

  "melting": {
    definition: "Massaging a DataFrame into a format where one or more columns are identifier variables, using the pandas method df.melt().",
    French: "fusion de colonnes",
    German: "Entpivotierung",
    Italian: "unpivoting",
    image: "/images/vocab/melting.jpg",
    multiple_choice: ["unpivoting", "stacking", "long-form conversion"]
  },

  "merging": {
    definition: "Combining two DataFrames based on a common key, using the pandas method df.merge().",
    French: "fusion",
    German: "Zusammenführen",
    Italian: "unione",
    image: "/images/vocab/merging.jpg",
    multiple_choice: ["joining", "combining", "linking"]
  },

  "one hot encoding": {
    definition: "Converting categorical variables into a binary format, often using the pandas method pd.get_dummies().",
    French: "encodage One-Hot",
    German: "One-Hot-Kodierung",
    Italian: "codifica One-Hot",
    image: "/images/vocab/encoding.jpg",
    multiple_choice: ["dummy variables", "binary encoding", "vectorization"]
  },

  "normalization": {
    definition: "Scaling numerical features to a standard range, usually between 0 and 1.",
    French: "normalisation",
    German: "Normalisierung",
    Italian: "normalizzazione",
    image: "/images/vocab/normalization.jpg",
    multiple_choice: ["min-max scaling", "rescaling", "standardization"]
  },

  "standardization": {
    definition: "Transforming data to have a mean of 0 and a standard deviation of 1.",
    French: "standardisation",
    German: "Standardisierung",
    Italian: "standardizzazione",
    image: "/images/vocab/standardization.jpg",
    multiple_choice: ["Z-score scaling", "mean centering", "variance scaling"]
  },

  "feature extraction": {
    definition: "The process of selecting and combining variables into features to reduce the amount of data to be processed.",
    French: "extraction de caractéristiques",
    German: "Merkmalsextraktion",
    Italian: "estrazione di caratteristiche",
    image: "/images/vocab/feature_extraction.jpg",
    multiple_choice: ["attribute creation", "feature engineering", "variable selection"]
  },

  "sample": {
    definition: "Returning a random selection of items from a dataset using the pandas method df.sample().",
    French: "échantillon",
    German: "Stichprobe",
    Italian: "campione",
    image: "/images/vocab/sample.jpg",
    multiple_choice: ["subset", "selection", "example"]
  },

  "serialization": {
    definition: "Converting a data structure into a format that can be stored or transmitted (e.g., df.to_pickle()).",
    French: "sérialisation",
    German: "Serialisierung",
    Italian: "serializzazione",
    image: "/images/vocab/serialization.jpg",
    multiple_choice: ["marshalling", "pickling", "flattening"]
  },

  "pipeline": {
    definition: "A sequence of data processing elements where the output of one element is the input of the next.",
    French: "pipeline",
    German: "Pipeline",
    Italian: "pipeline",
    image: "/images/vocab/pipeline.jpg",
    multiple_choice: ["workflow", "sequence", "automated path"]
  },

  "binning": {
    definition: "Grouping a set of continuous values into a smaller number of 'bins' using the pandas method pd.cut().",
    French: "binage",
    German: "Klassierung",
    Italian: "raggruppamento",
    image: "/images/vocab/binning.jpg",
    multiple_choice: ["bucketing", "discretization", "quantization"]
  },

  "aggregation": {
    definition: "Combining multiple data points into a single summary value using the pandas method df.agg().",
    French: "agrégation",
    German: "Aggregation",
    Italian: "aggregazione",
    image: "/images/vocab/aggregation.jpg",
    multiple_choice: ["summation", "collection", "summary statistics"]
  },

  "row": {
    definition: "A horizontal series of cells in a table.",
    French: "ligne",
    German: "Zeile",
    Italian: "riga",
    image: "/images/vocab/row.jpg",
    multiple_choice: ["record", "observation", "horizontal line"]
  },

  "column": {
    definition: "A vertical series of cells in a table.",
    French: "colonne",
    German: "Spalte",
    Italian: "colonna",
    image: "/images/vocab/column.jpg",
    multiple_choice: ["feature", "field", "vertical line"]
  },

  "metric": {
    definition: "A specific quantifiable value or measurement that makes it possible to track performance.",
    French: "mesure",
    German: "Metrik",
    Italian: "metrica",
    image: "/images/vocab/metric.jpg",
    multiple_choice: ["KPI", "measure", "indicator"]
  },

  "data type": {
    definition: "A kind of data, such as an integer, boolean, or text.",
    French: "type de données",
    German: "Datentyp",
    Italian: "tipo di dati",
    image: "/images/vocab/datatype.jpg",
    multiple_choice: ["format", "class", "data category"]
  },

  "graph": {
    definition: "A general term for a visual representation of data.",
    French: "graphique",
    German: "Graph",
    Italian: "grafico",
    image: "/images/vocab/graph.jpg",
    multiple_choice: ["chart", "diagram", "plot"]
  },

  "pie chart": {
    definition: "A circular graph that divides a whole into slices to represent numerical proportions.",
    French: "camembert",
    German: "Tortendiagramm",
    Italian: "grafico a torta",
    image: "/images/vocab/piechart.jpg",
    multiple_choice: ["circle graph", "sector chart", "proportion map"]
  },

  "x axis": {
    definition: "The horizontal line on a graph, pronounced like 'ex'.",
    French: "axe des x",
    German: "x-Achse",
    Italian: "asse x",
    image: "/images/vocab/xaxis.jpg",
    multiple_choice: ["horizontal axis", "abscissa", "base line"]
  },

  "y axis": {
    definition: "The vertical line on a graph, pronounced like 'why'.",
    French: "axe des y",
    German: "y-Achse",
    Italian: "asse y",
    image: "/images/vocab/yaxis.jpg",
    multiple_choice: ["vertical axis", "ordinate", "side line"]
  },

  "legend": {
    definition: "A key that explains the colors, patterns, or symbols used in a graph.",
    French: "légende",
    German: "Legende",
    Italian: "legenda",
    image: "/images/vocab/legend.jpg",
    multiple_choice: ["key", "explanation", "map guide"]
  },

  "plot": {
    definition: "The act of putting data on a graph or the graph itself, using methods like df.plot().",
    French: "tracer",
    German: "zeichnen",
    Italian: "tracciare",
    image: "/images/vocab/plot.jpg",
    multiple_choice: ["mapping", "charting", "drawing"]
  },

  "scatter plot": {
    definition: "A graph where individual data points are plotted as dots without connecting lines.",
    French: "nuage de points",
    German: "Streudiagramm",
    Italian: "grafico a dispersione",
    image: "/images/vocab/scatterplot.jpg",
    multiple_choice: ["dot plot", "scattergram", "point chart"]
  },

  "label": {
    definition: "The visual element that identifies a category or value in a graph.",
    French: "étiquette",
    German: "Beschriftung",
    Italian: "etichetta",
    image: "/images/vocab/label.jpg",
    multiple_choice: ["tag", "name", "identifier"]
  },

  "header": {
    definition: "The name or title of a column of values, accessible via df.columns.",
    French: "en-tête",
    German: "Kopfzeile",
    Italian: "intestazione",
    image: "/images/vocab/header.jpg",
    multiple_choice: ["title", "column name", "top row"]
  },

  "coordinates": {
    definition: "Number pairs (x,y) that identify specific points on a plane.",
    French: "coordonnées",
    German: "Koordinaten",
    Italian: "coordinate",
    image: "/images/vocab/coordinates.jpg",
    multiple_choice: ["location", "point markers", "grid reference"]
  },

  "trend line": {
    definition: "A line drawn on a graph to show the general direction or pattern of data points.",
    French: "ligne de tendance",
    German: "Trendlinie",
    Italian: "linea di tendenza",
    image: "/images/vocab/trendline.jpg",
    multiple_choice: ["regression line", "best fit", "direction line"]
  },

  "interval": {
    definition: "The distance or difference between values on a graph's axes.",
    French: "intervalle",
    German: "Intervall",
    Italian: "intervallo",
    image: "/images/vocab/interval.jpg",
    multiple_choice: ["gap", "step", "spacing"]
  },

  "tick": {
    definition: "A marking on an axis that represents a specific interval or value.",
    French: "graduation",
    German: "Teilstrich",
    Italian: "segno di graduazione",
    image: "/images/vocab/tick.jpg",
    multiple_choice: ["marker", "notch", "axis mark"]
  },

  "slope": {
    definition: "The steepness of a line calculated as the vertical change divided by horizontal change (rise over run).",
    French: "pente",
    German: "Steigung",
    Italian: "pendenza",
    image: "/images/vocab/slope.jpg",
    multiple_choice: ["gradient", "angle", "inclination"]
  },

  "origin": {
    definition: "The starting point on a graph where coordinates are (0,0).",
    French: "origine",
    German: "Ursprung",
    Italian: "origine",
    image: "/images/vocab/origin.jpg",
    multiple_choice: ["zero point", "base", "start"]
  },

  "grid": {
    definition: "A network of intersecting lines that help to accurately map points on a graph.",
    French: "grille",
    German: "Gitter",
    Italian: "griglia",
    image: "/images/vocab/grid.jpg",
    multiple_choice: ["mesh", "network", "lattice"]
  },

  "range": {
    definition: "The span between the lowest and highest values in a dataset.",
    French: "étendue",
    German: "Bereich",
    Italian: "intervallo di valori",
    image: "/images/vocab/range.jpg",
    multiple_choice: ["span", "spread", "scope"]
  },

  "histogram": {
    definition: "A bar graph showing frequency distribution where the area of bars is proportional to the frequency.",
    French: "histogramme",
    German: "Histogramm",
    Italian: "istogramma",
    image: "/images/vocab/histogram.jpg",
    multiple_choice: ["frequency chart", "distribution plot", "bar distribution"]
  },

  "cell": {
    definition: "A single unit in a table or DataFrame containing a specific value.",
    French: "cellule",
    German: "Zelle",
    Italian: "cella",
    image: "/images/vocab/cell.jpg",
    multiple_choice: ["entry", "box", "data point"]
  },

  "peak": {
    definition: "The highest point on a curve, wave, or distribution graph.",
    French: "sommet",
    German: "Spitze",
    Italian: "picco",
    image: "/images/vocab/peak.jpg",
    multiple_choice: ["maximum", "top", "apex"]
  },

  "trough": {
    definition: "The lowest point on a curve or wave.",
    French: "creux",
    German: "Tiefpunkt",
    Italian: "punto di minimo",
    image: "/images/vocab/trough.jpg",
    multiple_choice: ["bottom", "valley", "minimum"]
  },

  "field": {
    definition: "A space in a user interface or a specific column in a database/table where data is input.",
    French: "champ",
    German: "Feld",
    Italian: "campo",
    image: "/images/vocab/field.jpg",
    multiple_choice: ["entry box", "attribute", "input space"]
  },

  "distribution": {
    definition: "How data values are spread out or arranged across a range or graph.",
    French: "distribution",
    German: "Verteilung",
    Italian: "distribuzione",
    image: "/images/vocab/distribution.jpg",
    multiple_choice: ["spread", "arrangement", "frequency pattern"]
  },

  "index": {
    definition: "A label for the category of a row, analogous to headers for columns, accessed via df.index.",
    French: "indice",
    German: "Index",
    Italian: "indice",
    image: "/images/vocab/index.jpg",
    multiple_choice: ["row label", "pointer", "reference"]
  },

  "axes": {
    definition: "The plural form of 'axis', representing both the horizontal and vertical lines (pronounced /AX-eez/).",
    French: "axes",
    German: "Achsen",
    Italian: "assi",
    image: "/images/vocab/axes.jpg",
    multiple_choice: ["coordinates lines", "graph frames", "reference lines"]
  },

  "data": {
    definition: "The plural form of 'datum'; information collected for analysis.",
    French: "données",
    German: "Daten",
    Italian: "dati",
    image: "/images/vocab/data.jpg",
    multiple_choice: ["information", "facts", "records"]
  },

  "line graph": {
    definition: "A graph that uses line segments to connect data points and show changes over time.",
    French: "graphique linéaire",
    German: "Liniendiagramm",
    Italian: "grafico a linee",
    image: "/images/vocab/linegraph.jpg",
    multiple_choice: ["trend graph", "path plot", "sequence chart"]
  },

  "figure": {
    definition: "The entire space in a visualization containing graphs, legends, and titles (e.g., in Matplotlib).",
    French: "figure",
    German: "Abbildung",
    Italian: "figura",
    image: "/images/vocab/figure.jpg",
    multiple_choice: ["display area", "chart container", "illustration"]
  },

  "average": {
    definition: "A number expressing the central or typical value in a set of data; in common usage, it refers to the 'mean'.",
    French: "moyenne",
    German: "Durchschnitt",
    Italian: "media",
    image: "/images/vocab/average.jpg",
    multiple_choice: ["central value", "typical result", "mean"]
  },

  "mean": {
    definition: "The sum of all values divided by the number of values, calculated using the pandas method df.mean().",
    French: "moyenne arithmétique",
    German: "arithmetisches Mittel",
    Italian: "media aritmetica",
    image: "/images/vocab/mean.jpg",
    multiple_choice: ["arithmetic average", "sum-based center", "expected value"]
  },

  "median": {
    definition: "The middle value in a list of numbers ordered from lowest to highest, calculated using the pandas method df.median().",
    French: "médiane",
    German: "Median",
    Italian: "mediana",
    image: "/images/vocab/median.jpg",
    multiple_choice: ["middle point", "50th percentile", "center value"]
  },

  "mode": {
    definition: "The value that appears most frequently in a data set, calculated using the pandas method df.mode().",
    French: "mode",
    German: "Modalwert",
    Italian: "moda",
    image: "/images/vocab/mode.jpg",
    multiple_choice: ["most frequent", "common value", "popular score"]
  },

  "standard deviation": {
    definition: "A measure of the amount of variation or dispersion in a set of values, calculated using the pandas method df.std().",
    French: "écart-type",
    German: "Standardabweichung",
    Italian: "deviazione standard",
    image: "/images/vocab/std_dev.jpg",
    multiple_choice: ["variance measure", "spread indicator", "volatility"]
  },

  "variance": {
    definition: "The expectation of the squared deviation of a random variable from its mean, calculated using the pandas method df.var().",
    French: "variance",
    German: "Varianz",
    Italian: "varianza",
    image: "/images/vocab/variance.jpg",
    multiple_choice: ["spread square", "dispersion", "degree of change"]
  },

  "correlation": {
    definition: "A statistical measure that expresses the extent to which two variables are linearly related, often viewed via df.corr().",
    French: "corrélation",
    German: "Korrelation",
    Italian: "correlazione",
    image: "/images/vocab/correlation.jpg",
    multiple_choice: ["relationship", "association", "dependency"]
  },

  "percentile": {
    definition: "A score below which a specific percentage of data falls (e.g., the 75th percentile), calculated using df.quantile().",
    French: "percentile",
    German: "Perzentil",
    Italian: "percentile",
    image: "/images/vocab/percentile.jpg",
    multiple_choice: ["quantile", "rank position", "relative standing"]
  },

  "skewness": {
    definition: "A measure of the asymmetry of the probability distribution of a variable, found using df.skew().",
    French: "asymétrie",
    German: "Schiefe",
    Italian: "asimmetria",
    image: "/images/vocab/skewness.jpg",
    multiple_choice: ["tilt", "asymmetry", "distribution slant"]
  }

};

export const CryptographyVocab = {
  "modulo": {
    definition: "An operation that finds the remainder of an integer division, often represented by the symbol %.",
    French: "modulo",
    German: "Modulo",
    Italian: "modulo",
    image: "/images/vocab/modulo.jpg",
    multiple_choice: ["remainder", "division factor", "integer rest"]
  },

  "simple substitution": {
    definition: "An encryption technique that replaces each plaintext symbol with a fixed different symbol.",
    French: "substitution simple",
    German: "einfache Substitution",
    Italian: "sostituzione semplice",
    image: "/images/vocab/substitution.jpg",
    multiple_choice: ["replacement cipher", "symbol swap", "alphabet shift"]
  },

  "transposition": {
    definition: "A cryptographic technique that rearranges the symbols of the plaintext into a different order.",
    French: "transposition",
    German: "Transposition",
    Italian: "trasposizione",
    image: "/images/vocab/transposition.jpg",
    multiple_choice: ["shuffling", "reordering", "permutation"]
  },

  "brute force": {
    definition: "An attack method that attempts every possible key combination until the correct one is found.",
    French: "force brute",
    German: "Brute-Force",
    Italian: "forza bruta",
    image: "/images/vocab/bruteforce.jpg",
    multiple_choice: ["exhaustive search", "trial and error", "key guessing"]
  },

  "plain text": {
    definition: "The original, unencrypted message or data intended for input into a cipher.",
    French: "texte clair",
    German: "Klartext",
    Italian: "testo in chiaro",
    image: "/images/vocab/plaintext.jpg",
    multiple_choice: ["raw data", "readable message", "input text"]
  },

  "ciphertext": {
    definition: "The encrypted output of a cryptographic algorithm that is unreadable without the key.",
    French: "texte chiffré",
    German: "Geheimtext",
    Italian: "testo cifrato",
    image: "/images/vocab/ciphertext.jpg",
    multiple_choice: ["encrypted data", "coded message", "scrambled output"]
  },

  "cipher": {
    definition: "The specific algorithm or mathematical process used for encrypting and decrypting data.",
    French: "chiffre",
    German: "Chiffre",
    Italian: "cifrario",
    image: "/images/vocab/cipher.jpg",
    multiple_choice: ["algorithm", "encryption code", "mathematical rule"]
  },

  "mapping": {
    definition: "A relationship between two sets of values, such as linking a plaintext letter to a ciphertext letter.",
    French: "mappage",
    German: "Abbildung",
    Italian: "mappatura",
    image: "/images/vocab/mapping.jpg",
    multiple_choice: ["correlation", "assignment", "linking"]
  },

  "frequency analysis": {
    definition: "Studying the commonality of letters or groups of letters in ciphertext to break a cipher.",
    French: "analyse de fréquence",
    German: "Häufigkeitsanalyse",
    Italian: "analisi delle frequenze",
    image: "/images/vocab/frequency.jpg",
    multiple_choice: ["statistical attack", "pattern study", "count analysis"]
  },

  "greatest common divisor": {
    definition: "The largest positive integer that divides two or more integers without a remainder (GCD).",
    French: "plus grand commun diviseur",
    German: "grösster gemeinsamer Teiler",
    Italian: "massimo comun divisore",
    image: "/images/vocab/gcd.jpg",
    multiple_choice: ["highest factor", "common denominator", "largest divisor"]
  },

  "hybrid cryptosystem": {
    definition: "A system that uses symmetric encryption for data and asymmetric encryption for key exchange.",
    French: "cryptosystème hybride",
    German: "hybrides Kryptosystem",
    Italian: "crittosistema ibrido",
    image: "/images/vocab/hybrid.jpg",
    multiple_choice: ["mixed encryption", "dual-key system", "combined cipher"]
  },

  "prime number": {
    definition: "A natural number greater than 1 that has no positive divisors other than 1 and itself.",
    French: "nombre premier",
    German: "Primzahl",
    Italian: "numero primo",
    image: "/images/vocab/prime.jpg",
    multiple_choice: ["indivisible number", "base integer", "unique factor"]
  },

  "hash": {
    definition: "A fixed-size string generated from input data that acts as a unique digital fingerprint.",
    French: "hachage",
    German: "Hashwert",
    Italian: "hash",
    image: "/images/vocab/hash.jpg",
    multiple_choice: ["digest", "checksum", "digital thumbprint"]
  },

  "signature": {
    definition: "A digital code used to verify the authenticity and integrity of a digital document or message.",
    French: "signature numérique",
    German: "digitale Signatur",
    Italian: "firma digitale",
    image: "/images/vocab/signature.jpg",
    multiple_choice: ["authentication tag", "digital seal", "identity mark"]
  },

  "one-time pad": {
    definition: "A theoretically unbreakable cipher using a random key that is the same length as the message.",
    French: "masque jetable",
    German: "Einmalschlüssel-Verfahren",
    Italian: "cifrario di Vernam",
    image: "/images/vocab/otp.jpg",
    multiple_choice: ["perfect secrecy", "single-use key", "random pad"]
  },

  "man-in-the-middle": {
    definition: "An attack where the adversary secretly intercepts and relays messages between two parties.",
    French: "attaque de l'homme du milieu",
    German: "Man-in-the-Middle-Angriff",
    Italian: "attacco man-in-the-middle",
    image: "/images/vocab/mitm.jpg",
    multiple_choice: ["interception attack", "eavesdropping", "relay attack"]
  },

  "modular inverse": {
    definition: "An integer 'x' such that (a * x) % n equals 1; essential for decryption in RSA.",
    French: "inverse modulaire",
    German: "modulares Inverses",
    Italian: "inverso modulare",
    image: "/images/vocab/modinv.jpg",
    multiple_choice: ["reciprocal modulo", "decryption factor", "reverse modulo"]
  },

  "shuffle": {
    definition: "A procedure used to randomize the order of a sequence, often to generate permutations.",
    French: "mélange",
    German: "Mischen",
    Italian: "mescolamento",
    image: "/images/vocab/shuffle.jpg",
    multiple_choice: ["randomization", "reordering", "scrambling"]
  },

  "sieve of eratosthenes": {
    definition: "An ancient algorithm for finding all prime numbers up to any given limit.",
    French: "crible d'Ératosthène",
    German: "Sieb des Eratosthenes",
    Italian: "crivello di Eratostene",
    image: "/images/vocab/sieve.jpg",
    multiple_choice: ["prime filter", "number sorter", "divisor finder"]
  },

  "slicing": {
    definition: "Extracting a specific sub-sequence or part of a data string.",
    French: "découpage",
    German: "Slicing",
    Italian: "taglio",
    image: "/images/vocab/slicing.jpg",
    multiple_choice: ["segmentation", "string cutting", "partitioning"]
  },

  "square root": {
    definition: "A value that, when multiplied by itself, gives the original number.",
    French: "racine carrée",
    German: "Quadratwurzel",
    Italian: "radice quadrata",
    image: "/images/vocab/sqrt.jpg",
    multiple_choice: ["second root", "base power", "inverse square"]
  },

  "symmetric key": {
    definition: "A single secret key shared by both the sender and receiver for encryption and decryption.",
    French: "clé symétrique",
    German: "symmetrischer Schlüssel",
    Italian: "chiave simmetrica",
    image: "/images/vocab/symmetric.jpg",
    multiple_choice: ["shared secret", "private key", "single key"]
  },

  "rsa cipher": {
    definition: "An asymmetric algorithm based on the difficulty of factoring the product of two large prime numbers.",
    French: "chiffrement RSA",
    German: "RSA-Verfahren",
    Italian: "cifrario RSA",
    image: "/images/vocab/rsa.jpg",
    multiple_choice: ["public-key cipher", "prime encryption", "asymmetric code"]
  },

  "random number": {
    definition: "A number chosen from a set with no predictable pattern, used for keys and nonces.",
    French: "nombre aléatoire",
    German: "Zufallszahl",
    Italian: "numero casuale",
    image: "/images/vocab/random.jpg",
    multiple_choice: ["unpredictable value", "stochastic number", "arbitrary digit"]
  },

  "seed": {
    definition: "The starting value used to initialize a pseudorandom number generator (PRNG).",
    French: "graine",
    German: "Startwert",
    Italian: "seme",
    image: "/images/vocab/seed.jpg",
    multiple_choice: ["initial state", "start key", "generator source"]
  },

  "pseudorandom numbers": {
    definition: "Numbers that appear random but are generated by a deterministic mathematical formula.",
    French: "nombres pseudo-aléatoires",
    German: "Pseudozufallszahlen",
    Italian: "numeri pseudocasuali",
    image: "/images/vocab/prng.jpg",
    multiple_choice: ["artificial randomness", "deterministic numbers", "synthetic noise"]
  },

  "precedence": {
    definition: "The priority rules that determine which part of a cryptographic formula is calculated first.",
    French: "priorité",
    German: "Rangfolge",
    Italian: "precedenza",
    image: "/images/vocab/precedence.jpg",
    multiple_choice: ["order of operations", "hierarchy", "logic flow"]
  },

  "primality test": {
    definition: "A test to determine if a large number is prime without fully factoring it.",
    French: "test de primalité",
    German: "Primzahltest",
    Italian: "test di primalità",
    image: "/images/vocab/primetest.jpg",
    multiple_choice: ["prime check", "divisibility test", "factor check"]
  },

  "factor": {
    definition: "A number that divides another number evenly; for 15, they are 1, 3, 5, and 15.",
    French: "facteur",
    German: "Faktor",
    Italian: "fattore",
    image: "/images/vocab/factor.jpg",
    multiple_choice: ["divisor", "component", "multiplier"]
  },

  "trial division algorithm": {
    definition: "A basic method of testing primality by dividing by every prime number smaller than the square root.",
    French: "division par essais",
    German: "Probedivision",
    Italian: "divisione per tentativi",
    image: "/images/vocab/trial.jpg",
    multiple_choice: ["manual factoring", "iterative division", "brute-force factoring"]
  },

  "prime factorization": {
    definition: "Breaking down a composite number into a product of its prime components.",
    French: "décomposition en produit de facteurs premiers",
    German: "Primfaktorzerlegung",
    Italian: "scomposizione in fattori primi",
    image: "/images/vocab/factorization.jpg",
    multiple_choice: ["prime breakdown", "integer decomposition", "base factoring"]
  },

  "whitespace character": {
    definition: "Non-printing characters (spaces, tabs, newlines) that often need to be stripped before encryption.",
    French: "caractère d'espacement",
    German: "Leerraumzeichen",
    Italian: "carattere di spaziatura",
    image: "/images/vocab/whitespace.jpg",
    multiple_choice: ["hidden symbol", "blank space", "formatting mark"]
  },

  "word pattern": {
    definition: "The structure of repeating characters in a word, used to decode substitution ciphers.",
    French: "modèle de mot",
    German: "Wortmuster",
    Italian: "schema della parola",
    image: "/images/vocab/wordpattern.jpg",
    multiple_choice: ["letter structure", "cipher pattern", "text layout"]
  },

  "textbook rsa": {
    definition: "A simplified RSA model that lacks the necessary padding and security measures of production RSA.",
    French: "RSA théorique",
    German: "Schulbuch-RSA",
    Italian: "RSA scolastico",
    image: "/images/vocab/textbook.jpg",
    multiple_choice: ["idealized RSA", "academic cipher", "unpadded RSA"]
  },

  "asymmetric key": {
    definition: "A pair of keys (public and private) where one encrypts and the other decrypts.",
    French: "clé asymétrique",
    German: "asymmetrischer Schlüssel",
    Italian: "chiave asimmetrica",
    image: "/images/vocab/asymmetric.jpg",
    multiple_choice: ["public-private pair", "dual key", "unmatched keys"]
  },

  "entropy": {
    definition: "A measure of randomness or unpredictability in a data source or key.",
    French: "entropie",
    German: "Entropie",
    Italian: "entropia",
    image: "/images/vocab/entropy.jpg",
    multiple_choice: ["randomness level", "uncertainty", "disorder"]
  },

  "initialization vector": {
    definition: "A random block used to ensure that the same plaintext encrypts to different ciphertext (IV).",
    French: "vecteur d'initialisation",
    German: "Initialisierungsvektor",
    Italian: "vettore di inizializzazione",
    image: "/images/vocab/iv.jpg",
    multiple_choice: ["starting block", "nonce", "randomizer"]
  },

  "salt": {
    definition: "Random data added to a password before hashing to prevent rainbow table attacks.",
    French: "sel",
    German: "Salz",
    Italian: "sale",
    image: "/images/vocab/salt.jpg",
    multiple_choice: ["hash spice", "random prefix", "password enhancer"]
  },

  "key exchange": {
    definition: "A method where parties securely exchange cryptographic keys over an insecure channel (e.g., Diffie-Hellman).",
    French: "échange de clés",
    German: "Schlüsselaustausch",
    Italian: "scambio di chiavi",
    image: "/images/vocab/keyexchange.jpg",
    multiple_choice: ["handshake", "agreement protocol", "secret sharing"]
  },

  "zero-knowledge proof": {
    definition: "A method to prove you know a secret without actually revealing the secret itself.",
    French: "preuve à divulgation nulle de connaissance",
    German: "Zero-Knowledge-Beweis",
    Italian: "conoscenza zero",
    image: "/images/vocab/zkp.jpg",
    multiple_choice: ["blind proof", "secret verification", "no-reveal proof"]
  },

  "elliptic curve": {
    definition: "A type of algebraic curve used in modern cryptography for faster, smaller, more secure keys (ECC).",
    French: "courbe elliptique",
    German: "elliptische Kurve",
    Italian: "curva ellittica",
    image: "/images/vocab/ecc.jpg",
    multiple_choice: ["algebraic cipher", "geometric code", "modern encryption"]
  },

  "collision": {
    definition: "When two different inputs to a hash function produce the same hash output.",
    French: "collision",
    German: "Kollision",
    Italian: "collisione",
    image: "/images/vocab/collision.jpg",
    multiple_choice: ["hash overlap", "duplicate output", "function failure"]
  },

  "padding": {
    definition: "Adding extra, non-significant data to a message to make it fit a required block size.",
    French: "remplissage",
    German: "Padding",
    Italian: "riempimento",
    image: "/images/vocab/padding.jpg",
    multiple_choice: ["data stuffing", "block alignment", "filler"]
  },

  "steganography": {
    definition: "The practice of hiding a secret message inside a non-secret file (like an image or audio).",
    French: "stéganographie",
    German: "Steganographie",
    Italian: "steganografia",
    image: "/images/vocab/steganography.jpg",
    multiple_choice: ["hidden writing", "obfuscation", "covert channel"]
  }
};