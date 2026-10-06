import { Exam, ExtractedQuestion } from '@/types';

export const SAMPLE_SSC_QUESTIONS: ExtractedQuestion[] = [
  {
    id: 'ssc-q1',
    questionNumber: 1,
    questionText: 'Which Article of the Constitution of India deals with the "Right to Constitutional Remedies"?',
    options: ['Article 19', 'Article 21', 'Article 32', 'Article 44'],
    correctAnswer: 2, // Article 32
    explanation: 'Article 32 provides the Right to Constitutional Remedies and was called the "Heart and Soul of the Constitution" by Dr. B.R. Ambedkar.',
    confidence: 'high',
    section: 'Indian Polity'
  },
  {
    id: 'ssc-q2',
    questionNumber: 2,
    questionText: 'Which planet in the Solar System has the highest number of confirmed natural satellites (moons)?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correctAnswer: 1, // Saturn
    explanation: 'Saturn currently leads the solar system with 146 confirmed moons according to recent IAU data.',
    confidence: 'high',
    section: 'General Science'
  },
  {
    id: 'ssc-q3',
    questionNumber: 3,
    questionText: 'The famous "Chauri Chaura" incident took place in which present-day Indian state in the year 1922?',
    options: ['Bihar', 'Uttar Pradesh', 'West Bengal', 'Punjab'],
    correctAnswer: 1, // Uttar Pradesh
    explanation: 'Chauri Chaura is located in Gorakhpur district, Uttar Pradesh. Mahatma Gandhi suspended the Non-Cooperation Movement after this incident.',
    confidence: 'high',
    section: 'Indian History'
  },
  {
    id: 'ssc-q4',
    questionNumber: 4,
    questionText: 'Find the odd one out: 64, 125, 216, 343, 512, 729, 1000',
    options: ['64', '216', '343', '729'],
    correctAnswer: 0, // 64 or 729: 64 is 4^3 and 8^2, 729 is 9^3 and 27^2. In cube sequence all are cubes.
    explanation: 'All are perfect cubes: 4^3, 5^3, 6^3, 7^3, 8^3, 9^3, 10^3. 64 is also a square (8^2) and cube (4^3), while in strict square/cube properties 64 and 729 have dual properties.',
    confidence: 'high',
    section: 'Reasoning'
  },
  {
    id: 'ssc-q5',
    questionNumber: 5,
    questionText: 'Which hormone is primarily responsible for the "fight-or-flight" response in human beings?',
    options: ['Insulin', 'Thyroxine', 'Adrenaline (Epinephrine)', 'Melatonin'],
    correctAnswer: 2, // Adrenaline
    explanation: 'Adrenaline is secreted by the adrenal glands during acute stress situations to increase heart rate, blood pressure, and alertness.',
    confidence: 'high',
    section: 'General Science'
  },
  {
    id: 'ssc-q6',
    questionNumber: 6,
    questionText: 'The "Pritzker Prize" is recognized as the highest international honor in which field?',
    options: ['Literature', 'Architecture', 'Cinema', 'Journalism'],
    correctAnswer: 1, // Architecture
    explanation: 'The Pritzker Architecture Prize is often referred to as the "Nobel Prize of Architecture".',
    confidence: 'high',
    section: 'Current Affairs & Awards'
  },
  {
    id: 'ssc-q7',
    questionNumber: 7,
    questionText: 'If "COMPUTER" is coded as "RFUVQNPC", how is "MEDICINE" written in that code?',
    options: ['EOJDJEFM', 'EOJDEJFM', 'MFEJDJOE', 'MFEDJJOE'],
    correctAnswer: 0, // EOJDJEFM
    explanation: 'Reverse the word and add +1 to intermediate letters while keeping ends shifted correctly.',
    confidence: 'high',
    section: 'Reasoning'
  },
  {
    id: 'ssc-q8',
    questionNumber: 8,
    questionText: 'In Economics, what does the "Phillips Curve" illustrate the relationship between?',
    options: ['Income and Consumption', 'Inflation and Unemployment', 'Tax rate and Tax revenue', 'Exchange rate and Balance of Trade'],
    correctAnswer: 1, // Inflation and Unemployment
    explanation: 'The Phillips Curve posits an inverse relationship between inflation and unemployment in the short run.',
    confidence: 'high',
    section: 'Economics'
  },
  {
    id: 'ssc-q9',
    questionNumber: 9,
    questionText: 'Who was the Viceroy of India when the Indian National Congress was founded in 1885?',
    options: ['Lord Curzon', 'Lord Ripon', 'Lord Dufferin', 'Lord Dalhousie'],
    correctAnswer: 2, // Lord Dufferin
    explanation: 'Lord Dufferin served as the Viceroy of India from 1884 to 1888 when Allan Octavian Hume founded the INC.',
    confidence: 'high',
    section: 'Indian History'
  },
  {
    id: 'ssc-q10',
    questionNumber: 10,
    questionText: 'What is the chemical name of "Washing Soda"?',
    options: ['Sodium Bicarbonate', 'Sodium Carbonate Decahydrate', 'Calcium Oxychloride', 'Sodium Hydroxide'],
    correctAnswer: 1, // Sodium Carbonate Decahydrate
    explanation: 'Washing soda is Sodium Carbonate Decahydrate (Na2CO3·10H2O). Sodium Bicarbonate (NaHCO3) is Baking Soda.',
    confidence: 'high',
    section: 'General Science'
  },
  {
    id: 'ssc-q11',
    questionNumber: 11,
    questionText: 'Which classical dance form originated in the state of Kerala and is known for elaborate face makeup and costumes?',
    options: ['Bharatanatyam', 'Kathakali', 'Kuchipudi', 'Odissi'],
    correctAnswer: 1, // Kathakali
    explanation: 'Kathakali originated in Kerala and features colorful makeup, detailed gestures, and stylized storytelling.',
    confidence: 'high',
    section: 'Indian Culture'
  },
  {
    id: 'ssc-q12',
    questionNumber: 12,
    questionText: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
    options: ['65 seconds', '89 seconds', '90 seconds', '100 seconds'],
    correctAnswer: 1, // 89 seconds
    explanation: 'Speed = 240/24 = 10 m/s. Total distance for platform = 240 + 650 = 890 m. Time = 890 / 10 = 89 seconds.',
    confidence: 'high',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-q13',
    questionNumber: 13,
    questionText: 'Which Indian river is known as "Sorrow of Bihar" due to frequent devastating floods?',
    options: ['Gandak', 'Kosi', 'Son', 'Ghaghara'],
    correctAnswer: 1, // Kosi
    explanation: 'The Kosi River carries large amounts of silt and frequently changes its course, causing severe flooding in North Bihar.',
    confidence: 'high',
    section: 'Geography'
  },
  {
    id: 'ssc-q14',
    questionNumber: 14,
    questionText: 'What is the SI unit of Magnetic Flux?',
    options: ['Tesla', 'Weber', 'Henry', 'Gauss'],
    correctAnswer: 1, // Weber
    explanation: 'Weber (Wb) is the SI unit of magnetic flux. Tesla is the SI unit of magnetic flux density.',
    confidence: 'high',
    section: 'General Science'
  },
  {
    id: 'ssc-q15',
    questionNumber: 15,
    questionText: 'Which fundamental right cannot be suspended even during a National Emergency declared under Article 352?',
    options: ['Right to Equality (Articles 14-18)', 'Right to Freedom of Speech (Article 19)', 'Right to Protection of Life and Personal Liberty (Articles 20 and 21)', 'Right to Freedom of Religion (Articles 25-28)'],
    correctAnswer: 2, // Articles 20 and 21
    explanation: 'By the 44th Amendment Act of 1978, the right to protection in respect of conviction for offenses (Art. 20) and personal liberty (Art. 21) cannot be suspended.',
    confidence: 'high',
    section: 'Indian Polity'
  },
  {
    id: 'ssc-q16',
    questionNumber: 16,
    questionText: 'Pointing to a photograph of a man, Rahul said, "His mother is the only daughter of my mother." How is Rahul related to the man in the photo?',
    options: ['Father', 'Maternal Uncle', 'Brother', 'Grandfather'],
    correctAnswer: 1, // Maternal Uncle (or Father if speaker is female, but Rahul is male)
    explanation: 'Only daughter of Rahul\'s mother = Rahul\'s sister. The man\'s mother is Rahul\'s sister, making Rahul his Maternal Uncle.',
    confidence: 'high',
    section: 'Reasoning'
  },
  {
    id: 'ssc-q17',
    questionNumber: 17,
    questionText: 'Which gas is responsible for the green greenhouse effect the most on Earth by volume and absorption?',
    options: ['Carbon Dioxide', 'Water Vapor', 'Methane', 'Nitrous Oxide'],
    correctAnswer: 1, // Water Vapor
    explanation: 'Water vapor accounts for the largest percentage (36–70%) of the greenhouse effect on Earth, followed by carbon dioxide.',
    confidence: 'high',
    section: 'Environment'
  },
  {
    id: 'ssc-q18',
    questionNumber: 18,
    questionText: 'The "Tropic of Cancer" does NOT pass through which of the following Indian states?',
    options: ['Gujarat', 'Rajasthan', 'Odisha', 'Tripura'],
    correctAnswer: 2, // Odisha
    explanation: 'The Tropic of Cancer passes through 8 states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram. It does not pass through Odisha.',
    confidence: 'high',
    section: 'Geography'
  },
  {
    id: 'ssc-q19',
    questionNumber: 19,
    questionText: 'If 15 men can complete a work in 20 days, how many men are required to finish the same work in 12 days?',
    options: ['20 men', '25 men', '30 men', '22 men'],
    correctAnswer: 1, // 25 men
    explanation: 'Total man-days = 15 * 20 = 300. Men required for 12 days = 300 / 12 = 25 men.',
    confidence: 'high',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-q20',
    questionNumber: 20,
    questionText: 'Which computer memory is volatile and loses its content immediately when the power is turned off?',
    options: ['ROM', 'RAM', 'Flash Drive', 'Hard Disk'],
    correctAnswer: 1, // RAM
    explanation: 'RAM (Random Access Memory) is volatile temporary working memory that loses its contents upon power cutoff.',
    confidence: 'high',
    section: 'Computer Awareness'
  }
];

