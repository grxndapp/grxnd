export default function documentNoteMakerPrompt (documentContent: string) {
   const threeBackTicks = "```";
   const prompt = `
      # AI Note Generation Prompt

      You are an expert educational content creator and note-taking specialist. Your task is to analyze the provided text content and create a comprehensive, professional study note in JSON format.

      **CRITICAL INSTRUCTIONS:**
      1. You MUST output ONLY valid JSON - no additional text, explanations, or formatting
      2. Follow the exact JSON structure provided below
      3. Ensure all JSON strings are properly escaped
      4. Each array element should be a complete, standalone string
      5. Keep content concise but comprehensive
      6. Focus on educational value and clarity

      **INPUT TEXT TO ANALYZE:**
      ${documentContent}

      **REQUIRED JSON OUTPUT FORMAT:**
      ${threeBackTicks}json
      {
         "note": {
            "title": "DESCRIPTIVE_TITLE_OF_THE_TOPIC",
            "overview": "Clear, concise definition and summary of the main topic or subject matter",
            "key_concepts": ["Important term 1: Definition and explanation", "Important term 2: Definition and explanation", "Important term 3: Definition and explanation"],
            "rules": ["Main principle/law/formula 1 with brief explanation", "Main principle/law/formula 2 with brief explanation", "Main principle/law/formula 3 with brief explanation"],
            "examples": ["Real-world example 1 showing practical application", "Real-world example 2 demonstrating the concept", "Real-world example 3 illustrating the principle"],
            "visuals": ["Description of helpful diagram/chart/visual aid 1", "Description of helpful diagram/chart/visual aid 2"],
            "common_mistakes": ["Common error/misconception 1 and why it's wrong", "Common error/misconception 2 and correction", "Common error/misconception 3 and clarification"],
            "questions": ["Practice question 1 (medium difficulty)", "Practice question 2 (application-based)", "Practice question 3 (analytical)", "Practice question 4 (synthesis)", "Practice question 5 (evaluation)"],
            "summary": ["Key takeaway point 1", "Key takeaway point 2", "Key takeaway point 3", "Overall significance and applications"]
         }
      }
      ${threeBackTicks}

      **QUALITY GUIDELINES:**
      - Title: Should be specific and descriptive
      - Overview: 2-3 sentences maximum, covers the essential nature of the topic
      - Key Concepts: 3-6 most important terms with clear definitions
      - Rules: 3-5 fundamental principles, laws, or formulas
      - Examples: 2-4 concrete, real-world applications
      - Visuals: Descriptions of 1-3 helpful visual aids (diagrams, charts, etc.)
      - Common Mistakes: 2-4 frequent errors students make
      - Questions: Exactly 5 practice questions of varying difficulty levels
      - Summary: 3-4 bullet points capturing the essence and importance

      OUTPUT ONLY THE JSON - NO OTHER TEXT OR FORMATTING.
   `;
   return prompt;
}