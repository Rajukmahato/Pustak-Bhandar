import React, { useState } from 'react';

import '../styles/FAQsPage.css';

const FAQsPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'What is PustakBhandar?',
      answer: 'PustakBhandar is an online platform that provides information about various books. However, we do not sell books on this website.'
    },
    {
      question: 'Do I need an account to browse books?',
      answer: 'No, you can explore books without signing in. However, signing in allows you to save preferences.'
    },
    {
      question: 'Can I buy books from this website?',
      answer: 'No, PustakBhandar only provides information about books. You cannot purchase books here.'
    },
    {
      question: 'How do I search for a specific book?',
      answer: 'Use the search bar at the top of the page to find books by title, author, or category.'
    },
    {
      question: 'Can I update or delete my profile?',
      answer: 'Yes, after signing in, go to your Profile page to update or delete your account.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
     
      <div className="faqs-container">
        <section className="FAQs-hero">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to the most commonly asked questions about PustakBhandar. If you don’t see your question here, feel free to contact us!</p>
        </section>
        <div className="faqs-list">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <h3 className={`faq-question ${activeIndex === index ? 'active' : ''}`} onClick={() => toggleFAQ(index)}>
                {faq.question}
              </h3>
              <p className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
};

export default FAQsPage;