export const SAMPLE_BANKING_QUESTIONS: ExtractedQuestion[] = [
  {
    id: 'bank-q1',
    questionNumber: 1,
    questionText: 'What is the maximum limit of an IMPS (Immediate Payment Service) transaction as prescribed by RBI/NPCI?',
    options: ['₹1,00,000', '₹2,00,000', '₹5,00,000', '₹10,00,000'],
    correctAnswer: 2, // ₹5,00,000
    explanation: 'The per-transaction limit for IMPS was increased from ₹2 lakh to ₹5 lakh by RBI/NPCI.',
    confidence: 'high',
    section: 'Banking Awareness'
  },
  {
    id: 'bank-q2',
    questionNumber: 2,
    questionText: 'A sum of money doubles itself at compound interest in 15 years. In how many years will it become 8 times itself at the same rate?',
    options: ['30 years', '45 years', '60 years', '75 years'],
    correctAnswer: 1, // 45 years
    explanation: '8 = 2^3. Time = 3 * 15 = 45 years.',
    confidence: 'high',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'bank-q3',
    questionNumber: 3,
    questionText: 'What is the full form of "CASA" in Indian commercial banking?',
    options: ['Cash and Savings Account', 'Current Account and Savings Account', 'Credit and Solvency Agreement', 'Capital Adequacy and Security Assets'],
    correctAnswer: 1, // Current Account and Savings Account
    explanation: 'CASA stands for Current Account and Savings Account ratio, an indicator of low-cost funds available with a bank.',
    confidence: 'high',
    section: 'Banking Awareness'
  },
  {
    id: 'bank-q4',
    questionNumber: 4,
    questionText: 'The ratio of the speed of a boat in still water to the speed of the stream is 7:3. If downstream speed is 30 km/h, what is upstream speed?',
    options: ['12 km/h', '14 km/h', '16 km/h', '18 km/h'],
    correctAnswer: 0, // 12 km/h
    explanation: 'Let boat speed = 7x, stream = 3x. Downstream = 10x = 30 => x = 3. Upstream = 7x - 3x = 4x = 12 km/h.',
    confidence: 'high',
    section: 'Quantitative Aptitude'
  },
  {
    id: 'bank-q5',
    questionNumber: 5,
    questionText: 'Which regulatory authority in India regulates and licenses Credit Rating Agencies (like CRISIL, ICRA)?',
    options: ['Reserve Bank of India (RBI)', 'Securities and Exchange Board of India (SEBI)', 'IRDAI', 'PFRDA'],
    correctAnswer: 1, // SEBI
    explanation: 'SEBI (Securities and Exchange Board of India) regulates credit rating agencies under the SEBI (Credit Rating Agencies) Regulations, 1999.',
    confidence: 'high',
    section: 'Financial Awareness'
  }
];

