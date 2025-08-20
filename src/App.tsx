import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import './App.css';

// Configure marked to return strings synchronously
marked.setOptions({
  async: false
});

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  response?: BotResponse;
}

interface BotResponse {
  answer: string;
  related_content?: RelatedContent[];
  recommendations?: string[];
  file_links?: FileLink[];
  tables?: Table[];
}

interface RelatedContent {
  image?: string;
  title: string;
  url: string;
}

interface FileLink {
  title: string;
  url: string;
}

interface Table {
  title: string;
  headers: string[];
  rows: string[][];
}

interface QuestionCard {
  icon: string;
  title: string;
  description: string;
  category: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I am your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<'client' | 'chat'>('client');
  const [isSearching, setIsSearching] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isElementsAnimating, setIsElementsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (currentPage === 'chat') {
      const scrollToBottom = () => {
        const chatContent = document.querySelector('.chat-content');
        const chatHistory = document.querySelector('.chat-history-container');

        if (chatContent && chatHistory) {
          // Scroll the chat content container to show the latest message above the fixed search bar
          chatContent.scrollTo({
            top: chatHistory.scrollHeight,
            behavior: 'smooth'
          });
        }
      };
      // Small delay to ensure DOM is updated
      setTimeout(scrollToBottom, 150);
    }
  }, [messages, currentPage]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const questionCards: QuestionCard[] = [
    {
      icon: '👤',
      title: 'Founder/CEO',
      description: 'Who is the founder/who is the CEO?',
      category: 'About'
    },
    {
      icon: '🏢',
      title: 'Offices',
      description: 'Where are our offices?',
      category: 'Location'
    },
    {
      icon: '⚙️',
      title: 'Services',
      description: 'What services do we provide?',
      category: 'Services'
    },
    {
      icon: '🏭',
      title: 'Industries',
      description: 'What industries do we serve?',
      category: 'Industries'
    },
    {
      icon: '📊',
      title: 'Stats',
      description: 'What are some impressive stats about Hutech?',
      category: 'Statistics'
    },
    {
      icon: '🏆',
      title: 'Certifications',
      description: 'What certifications do we have?',
      category: 'Qualifications'
    },
    {
      icon: '💻',
      title: 'Tech Stack',
      description: 'What is our tech stack?',
      category: 'Technology'
    },
    {
      icon: '📞',
      title: 'Contact',
      description: 'Give me your contact details.',
      category: 'Contact'
    }
  ];

  // Mock API responses for demo purposes
  const getMockResponse = (query: string): BotResponse => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('founder') || lowerQuery.includes('ceo')) {
      return {
        answer: "**Hutech Solutions** was founded by **John Smith** who serves as our CEO. He has over 15 years of experience in technology solutions and has led the company to become a leading provider of enterprise software solutions.\n\nUnder his leadership, Hutech has grown from a small startup to a company serving over 500+ clients worldwide.",
        recommendations: [
          "What is the company's mission?",
          "Tell me about the leadership team",
          "What are our core values?"
        ]
      };
    }

    if (lowerQuery.includes('office') || lowerQuery.includes('location')) {
      return {
        answer: "🏢 **Hutech Solutions Offices:**\n\n📍 **Headquarters:** San Francisco, CA\n- 123 Tech Street, Suite 500\n- San Francisco, CA 94105\n\n📍 **Development Center:** Austin, TX\n- 456 Innovation Blvd\n- Austin, TX 78701\n\n📍 **International Office:** London, UK\n- 789 Tech Hub Lane\n- London, EC2A 4BX",
        recommendations: [
          "How can I visit your offices?",
          "Do you have remote work options?",
          "What are your office hours?"
        ]
      };
    }

    if (lowerQuery.includes('service') || lowerQuery.includes('what do')) {
      return {
        answer: "🚀 **Our Core Services:**\n\n**1. Custom Software Development**\n- Web Applications\n- Mobile Apps (iOS & Android)\n- Enterprise Solutions\n\n**2. Cloud Solutions**\n- AWS & Azure Migration\n- DevOps & CI/CD\n- Microservices Architecture\n\n**3. AI & Machine Learning**\n- Data Analytics\n- Predictive Modeling\n- Natural Language Processing\n\n**4. Consulting & Strategy**\n- Digital Transformation\n- Technology Roadmapping\n- Architecture Design",
        recommendations: [
          "What technologies do you use?",
          "Can you show me case studies?",
          "What industries do you serve?"
        ]
      };
    }

    if (lowerQuery.includes('industrie') || lowerQuery.includes('sector')) {
      return {
        answer: "🏭 **Industries We Serve:**\n\n**Healthcare & Life Sciences**\n- Electronic Health Records\n- Telemedicine Platforms\n- Medical Device Integration\n\n**Financial Services**\n- Banking Solutions\n- Fintech Applications\n- Payment Processing\n\n**E-commerce & Retail**\n- Online Marketplaces\n- Inventory Management\n- Customer Analytics\n\n**Manufacturing**\n- IoT Solutions\n- Supply Chain Management\n- Quality Control Systems",
        recommendations: [
          "Do you have healthcare expertise?",
          "What fintech solutions do you offer?",
          "Can you help with IoT projects?"
        ]
      };
    }

    if (lowerQuery.includes('stat') || lowerQuery.includes('impressive')) {
      return {
        answer: "📊 **Impressive Hutech Statistics:**\n\n🎯 **500+** Successful Projects Delivered\n👥 **200+** Expert Developers & Consultants\n🌍 **50+** Countries Served\n⭐ **98%** Client Satisfaction Rate\n🏆 **15** Industry Awards Won\n💰 **$50M+** In Client Cost Savings\n⚡ **99.9%** System Uptime Achieved\n🚀 **24/7** Global Support Coverage",
        recommendations: [
          "What awards have you won?",
          "Can you share client testimonials?",
          "What is your project success rate?"
        ]
      };
    }

    if (lowerQuery.includes('certification') || lowerQuery.includes('qualified')) {
      return {
        answer: "🏆 **Our Certifications & Qualifications:**\n\n**Industry Certifications:**\n✅ ISO 9001:2015 (Quality Management)\n✅ ISO 27001:2013 (Information Security)\n✅ CMMI Level 3 (Process Maturity)\n✅ SOC 2 Type II Compliance\n\n**Technology Partnerships:**\n🔹 Microsoft Gold Partner\n🔹 AWS Advanced Consulting Partner\n🔹 Google Cloud Partner\n🔹 Salesforce Certified Partner",
        recommendations: [
          "What is CMMI Level 3?",
          "Tell me about your security practices",
          "Do you have compliance expertise?"
        ]
      };
    }

    if (lowerQuery.includes('tech stack') || lowerQuery.includes('technology')) {
      return {
        answer: "💻 **Our Technology Stack:**\n\n**Frontend:**\n- React, Angular, Vue.js\n- TypeScript, JavaScript\n- HTML5, CSS3, Tailwind\n\n**Backend:**\n- Node.js, Python, Java\n- .NET Core, PHP\n- Microservices Architecture\n\n**Databases:**\n- PostgreSQL, MySQL\n- MongoDB, Redis\n- Elasticsearch\n\n**Cloud & DevOps:**\n- AWS, Azure, Google Cloud\n- Docker, Kubernetes\n- Jenkins, GitLab CI/CD",
        recommendations: [
          "Do you work with React?",
          "What cloud platforms do you support?",
          "Can you help with database design?"
        ]
      };
    }

    if (lowerQuery.includes('contact') || lowerQuery.includes('reach')) {
      return {
        answer: "📞 **Contact Hutech Solutions:**\n\n**General Inquiries:**\n📧 info@hutechsolutions.com\n☎️ +1 (555) 123-4567\n\n**Sales Team:**\n📧 sales@hutechsolutions.com\n☎️ +1 (555) 123-SALE\n\n**Support:**\n📧 support@hutechsolutions.com\n☎️ +1 (555) 123-HELP\n\n**Business Hours:**\n🕒 Monday - Friday: 9:00 AM - 6:00 PM PST\n🌍 24/7 Emergency Support Available",
        recommendations: [
          "How do I schedule a consultation?",
          "What are your response times?",
          "Do you offer 24/7 support?"
        ]
      };
    }

    // Default response for unmatched queries
    return {
      answer: `Thank you for your question: "${query}"\n\nI'd be happy to help you learn more about Hutech Solutions! We're a leading technology company specializing in custom software development, cloud solutions, and digital transformation services.\n\nOur team of 200+ experts has successfully delivered 500+ projects across 50+ countries, maintaining a 98% client satisfaction rate.\n\nHow can I assist you further?`,
      recommendations: [
        "Who is the founder/who is the CEO?",
        "What services do we provide?",
        "Give me your contact details.",
        "What industries do we serve?"
      ]
    };
  };

  const sendMessage = async (query?: string) => {
    const messageText = query || inputValue.trim();
    if (!messageText) return;

    // If on client page, trigger animated transition to chat
    if (currentPage === 'client') {
      setIsElementsAnimating(true);
      setIsTransitioning(true);

      // First phase: Animate out elements (800ms)
      setTimeout(() => {
        // Second phase: Switch to chat mode (400ms later)
        setCurrentPage('chat');
      }, 800);

      // Third phase: Complete transition (1200ms total)
      setTimeout(() => {
        setIsTransitioning(false);
        setIsElementsAnimating(false);
      }, 1200);
    }

    setIsSearching(true);

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API delay for realistic experience
    setTimeout(() => {
      try {
        const botResponse = getMockResponse(messageText);

        const botMessage: Message = {
          id: Date.now() + 1,
          text: botResponse.answer,
          isUser: false,
          timestamp: new Date(),
          response: botResponse
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error processing message:', error);
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      sendMessage(suggestion);
    }, 100);
  };

  const handleCardClick = (card: QuestionCard) => {
    setInputValue(card.description);
    sendMessage(card.description);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I am your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
    setShowMenu(false);
  };

  const newChat = () => {
    setInputValue('');
    setShowMenu(false);
    setIsSearching(false);
    setIsTransitioning(true);
    setIsElementsAnimating(false);
    setTimeout(() => {
      setCurrentPage('client');
      setIsTransitioning(false);
    }, 300);
    setMessages([
      {
        id: 1,
        text: "Hello! I am your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  // Shared Navigation Component
  const Navigation = () => (
    <header className="shared-header">
      <div className="header-content">
        <div className="logo-section">
          <img
            src="https://hutechsolutions.com/wp-content/uploads/2024/08/hutech-logo-1.svg"
            alt="Hutech Solutions"
            className="hutech-logo"
          />
          <img
            src="https://hutechsolutions.com/wp-content/uploads/2024/08/cmmi-level3-logo.svg"
            alt="CMMI Level 3"
            className="cmmi-logo"
          />
        </div>
        <nav className="nav-menu">
          <button className="nav-button active">Home</button>
          <button className="nav-button">Features</button>
          <button className="nav-button">Services</button>
          <button className="nav-button">About</button>
          <button className="nav-button">Contact</button>
          <button 
            className="nav-button chat-nav-button"
            onClick={() => {
              if (currentPage === 'client') {
                setIsElementsAnimating(true);
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentPage('chat');
                }, 800);
                setTimeout(() => {
                  setIsTransitioning(false);
                  setIsElementsAnimating(false);
                }, 1200);
              }
            }}
          >
            💬 Chat
          </button>
        </nav>
      </div>
    </header>
  );

  // Search Bar Component
  const SearchBar = ({ position }: { position: 'center' | 'bottom' }) => (
    <div className={`search-bar-container ${position}`}>
      <form onSubmit={handleFormSubmit} className={`search-form ${position}`}>
        <div className={`search-input-wrapper ${position}`} ref={position === 'bottom' ? menuRef : null}>
          <input
            type="text"
            placeholder="🎤 Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className={`search-input ${position} ${isLoading ? 'searching' : ''}`}
          />

          {position === 'bottom' && (
            <>
              {/* Three Dots Menu Inside Input */}
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="chat-menu-button-inside"
              >
                <div className="three-dots-vertical">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </button>

              {showMenu && (
                <div className="chat-menu-dropdown">
                  <button
                    onClick={newChat}
                    className="menu-item"
                  >
                    <div className="menu-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <span>New Chat</span>
                  </button>
                  <button
                    onClick={clearChat}
                    className="menu-item"
                  >
                    <div className="menu-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </div>
                    <span>Clear Chat</span>
                  </button>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className={`search-send-button ${position} ${isLoading ? 'searching' : ''}`}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading && position === 'bottom' ? (
              <div className="searching-animation">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 713.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  // Main app container with transition classes
  return (
    <div className={`app-container ${isTransitioning ? 'transitioning' : ''} ${isElementsAnimating ? 'elements-animating' : ''} ${currentPage === 'chat' ? 'chat-mode' : 'client-mode'}`}>
      <Navigation />
      
      {currentPage === 'client' ? (
        <div className="client-content">
          {/* Main Content */}
          <main className="client-main">
            <div className={`welcome-section ${isElementsAnimating ? 'animating-out' : ''}`}>
              <h1 className="welcome-title">
                Hello, this is an <span className="ai-text">AI assistant</span>!
              </h1>
              <p className="welcome-subtitle">
                I will help you find answers to your questions. Here are some examples:
              </p>
            </div>

            {/* Search Bar */}
            <div className={`search-bar-wrapper ${isElementsAnimating ? 'moving-down' : ''}`}>
              <SearchBar position="center" />
            </div>

            {/* Question Cards - Horizontal Scroll */}
            <div className={`question-cards-container ${isElementsAnimating ? 'animating-out' : ''}`}>
              <div className="question-cards-scroll">
                {questionCards.map((card, index) => (
                  <div
                    key={index}
                    className={`question-card-horizontal ${isElementsAnimating ? 'animating-out' : ''}`}
                    style={{
                      animationDelay: isElementsAnimating ? `${index * 100}ms` : '0ms'
                    }}
                    onClick={() => handleCardClick(card)}
                  >
                    <div className="card-icon">{card.icon}</div>
                    <div className="card-content">
                      <h3 className="card-title">{card.title}</h3>
                      <p className="card-description">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      ) : (
        // Chat Page Content
        <div className={`chat-content ${isSearching ? 'chat-searching' : ''} ${isTransitioning ? 'entering' : ''}`}>
          {/* Chat History Panel */}
          <div id="chat-history" className="chat-history-container">
            {messages.map((message) => (
              <div key={message.id}>
                {message.isUser ? (
                  <UserMessage text={message.text} />
                ) : (
                  <BotMessage message={message} onSuggestionClick={handleSuggestionClick} />
                )}
              </div>
            ))}
            
            {isLoading && <LoadingMessage />}
          </div>

          {/* Chat Input Form with Menu - Fixed at bottom */}
          <div className={`chat-input-fixed ${isTransitioning ? 'sliding-up' : ''}`}>
            <SearchBar position="bottom" />
          </div>
        </div>
      )}
    </div>
  );
}

const UserMessage: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex justify-end">
      <div className="rounded-xl rounded-br-none p-4 shadow-md chat-bubble-user prose text-sm max-w-lg">
        <div dangerouslySetInnerHTML={{ __html: marked(text) as string }} />
      </div>
    </div>
  );
};

const BotMessage: React.FC<{
  message: Message;
  onSuggestionClick: (suggestion: string) => void;
}> = ({ message, onSuggestionClick }) => {
  const response = message.response;

  return (
    <div className="flex items-start justify-center">
      <div className="max-w-3xl w-full">
        
        {/* Related Content Card Carousel */}
        {response?.related_content && response.related_content.length > 0 && (
          <RelatedContentCarousel items={response.related_content} />
        )}

        {/* Main Answer */}
        {message.text && (
          <div className="p-4 rounded-xl prose text-gray-800">
            <div dangerouslySetInnerHTML={{
              __html: marked(renderIcons(renderTables(preprocessResponse(message.text), response?.tables || []))) as string
            }} />
          </div>
        )}

        {/* File Links */}
        {response?.file_links && response.file_links.length > 0 && (
          <FileLinksSection files={response.file_links} />
        )}

        {/* Suggested Questions */}
        {response?.recommendations && response.recommendations.length > 0 && (
          <SuggestionsSection 
            suggestions={response.recommendations} 
            onSuggestionClick={onSuggestionClick} 
          />
        )}
      </div>
    </div>
  );
};

const LoadingMessage: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="rounded-xl rounded-bl-none p-4 shadow-md max-w-sm bg-white">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const RelatedContentCarousel: React.FC<{ items: RelatedContent[] }> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollPrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const scrollNext = () => {
    setCurrentIndex(Math.min(items.length - 1, currentIndex + 1));
  };

  useEffect(() => {
    const container = document.querySelector('.card-carousel-container');
    if (container) {
      const itemWidth = (container.children[0] as HTMLElement)?.offsetWidth + 16;
      container.scrollLeft = currentIndex * itemWidth;
    }
  }, [currentIndex]);

  return (
    <div className="w-full mb-6">
      <h5 className="font-semibold text-gray-800 mb-2 px-4">Related content</h5>
      <div className="card-carousel relative w-full flex items-center justify-center gap-2">
        <button 
          onClick={scrollPrev}
          className="card-carousel-prev bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300 transition-colors duration-200 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="card-carousel-container mx-auto max-w-full flex-1">
          {items.map((item, index) => (
            <div key={index} className="card-carousel-item flex-shrink-0 p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col space-y-2">
              <span className="text-xs text-gray-500 font-medium">
                {new URL(item.url).hostname.replace('www.', '')}
              </span>
              {item.image && isValidImageUrl(item.image) && (
                <div className="w-full h-20 rounded-md mb-2 relative overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse bg-gray-200 w-full h-full"></div>
                  </div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover relative z-10"
                    loading="lazy"
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      console.warn('🖼️ Image Load Error:', {
                        url: item.image,
                        title: item.title,
                        error: 'Failed to load image',
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent
                      });

                      const parentDiv = imgElement.parentElement;
                      if (parentDiv) {
                        parentDiv.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <div class="text-center">
                              <svg class="w-8 h-8 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p class="text-xs text-gray-500">Image unavailable</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                    onLoad={(e) => {
                      // Hide loading animation when image loads successfully
                      const imgElement = e.target as HTMLImageElement;
                      const loadingDiv = imgElement.parentElement?.querySelector('.animate-pulse');
                      if (loadingDiv) {
                        (loadingDiv as HTMLElement).style.display = 'none';
                      }
                    }}
                  />
                </div>
              )}
              <h5 className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</h5>
              {item.url && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 hover:underline text-xs flex items-center">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-6-6l6 6m0 0V8m0 4h-4" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
        <button 
          onClick={scrollNext}
          className="card-carousel-next bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300 transition-colors duration-200 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const FileLinksSection: React.FC<{ files: FileLink[] }> = ({ files }) => {
  return (
    <div className="mt-6">
      <h5 className="font-semibold text-gray-800 mb-2 px-4">Files</h5>
      {files.map((file, index) => (
        <a 
          key={index}
          href={file.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 my-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">{file.title}</span>
        </a>
      ))}
    </div>
  );
};

const SuggestionsSection: React.FC<{ 
  suggestions: string[]; 
  onSuggestionClick: (suggestion: string) => void;
}> = ({ suggestions, onSuggestionClick }) => {
  return (
    <div className="mt-6">
      <h5 className="font-semibold text-gray-800 mb-2 px-4">Suggested Questions</h5>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="suggestion-button block w-full text-left p-4 my-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 shadow-sm hover:bg-gray-100">
          {suggestion}
        </button>
      ))}
    </div>
  );
};

// Utility functions
const isValidImageUrl = (url: string): boolean => {
  if (!url || url === "No image found." || url.trim() === "") return false;

  try {
    const urlObj = new URL(url);
    // Check if it's a valid HTTP/HTTPS URL
    if (!['http:', 'https:'].includes(urlObj.protocol)) return false;

    // Check if it has a valid image extension or is from a known image service
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const hasValidExtension = imageExtensions.some(ext =>
      urlObj.pathname.toLowerCase().includes(ext)
    );

    // Allow known image hosting services even without explicit extensions
    const knownImageHosts = ['imgur.com', 'cloudinary.com', 'unsplash.com', 'pexels.com'];
    const isKnownImageHost = knownImageHosts.some(host =>
      urlObj.hostname.toLowerCase().includes(host)
    );

    return hasValidExtension || isKnownImageHost;
  } catch {
    return false;
  }
};

const renderTables = (answer: string, tables: Table[]): string => {
  if (!tables || tables.length === 0) {
    return answer;
  }

  let processedAnswer = answer;
  tables.forEach(table => {
    const placeholder = `[TABLE:${table.title}]`;
    if (processedAnswer.includes(placeholder)) {
      let tableHtml = `<div class="overflow-x-auto my-4">`;
      tableHtml += `<table class="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">`;
      tableHtml += `<caption class="p-2 text-sm text-gray-500 font-medium text-left">${table.title}</caption>`;

      if (table.headers && table.headers.length > 0) {
        tableHtml += `<thead class="bg-gray-100">`;
        tableHtml += `<tr>${table.headers.map(h => `<th class="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">${h}</th>`).join('')}</tr>`;
        tableHtml += `</thead>`;
      }

      tableHtml += `<tbody class="divide-y divide-gray-200">`;
      table.rows.forEach(row => {
        tableHtml += `<tr class="bg-white">`;
        tableHtml += row.map(cell => `<td class="p-3 text-sm text-gray-800">${cell}</td>`).join('');
        tableHtml += `</tr>`;
      });
      tableHtml += `</tbody>`;
      tableHtml += `</table></div>`;

      processedAnswer = processedAnswer.replace(placeholder, tableHtml);
    }
  });

  return processedAnswer;
};

const getIconSVG = (iconName: string): string => {
  const icons: { [key: string]: string } = {
    location: `<svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 6.5c1.5-2 4-3 6.5-2l2 2a1 1 0 010 1.4L9 10a12 12 0 005 5l2.1-1.5a1 1 0 011.4 0l2 2c1 2.5 0 5-2 6.5-.6.4-1.4.5-2.1.2C10.2 20.5 3.5 13.8 1.8 6.6c-.3-.7-.2-1.5.2-2.1z"/></svg>`,
    mobile: `<svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 1h-7a.5.5 0 00-.5.5v21a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V1.5a.5.5 0 00-.5-.5zM12 22a1 1 0 110-2 1 1 0 010 2z"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7l9 6 9-6" /></svg>`
  };
  return icons[iconName] || '';
};

const renderIcons = (text: string): string => {
  return text.replace(/\[ICON:(.*?)]/g, (match, iconName) => {
    return `<span class="inline-block align-middle">${getIconSVG(iconName.trim())}</span>`;
  });
};

const preprocessResponse = (text: string): string => {
  let processedText = text.replace(/&nbsp;|\u00A0|\t/g, ' ');
  processedText = processedText.replace(/([^\n])---/g, '$1\n\n---\n\n');
  processedText = processedText.replace(/^(\s*)\*\s+/gm, '$1* ');
  processedText = processedText.replace(/^(#+)(?! )/gm, '$1 ');
  processedText = processedText.replace(/^(\s*>)(?! )/gm, '$1 ');
  return processedText.trim();
};

export default App;
