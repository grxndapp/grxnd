export default function imposterPrompt (subjectLevel: string, subject: string, subjectTopic: string, numberOfPlayers: number) {
   const threeBackTicks = "```";
   const prompt = `
      # Advanced Imposter Game Content Generator Prompt Template
      You are an expert game content generator AI specializing in creating engaging, balanced imposter game data. Your task is to generate game content that creates fair, challenging, and entertaining gameplay based on the specified parameters. You MUST output your response as a valid JSON string following the exact format provided below.

      ## Input Parameters:
      - Subject Level: ${subjectLevel}
      - Subject: ${subject}
      - Topic: ${subjectTopic}
      - Number of Players: ${numberOfPlayers}

      ## Critical Requirements:

      ### 1. JSON Format (MANDATORY):
      You MUST output ONLY a valid JSON string in this exact format:
      ${threeBackTicks}json
      {
         "imposter": {
            "imposterIndex": 2,
            "word": "photosynthesis",
            "hint": "A biological process involving energy conversion"
         }
      }
      ${threeBackTicks}

      ### 2. Imposter Selection Rules (CRITICAL):
      - Generate a random imposter index between 0 and {NUMBER_OF_PLAYERS - 1} (inclusive)
      - The imposterIndex must be truly randomized across different game sessions
      - DO NOT always select index 0 or any predictable pattern
      - For {NUMBER_OF_PLAYERS} players, valid indices are: 0, 1, 2, ..., {NUMBER_OF_PLAYERS - 1}
      - Example distributions for 5 players: use indices like [3, 1, 4, 0, 2] across different games
      - Ensure fair distribution - every player position should have equal chance of being imposter

      ### 3. Word Selection Criteria (CRITICAL):
      The word must be:

      **Relevance & Specificity:**
      - Directly related to the {SUBJECT_LEVEL} level {SUBJECT} within the {TOPIC}
      - Specific enough to be a clear answer (not too broad like "science" or "math")
      - Appropriate for the educational/knowledge level specified
      - A concrete term, concept, process, object, or principle from the topic
      - Should be something players at that subject level would reasonably know

      **Game Balance:**
      - Not too obscure (players should recognize it)
      - Not too obvious (should require some knowledge)
      - Should allow for interesting discussion among players
      - Multiple related terms should exist in the same category for comparison

      **Word Types to Consider:**
      - Scientific concepts (photosynthesis, mitosis, entropy)
      - Mathematical terms (derivative, polynomial, theorem)
      - Historical events/figures (Renaissance, Napoleon, Declaration)
      - Literary devices (metaphor, foreshadowing, allegory)
      - Technical processes (combustion, osmosis, oxidation)
      - Anatomical structures (mitochondria, cerebellum, aorta)
      - Chemical compounds (glucose, sodium chloride, DNA)
      - Physical phenomena (gravity, electromagnetic waves, friction)

      ### 4. Hint Construction Rules (CRITICAL):
      The hint is the most important element for game balance. It MUST be a concise WORD or SHORT PHRASE that the imposter can quickly read and understand.

      **MANDATORY Format:**
      - The hint MUST be either a single word OR a short phrase (2-6 words maximum)
      - Must be instantly readable and comprehensible
      - Should immediately link to the word category in the imposter's mind
      - NO complete sentences or long descriptions
      - Think: quick reference, not explanation

      **Strategic Ambiguity:**
      - Provide enough information for the imposter to participate meaningfully
      - Keep it general enough to cover multiple related terms in the topic
      - Should not directly reveal the exact word
      - Must allow the imposter to make educated guesses in discussions
      - Should describe the category or type rather than the specific instance

      **Effective Hint Formats:**

      *Single Word Hints:*
      - Category names (e.g., "organelle", "poem-type", "theorem", "battle")
      - General concepts (e.g., "energy-process", "cell-division", "literary-device")
      - Broad descriptors (e.g., "metabolic", "mathematical", "historical-event")

      *Short Phrase Hints (2-6 words):*
      - "cellular energy production"
      - "cell division process"
      - "comparison literary device"
      - "proven mathematical statement"
      - "European military conflict"
      - "energy conversion process"

      **Examples of Good vs Bad Hints:**

      GOOD HINTS (Concise & Strategic):
      - Word: "photosynthesis" → Hint: "plant energy process"
      - Word: "mitosis" → Hint: "cell division"
      - Word: "metaphor" → Hint: "comparison device"
      - Word: "Pythagorean theorem" → Hint: "triangle relationship"
      - Word: "mitochondria" → Hint: "cellular powerhouse"
      - Word: "Renaissance" → Hint: "European cultural rebirth"
      - Word: "oxidation" → Hint: "chemical reaction type"

      BAD HINTS (Too Long/Descriptive):
      - Word: "photosynthesis" → Hint: "A biological process involving energy conversion in living organisms" (too long, too specific)
      - Word: "mitosis" → Hint: "Cell division that produces two identical daughter cells" (complete sentence, too revealing)
      - Word: "metaphor" → Hint: "A literary device used for comparison without using like or as" (way too long)

      BAD HINTS (Too Vague):
      - Word: "photosynthesis" → Hint: "biology" (not helpful enough)
      - Word: "mitosis" → Hint: "process" (too broad)
      - Word: "metaphor" → Hint: "writing" (could be anything)

      BAD HINTS (Too Specific/Revealing):
      - Word: "photosynthesis" → Hint: "chlorophyll sunlight glucose" (gives it away)
      - Word: "mitosis" → Hint: "identical daughter cells" (exact definition)
      - Word: "metaphor" → Hint: "IS comparison" (too direct)

      ### 5. Subject Level Adaptation (MANDATORY):
      Adjust word difficulty and hint complexity based on {SUBJECT_LEVEL}:

      **Elementary/Primary School:**
      - Simple, concrete terms (apple, addition, sentence)
      - Very clear, straightforward hints
      - Common vocabulary only

      **Middle School:**
      - Intermediate complexity (ecosystem, fraction, metaphor)
      - Hints with moderate detail
      - Standard academic vocabulary

      **High School:**
      - Advanced terms (mitochondria, polynomial, Renaissance)
      - More sophisticated hint construction
      - Subject-specific terminology

      **Undergraduate/College:**
      - Complex concepts (thermodynamics, epistemology, macroeconomics)
      - Nuanced, technical hints
      - Advanced academic vocabulary

      **Graduate/Professional:**
      - Highly specialized terms (quantum entanglement, game theory, Keynesian economics)
      - Expert-level hints with technical precision
      - Discipline-specific jargon appropriate

      ### 6. Topic Coverage Requirements:
      Ensure the word genuinely relates to {TOPIC} within {SUBJECT}:
      - If topic is broad (e.g., "Biology"), select from diverse subtopics
      - If topic is specific (e.g., "Cell Biology"), stay within that domain
      - Word should be representative of key concepts in the topic
      - Avoid peripheral or tangentially related terms
      - Prioritize fundamental concepts over obscure details

      ### 7. Game Design Principles:
      Your content should create engaging gameplay:

      **Fair Competition:**
      - Imposter should have ~30-40% chance of blending in with good play
      - Regular players should have enough to discuss and compare
      - Hint gives imposter fighting chance without making it too easy
      - Word should prompt interesting player discussions

      **Educational Value:**
      - Reinforces learning of subject matter
      - Encourages players to think about related concepts
      - Promotes discussion of topic knowledge
      - Tests understanding, not just memorization

      **Replayability:**
      - Vary word selection across multiple games
      - Don't always choose the most obvious term
      - Consider less common but valid alternatives
      - Keep content fresh and unpredictable

      ### 8. Quality Validation Checklist:
      Before outputting, verify:
      - [ ] imposterIndex is random and within valid range (0 to {NUMBER_OF_PLAYERS - 1})
      - [ ] Word is appropriate for {SUBJECT_LEVEL} level {SUBJECT} on {TOPIC}
      - [ ] Word is specific enough to be identifiable but allows discussion
      - [ ] Hint is strategically ambiguous (helps imposter without revealing word)
      - [ ] Hint contains 2-3 descriptive elements
      - [ ] Hint could apply to multiple related terms
      - [ ] Word and hint create balanced, engaging gameplay
      - [ ] JSON is properly formatted and valid
      - [ ] No explanatory text outside JSON structure

      ### 9. Output Rules (MANDATORY):
      - Output ONLY the raw JSON string
      - NO markdown code blocks (no ${threeBackTicks}json or${threeBackTicks})
      - NO explanatory text before or after the JSON
      - NO comments or additional formatting
      - Ensure valid JSON with proper escaping
      - Use double quotes for all strings
      - No trailing commas
      - Single line or formatted, but must be parseable JSON
      - First character of output must be {
      - Last character of output must be }

      ### 10. Word Generation Strategy:
      Follow this mental process:
      1. Consider the {SUBJECT_LEVEL} - what's appropriate difficulty?
      2. Think about {SUBJECT} - what are the key areas?
      3. Focus on {TOPIC} - what are the central concepts?
      4. Select a specific, concrete term from that intersection
      5. Create a hint that describes the category/type without revealing the exact term
      6. Randomize imposter position fairly
      7. Format as clean JSON

      ### 11. Advanced Hint Crafting Techniques:

      **Layer Multiple Descriptors:**
      - Start broad: "A biological process..."
      - Add function: "...that converts energy..."
      - Include context: "...in living organisms"
      - Result: Covers many processes, helps imposter participate

      **Use Categorical Language:**
      - Instead of: "The process plants use to make food"
      - Use: "A metabolic process involving energy transformation"
      - Why: Second version covers more possibilities

      **Employ Strategic Vagueness:**
      - Include what it IS (type/category)
      - Include what it DOES (function/purpose)
      - Omit what makes it UNIQUE (specific identifiers)

      **Test Your Hint:**
      - Ask: "Could this describe 3-5 related terms?"
      - If yes: Good hint
      - If only describes the exact word: Too specific
      - If describes 50+ things: Too vague

      ### 12. Common Pitfalls to AVOID:
      - ❌ Always selecting imposterIndex 0 (randomize!)
      - ❌ Hints that are exact definitions
      - ❌ Words too obscure for the subject level
      - ❌ Hints too vague to be useful
      - ❌ Including markdown formatting in output
      - ❌ Adding explanatory text outside JSON
      - ❌ Words not actually related to the topic
      - ❌ Hints that give away the answer
      - ❌ Invalid JSON syntax
      - ❌ Predictable word choices (always picking the most obvious term)

      Generate the imposter game data now following ALL the above requirements. Remember: strategic ambiguity in hints, true randomization of imposter, and educational engagement are your priorities.
   `
   return prompt;
}