export const INITIAL_SAMPLE_EXAMS: Exam[] = [
  {
    id: 'exam-ssc-cgl-01',
    title: 'SSC CGL Tier-I General Practice Mock 01',
    category: 'Staff Selection Commission (SSC)',
    description: 'Full-length 20-question mock exam covering Indian Polity, Science, History, Reasoning & Quantitative Aptitude with negative marking.',
    questions: SAMPLE_SSC_QUESTIONS,
    settings: {
      examName: 'SSC CGL Tier-I General Practice Mock 01',
      category: 'Staff Selection Commission (SSC)',
      totalQuestions: 20,
      durationMinutes: 15,
      marksPerQuestion: 2,
      negativeMarkingEnabled: true,
      negativeMarks: 0.5,
      questionOrder: 'sequential',
      shuffleOptions: false,
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    attemptsCount: 3,
    bestScore: 36,
    sourceDocumentName: 'SSC_CGL_Sample_Paper_2025.pdf',
  },
  {
    id: 'exam-banking-po-01',
    title: 'IBPS / SBI PO Quantitative & Banking Awareness Drill',
    category: 'Banking & Financial Exams',
    description: 'High-speed drill focused on commercial banking concepts, arithmetic aptitude, and modern digital banking rules.',
    questions: SAMPLE_BANKING_QUESTIONS,
    settings: {
      examName: 'IBPS / SBI PO Quantitative & Banking Awareness Drill',
      category: 'Banking & Financial Exams',
      totalQuestions: 5,
      durationMinutes: 10,
      marksPerQuestion: 1,
      negativeMarkingEnabled: true,
      negativeMarks: 0.25,
      questionOrder: 'sequential',
      shuffleOptions: false,
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    attemptsCount: 1,
    bestScore: 4.75,
    sourceDocumentName: 'Banking_Awareness_Practice_Set.docx',
  }
];

export const SAMPLE_RAW_DOCUMENTS = [
  {
    title: 'General Knowledge & Science Mock (Format A)',
    description: 'Standard 1. Question \\n A. B. C. D. \\n Ans: C structure',
    content: `1. Which gas is known as "Laughing Gas"?
A. Nitric Oxide
B. Nitrous Oxide
C. Nitrogen Dioxide
D. Dinitrogen Trioxide
Answer: B
Explanation: Nitrous Oxide (N2O) is commonly used as a mild analgesic and anesthetic, widely known as laughing gas.

2. In which year was the Reserve Bank of India (RBI) established?
A. 1930
B. 1935
C. 1947
D. 1950
Ans: B
Explanation: The RBI was established on April 1, 1935, under the Reserve Bank of India Act, 1934.

3. The concept of "Fundamental Duties" in the Indian Constitution was borrowed from which country?
A. United States
B. USSR (former Soviet Union)
C. United Kingdom
D. France
Correct Answer: B
Explanation: Fundamental Duties were incorporated in Part IVA (Article 51A) upon recommendation of the Swaran Singh Committee in 1976.

4. What is the value of acceleration due to gravity (g) at the center of the Earth?
A. 9.8 m/s²
B. 0 m/s²
C. Infinite
D. 4.9 m/s²
Correct: B
Explanation: At the center of the Earth, gravitational attraction from all surrounding mass cancels out symmetrically, resulting in g = 0.

5. Who among the following won the Nobel Prize in Physics for the discovery of the Raman Effect?
A. Jagadish Chandra Bose
B. Homi J. Bhabha
C. C.V. Raman
D. Meghnad Saha
Answer: C
Explanation: Sir C.V. Raman won the Nobel Prize in Physics in 1930 for his groundbreaking work on the scattering of light.`
  }
];
