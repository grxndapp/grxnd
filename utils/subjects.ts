export const subjectLevels = [
	"National 5", "Higher", "Advanced Higher"
]

export const subjects = [
	"Math", "English",
	"Physics", "Biology", "Chemistry",
	"Computer Science", "Administration"
]

export const subjectTopics: SubjectTopicsList = {
	"math": {
		national5: [
			"Algebraic expressions",
			"Linear and Quadratic Equations",
			"Simultaneous equations",
			"Factorizing and expanding",
			"Fractions, percentages, ratios, and proportion",
			"Pythagoras' theorem",
			"Trigonometry",
			"Graphs of straight lines and quadratics",
			"Statistics (mean, median, mode, range)",
			"Probability",
			"Area, volume, and surface area of shapes",
			"Similar figures and scale factor",
			"Geometry (midpoint, gradient, distance)"
		],
		higher: [
			"Polynomials and factor theorem",
			"Quadratic functions (roots, discriminant, turning points)",
			"Exponential and logarithmic functions",
			"Trigonometry (identities, equations, graphs)",
			"Radians",
			"Differentiation",
			"Integration",
			"Vectors in 2D and 3D",
			"Straight line and circle equations",
			"Sequences and series",
			"Binomial expansion",
			"Statistics (standard deviation, normal distribution, bivariate data)"
		],
		advancedHigher: [
			"Complex numbers",
			"Partial fractions and Polynomial division",
			"Advanced functions (exponential, logarithmic, trigonometric)",
			"Further trigonometry",
			"Hyperbolic functions",
			"Differentiation (higher order, parametric, implicit)",
			"Integration techniques (substitution, integration by parts, partial fractions)",
			"Differential equations (first and second order)",
			"Vectors in 3D (lines, planes, intersections)",
			"Matrices and determinants",
			"Sequences and series (summations, convergence, sigma notation)",
			"Proofs (induction, contradiction, counterexamples)"
		]
	}, 
	"english": {
		national5: [
			// Reading & Analysis
			"Close reading of non-fiction texts",
			"Analysis of language, structure, and style",
			"Understanding purpose, audience, and tone",
			"Scottish set texts (poetry, drama, prose)",

			// Writing
			"Creative writing (short stories, personal/reflective pieces)",
			"Discursive and persuasive essays",
			"Transactional writing (letters, articles, reports)",

			// Listening & Talking
			"Listening to spoken texts and answering questions",
			"Group discussions",
			"Individual presentations",

			// Critical Reading
			"Critical essays on studied literature",
			"Analysis of themes, character, setting, and techniques"
		],
		higher: [
			// Reading & Analysis
			"Detailed textual analysis (close reading of complex texts)",
			"Evaluation of writers' techniques",
			"Scottish set texts (deeper analysis of themes, form, style)",

			// Writing
			"Advanced creative writing (short stories, reflective writing)",
			"Discursive and persuasive essays with research and evidence",
			"Transactional writing (formal letters, reports, articles)",

			// Listening & Talking
			"Critical listening skills",
			"Structured individual presentations",
			"Formal group discussions and debates",

			// Critical Reading
			"In-depth critical essays on literature (prose, poetry, drama, film)",
			"Comparative analysis of different texts",
			"Evaluation of literary techniques and effectiveness"
		],
		advancedHigher: [
			// Specialist Study
			"Independent study of a chosen text or author",
			"Extended critical essay (specialist study dissertation)",
			"Research and referencing techniques",

			// Textual Analysis
			"Detailed analysis of an unseen literary text",
			"Evaluation of structure, imagery, language, and style",

			// Portfolio Writing
			"Two pieces of writing: creative and discursive/critical",
			"Demonstration of advanced style, originality, and structure",

			// Literary Study
			"In-depth study of selected texts across genres (prose, poetry, drama, film)",
			"Critical evaluation of complex themes and techniques",
			"Comparative literary analysis"
		]
	},
	"physics": {
		national5: [
			// Dynamics & Space
			"Speed, distance, and time",
			"Acceleration",
			"Newton's laws of motion",
			"Weight, mass, and gravitational field strength",
			"Forces, work done, and energy",
			"Projectiles (horizontal and vertical motion)",
			"Satellites and space exploration",
			
			// Electricity & Energy
			"Series and parallel circuits",
			"Current, voltage, and resistance (Ohm's Law)",
			"Electrical power and energy",
			"Specific heat capacity",
			"Specific latent heat",
			"Nuclear radiation (alpha, beta, gamma, half-life)",
			
			// Waves & Radiation
			"Wave properties (frequency, wavelength, speed)",
			"Refraction, reflection, diffraction",
			"Electromagnetic spectrum",
			"Sound waves and ultrasound",
			"Radiation safety and applications"
		],
		higher: [
			// Our Dynamic Universe
			"Equations of motion",
			"Projectile motion (2D)",
			"Newton's laws and forces",
			"Momentum, impulse, and collisions",
			"Work, power, and energy conservation",
			"Special relativity",
			"Cosmology and the expanding universe",

			// Electricity
			"Resistive circuits (potential dividers, internal resistance)",
			"Ohm's Law and non-ohmic resistors",
			"Electromotive force (emf) and lost volts",
			"AC and DC, root mean square (rms)",
			"Capacitors",

			// Waves & Particles
			"Wave equations and properties",
			"Interference, diffraction, and gratings",
			"Refraction and Snell's law",
			"Photoelectric effect",
			"Photons and wave-particle duality",
			"Nuclear reactions, fission, and fusion"
		],
		advancedHigher: [
			// Rotational Motion & Astrophysics
			"Angular velocity and acceleration",
			"Rotational dynamics (torque, moment of inertia)",
			"Rotational kinetic energy",
			"Gravitational fields and potential",
			"Satellites and orbital motion",
			"Stellar physics (HR diagram, standard candles, life cycle of stars)",
			"Cosmology (dark matter, dark energy)",

			// Quanta & Waves
			"Wave-particle duality",
			"de Broglie wavelength",
			"Photoelectric effect (Einstein's equation)",
			"Atomic spectra and energy levels",
			"Lasers",
			"Interference and diffraction at a double slit",
			"Polarization",

			// Electromagnetism
			"Electric fields (Coulomb's law, potential, field strength)",
			"Magnetic fields (force on a moving charge, force on a wire)",
			"Electromagnetic induction (Faraday's and Lenz's laws)",
			"Transformers and AC theory",
			"Capacitance and inductance in AC circuits",
			"Resonance and quality factor",

			// Investigating Physics
			"Uncertainties and error analysis",
			"Experimental design and data handling",
			"Graphing and best-fit methods",
			"Statistical analysis of results"
		]
	},
	"biology": {
		national5: [
			// Cell Biology
			"Cell structure",
			"Transport across cell membranes",
			"DNA, genes, and chromosomes",
			"Protein synthesis",
			"Enzymes and their functions",
			"Respiration",

			// Multicellular Organisms
			"Specialized cells and tissues",
			"Cell division",
			"Stem cells and differentiation",
			"Control and communication",
			"Reproduction",
			"Inheritance and genetic crosses",
			"Variation and survival",
			"Circulatory and transport systems in animals and plants",

			// Life on Earth
			"Ecosystems",
			"Photosynthesis",
			"Food production and fertilizers",
			"Sampling techniques",
			"Biotic and abiotic factors",
			"Human impacts on the environment",
			"Evolution and biodiversity"
		],
		higher: [
			// DNA & the Genome
			"DNA structure and replication",
			"Gene expression",
			"Proteins and enzymes",
			"Mutations and their effects",
			"Evolutionary processes",
			"Genomic sequencing and bioinformatics",

			// Metabolism & Survival
			"Metabolic pathways and control",
			"Cellular respiration",
			"Fermentation pathways",
			"Enzymes in metabolic control",
			"Metabolism in microorganisms",
			"Environmental control of metabolism",
			"Conformers vs regulators, dormancy, migration",
			"Adaptations for survival in extreme environments",

			// Sustainability & Interdependence
			"Food supply and security",
			"Photosynthesis",
			"Plant productivity and growth",
			"Animal welfare in farming",
			"Symbiosis",
			"Social behaviour in animals",
			"Biodiversity, human impact, and conservation"
		],
		advancedHigher: [
			// Cells & Proteins
			"Cell ultrastructure",
			"Proteins and their interactions",
			"Membrane proteins and transport",
			"Signal transduction pathways",
			"Cytoskeleton and cell movement",
			"Experimental techniques",

			// Organisms & Evolution
			"Sexual and asexual reproduction strategies",
			"Variation and inheritance",
			"Selection pressures and adaptations",
			"Sexual selection",
			"Speciation (allopatric, sympatric)",
			"Genetic drift and bottleneck effects",
			"Parental investment and reproductive behaviours",
			"Symbiosis and co-evolution",

			// Investigative Biology
			"Scientific principles and experimental design",
			"Sampling techniques and reliability",
			"Data analysis, presentation, and interpretation",
			"Statistical tests",
			"Ethics in biological research"
		]
	},
	"chemistry": {
		national5: [
			// Chemical Changes & Structure
			"Atomic structure",
			"Bonding",
			"Formulae and valency",
			"Balancing chemical equations",
			"Periodic table trends",
			"Acids and bases",
			"Rates of reaction",

			// Nature’s Chemistry
			"Hydrocarbons",
			"Addition and combustion reactions",
			"Alcohols and Carboxylic acids",
			"Esters",
			"Everyday consumer products",

			// Chemistry in Society
			"Metals",
			"Electrolysis (ions, half-equations)",
			"Fertilizers",
			"Energy from fuels",
			"Nuclear chemistry"
		],
		higher: [
			// Chemical Changes & Structure
			"Atomic orbitals, electronic configuration",
			"Periodic trends",
			"Intermolecular forces",
			"Covalent bonding and molecular shapes",

			// Nature’s Chemistry
			"Systematic naming and isomerism",
			"Alcohols, carboxylic acids, esters",
			"Aldehydes and ketones",
			"Oxidation and reduction reactions",
			"Soaps, detergents, emulsifiers",
			"Proteins, fats, and oils",
			"Flavour and fragrance chemistry",
			"UV radiation and free radical reactions",

			// Chemistry in Society
			"Rates of reaction and collision theory",
			"Energy changes and enthalpy calculations",
			"Hess’s Law and bond enthalpies",
			"Equilibrium",
			"Oxidizing and reducing agents",
			"Redox titrations",
			"Electrochemical cells",
			"Transition metals and complex ions",
			"Colorimetry and spectroscopy"
		],
		advancedHigher: [
			// Inorganic Chemistry
			"Electronic structure",
			"Periodic trends across periods and down groups",
			"Transition metals",
			"Crystal field theory",
			"Inorganic chemistry of d-block metals",

			// Physical Chemistry
			"Chemical equilibrium",
			"Entropy and free energy",
			"Chemical kinetics",
			"Acid-base equilibria",
			"Electrochemistry",
			"Spectroscopy and instrumental analysis",

			// Organic Chemistry
			"Advanced reaction mechanisms",
			"Stereoisomerism",
			"Synthetic routes and multistep synthesis",
			"Spectroscopic analysis for structure determination",
			"Polymers and biopolymers",
			"Pharmaceutical chemistry"
		]
	},
	"computer_science": {
		national5: [
			// Software Design & Development
			"Pseudocode and flowcharts",
			"Variables, constants, and data types",
			"Structures: arrays, records",
			"Input, processing, and output",
			"Conditional and iterative structures (IF, loops)",
			"Testing and debugging",
			"Translators",
			"Efficiency considerations",

			// Database Design & Development
			"Entities and attributes",
			"Data types and field validation",
			"SQL basics",
			"Forms and queries",
			"Database design (keys, relationships)",

			// Web Design & Development
			"HTML structure and tags",
			"CSS styling",
			"JavaScript basics",
			"Testing websites",
			"User interface design principles",

			// Computer Systems
			"Binary and hexadecimal number systems",
			"Floating point and negative numbers",
			"Text and graphics representation",
			"Computer architecture (processor, memory, buses)",
			"Security risks (malware, viruses, prevention)",
			"Environmental impact of computing",

			// Information Systems
			"Impact of computing on society",
			"Legal and ethical issues (Data Protection Act, copyright)",
			"Evaluating information sources"
		],
		higher: [
			// Software Design & Development
			"Top-down design and modularity",
			"Structured programming constructs",
			"Arrays (1D and 2D)",
			"Records and file handling",
			"Testing strategies (normal, extreme, exceptional data)",
			"Efficiency of algorithms (execution time, memory)",
			"High-level vs low-level languages",
			"Standard algorithms (linear search, binary search, sorting)",

			// Database Design & Development
			"Entity-relationship modelling",
			"Primary and foreign keys",
			"SQL",
			"Aggregate functions",
			"Normalization basics",
			"Data consistency and integrity",

			// Web Design & Development
			"HTML5 and CSS3 features",
			"JavaScript for interactivity and validation",
			"Client-side vs server-side scripting",
			"Responsive web design",
			"Usability and accessibility",

			// Computer Systems
			"Floating point representation and accuracy",
			"Bit-mapped graphics and vector graphics",
			"Instruction sets and machine code",
			"Data representation (Unicode, ASCII)",
			"Environmental impacts and ethical issues",
			"Network security (encryption, authentication)",

			// Information Systems
			"Big data and data analytics",
			"Distributed databases",
			"Cloud computing",
			"Impact of computing on society and the environment"
		],
		advancedHigher: [
			// Software Development
			"Advanced data structures",
			"Algorithms",
			"Algorithm complexity",
			"Object-oriented programming",
			"Testing methodologies",
			"Software development methodologies",

			// Database Systems
			"Advanced SQL",
			"Normalization to 3NF",
			"Transaction processing",
			"Concurrency and deadlock",
			"Distributed databases and security",
			"Relational algebra",

			// Web & Internet Technologies
			"Advanced client-side scripting (JavaScript, DOM manipulation)",
			"Server-side scripting and databases",
			"Cookies, sessions, and state management",
			"Web security (SQL injection, XSS, CSRF)",
			"Web protocols (HTTP, HTTPS, REST)",

			// Computer Systems
			"Computer architecture in detail",
			"Machine code and assembly language",
			"Parallel and distributed processing",
			"Networking",
			"Security and encryption algorithms",

			// Information Systems Design & Development
			"Project management techniques",
			"Systems analysis and design methodologies",
			"Evaluation of systems",
			"Legal, ethical, and environmental implications of computing"
		]
	},
	"administration": {
		national5: [
			// Administration Theory
			"Roles and responsibilities of administrative staff",
			"Skills and qualities of administrators",
			"Health and safety in the workplace",
			"Customer service and its importance",
			"Security of people, property, and information",
			"Impact of ICT on organisations",

			// IT Applications
			"Word processing",
			"Spreadsheets",
			"Databases",
			"Presentations",
			"Desktop publishing",
			"Electronic communication",

			// Theory of Effective Teams
			"Team roles and structures",
			"Benefits of effective teams",
			"Consequences of ineffective teams",
			"Motivation and leadership",
			"Time management techniques"
		],
		higher: [
			// Administration Theory
			"Advanced roles and responsibilities of administrators",
			"Time and task management",
			"Effective communication in organisations",
			"Health and safety legislation",
			"Security of information and data protection",
			"Impact of globalisation on administration",
			"Corporate social responsibility",

			// IT Applications
			"Advanced word processing",
			"Advanced spreadsheets",
			"Advanced databases",
			"Advanced presentations",
			"Electronic diaries and project management tools",

			// Theory of Teams & Leadership
			"Leadership styles and their impact",
			"Decision-making in organisations",
			"Conflict management",
			"Team development stages",
			"Motivational theories"
		],
		advancedHigher: [
			// Advanced Administration Theory
			"Strategic role of administration in organisations",
			"Impact of corporate culture",
			"Change management",
			"Knowledge management",
			"ICT in strategic decision making",
			"Implications of globalisation and outsourcing",
			"Advanced data security and legislation",

			// Advanced IT Applications
			"Complex spreadsheets",
			"Complex databases",
			"Integrated IT applications",
			"Project management software",
			"Evaluation of software packages",

			// Organisational Behaviour & Management
			"Advanced leadership and management theories",
			"Organisational structures and communication",
			"Human resource management",
			"Corporate social responsibility and sustainability",
			"Evaluation of administrative practices"
		]
	}
}

export const subjectColors: Record<string, string> = {
	"Math": "#1E90FF",
	"Physics": "#6A0DAD",
	"Biology": "#228B22",
	"Chemistry": "#FF4500",
	"English": "#FFD700",
	"Computer Science": "#2b8585",
	"Administration": "#5291cf"
}

export function retrieveSubjectTopic (subjectLevel: string, subject: string) {
	const subjectTopicsList = subjectTopics[subject.toLowerCase().replaceAll(" ", "_")];
	if (subjectLevel == "National 5") return subjectTopicsList.national5;
	if (subjectLevel == "Higher") return subjectTopicsList.higher;
	if (subjectLevel == "Advanced Higher") return subjectTopicsList.advancedHigher;
}