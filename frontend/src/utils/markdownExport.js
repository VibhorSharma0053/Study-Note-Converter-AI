/**
 * Utility functions for serializing structured study notes (ParseResponse)
 * into standard Markdown (.md) and triggering client-side file downloads.
 */

/**
 * Converts a ParseResponse object into a formatted Markdown string.
 * 
 * @param {Object} data - The ParseResponse object from backend/state.
 * @returns {string} - The complete Markdown document text.
 */
export function generateMarkdownString(data) {
  if (!data) return '';

  const lines = [];

  // Document Title
  lines.push(`# ${data.title || 'Study Notes'}`);
  lines.push(`**Subject:** ${data.subject || 'General'}  `);
  lines.push(`**Generated:** ${new Date().toLocaleDateString()}  `);
  lines.push('\n---\n');

  // Summary
  if (data.summary) {
    lines.push('## 📝 Summary\n');
    lines.push(`${data.summary}\n`);
    lines.push('\n---\n');
  }

  // Key Takeaways / Important Points
  if (Array.isArray(data.important_points) && data.important_points.length > 0) {
    lines.push('## 💡 Key Takeaways\n');
    data.important_points.forEach((point) => {
      lines.push(`- ${point}`);
    });
    lines.push('\n---\n');
  }

  // Core Concepts & Theory
  if (Array.isArray(data.concepts) && data.concepts.length > 0) {
    lines.push('## 📚 Core Theory & Concepts\n');
    
    // Group concepts by topic
    const grouped = data.concepts.reduce((acc, c) => {
      const topic = c.topic || 'General';
      if (!acc[topic]) acc[topic] = [];
      acc[topic].push(c);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([topic, items]) => {
      lines.push(`### ${topic}\n`);
      items.forEach((concept) => {
        lines.push(`#### ${concept.title}`);
        lines.push(`${concept.definition}\n`);
        if (concept.example) {
          lines.push(`> **Example:** ${concept.example}\n`);
        }
      });
    });
    lines.push('\n---\n');
  }

  // Code Snippets
  if (Array.isArray(data.code_snippets) && data.code_snippets.length > 0) {
    lines.push('## 💻 Code Snippets\n');
    data.code_snippets.forEach((snippet) => {
      lines.push(`### ${snippet.title}`);
      if (snippet.explanation) {
        lines.push(`${snippet.explanation}\n`);
      }
      lines.push(`\`\`\`${snippet.language || 'text'}`);
      lines.push(snippet.code);
      lines.push('```\n');
    });
    lines.push('\n---\n');
  }

  // Interview Questions
  if (Array.isArray(data.interview_questions) && data.interview_questions.length > 0) {
    lines.push('## 🎯 Interview Questions\n');
    data.interview_questions.forEach((q, index) => {
      lines.push(`#### Q${index + 1}: ${q.question}`);
      if (q.difficulty) {
        lines.push(`*Difficulty: ${q.difficulty}*\n`);
      }
      lines.push(`**Answer:**  \n${q.answer}\n`);
      if (q.explanation) {
        lines.push(`**Explanation:**  \n${q.explanation}\n`);
      }
    });
    lines.push('\n---\n');
  }

  // Practice Questions
  if (Array.isArray(data.practice_questions) && data.practice_questions.length > 0) {
    lines.push('## ✏️ Practice Questions & Quizzes\n');
    data.practice_questions.forEach((pq, index) => {
      lines.push(`#### ${index + 1}. ${pq.question}`);
      
      if (pq.question_type === 'mcq' && Array.isArray(pq.options)) {
        lines.push('Options:');
        pq.options.forEach((opt, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx);
          lines.push(`- [ ] **${letter}.** ${opt}`);
        });
        lines.push('');
      }

      lines.push(`**Correct Answer:** ${pq.answer}\n`);
    });
  }

  return lines.join('\n');
}

/**
 * Triggers a browser download of a Markdown file.
 * 
 * @param {string} filename - Desired filename (e.g. "python_notes.md")
 * @param {string} content - Markdown text content
 */
export function downloadMarkdownFile(filename, content) {
  // Sanitize filename
  const safeFilename = (filename || 'study_notes')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .concat('.md');

  // Create Blob
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  
  // Create Object URL
  const url = URL.createObjectURL(blob);

  // Create temporary link element and click it
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', safeFilename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}