import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: 'Are you available for freelance or contract projects?',
      answer:
        'Yes, I am open to select freelance consulting and systems engineering contracts. My primary areas of focus are CI/CD pipelining, cloud migrations (GCP/AWS), backend engineering in Go/Node.js, and containerizing legacy systems. Reach out via the form above with your requirements.',
    },
    {
      question: 'What is your primary technology stack?',
      answer:
        'I specialize in TypeScript/React on the frontend, Go and Node.js on the backend, Docker/Kubernetes for containerization, and Terraform for Infrastructure as Code. I am also highly comfortable with database administration across PostgreSQL, MySQL, and Redis.',
    },
    {
      question: 'How do you handle project privacy and client security?',
      answer:
        'Security is baked into my design process from day one. I never hardcode credentials, using centralized secret architectures instead. I sign NDAs before discussing proprietary details, and all client repositories are fully isolated with strict IAM roles.',
    },
    {
      question: 'How can I request access to one of your private projects?',
      answer:
        "Click the 'Request Details / Access' button on any project card in the Projects tab. It will automatically populate the contact form with a structured request. Once validated, I can arrange repository access or share architectural documents.",
    },
  ];

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-muted/10 border border-border-color rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-border-color/30 pb-3">
        <HelpCircle className="w-4 h-4 text-cyan" />
        <h3 className="text-foreground font-mono text-sm font-bold uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
      </div>

      <div className="space-y-3">
        {faqData.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-border-color/30 rounded-lg overflow-hidden bg-muted/5 hover:bg-muted/10 transition-colors"
            >
              <button
                onClick={() => toggleItem(idx)}
                className="w-full px-4 py-3 flex items-center justify-between text-left font-mono text-xs font-semibold text-foreground hover:text-cyan focus:outline-none focus:text-cyan transition-colors cursor-pointer"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-cyan shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${idx}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border-color/10">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
