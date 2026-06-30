/* ============================================
   SMART LENDING ACADEMY - Application Logic
   ============================================ */

const App = {
  state: {
    currentPage: 'dashboard',
    darkMode: false,
    sidebarOpen: false,
    timerSeconds: 0,
    timerInterval: null,
    bookmarks: [],
    modules: {
      1: { status: 'not_started', progress: 0, quizScore: 0, quizCompleted: false },
      2: { status: 'locked', progress: 0, quizScore: 0, quizCompleted: false },
      3: { status: 'locked', progress: 0, quizScore: 0, quizCompleted: false },
      4: { status: 'locked', progress: 0, quizScore: 0, quizCompleted: false },
    },
    assessment: { completed: false, score: 0, passed: false },
    certificate: { generated: false, name: '', date: '', id: '' },
    scorecard: {
      stability: 0, need: 0, repay: 0, discipline: 0,
      character: 0, documentation: 0, guarantor: 0
    }
  },

  /* ============================================
     QUIZ DATA
     ============================================ */
  quizzes: {
    m1: {
      questions: [
        {
          question: 'When is your job truly complete as a Loan Sales Officer?',
          options: ['When the loan is disbursed', 'When the merchant signs the agreement', 'When the loan is fully repaid', 'When you hit your monthly target'],
          correct: 2,
          feedback: 'Your job is complete only when the loan is fully repaid. Disbursement is just the beginning.'
        },
        {
          question: 'True or False: A loan that ends in default can still be considered a successful sale.',
          options: ['True', 'False'],
          correct: 1,
          feedback: 'False. A defaulted loan is not a success - it becomes a liability for the business and damages the merchant\'s credit.'
        },
        {
          question: 'What does a portfolio with 70% defaults indicate?',
          options: ['Bad economy', 'Poor merchant selection', 'Aggressive collection needed', 'Normal business cycle'],
          correct: 1,
          feedback: 'A 70% default rate indicates poor merchant selection and inadequate assessment of merchant viability.'
        },
        {
          question: 'Which contributes more to the business?',
          options: ['₦100M disbursed with 10% repayment', '₦10M disbursed with 90% repayment', 'Both equally', 'Neither'],
          correct: 1,
          feedback: '₦10M with 90% repayment (₦9M recovered) demonstrates better judgement and nearly matches ₦100M with 10% repayment (₦10M recovered), with far less risk.'
        },
        {
          question: 'Complete the Golden Rule: "Never recommend a merchant simply because they qualify for a loan. Recommend them because..."',
          options: ['They asked for it', 'You need to meet your target', 'You are confident they can repay it', 'Their business looks good'],
          correct: 2,
          feedback: 'The Golden Rule: Recommend merchants because you are confident they can repay, not just because they qualify.'
        }
      ]
    },
    m2: {
      questions: [
        {
          question: 'What is the real cause of overdue loans according to Smart Lending?',
          options: ['Poor economy', 'Collections failure', 'Problems during merchant selection', 'Merchants refusing to pay'],
          correct: 2,
          feedback: 'The real problem begins during merchant selection. Other factors are symptoms, not root causes.'
        },
        {
          question: 'In the farming illustration, what does a "Healthy Seed" represent?',
          options: ['Good economy', 'Quality merchant', 'Large loan amount', 'Good collections team'],
          correct: 1,
          feedback: 'A Healthy Seed represents a Quality Merchant - one with stability, ability to repay, financial discipline, and engagement.'
        },
        {
          question: 'Who makes the first underwriting decision in the lending pipeline?',
          options: ['FVO', 'Underwriter', 'Collections', 'Loan Sales BD'],
          correct: 3,
          feedback: 'The Loan Sales BD makes the first underwriting decision. You are the First Underwriter.'
        },
        {
          question: 'True or False: "Business slowed down" is the root cause of overdue loans.',
          options: ['True', 'False'],
          correct: 1,
          feedback: 'False. Business slowdown is a symptom. The root cause is usually poor merchant selection - recommending merchants who were never equipped to repay.'
        },
        {
          question: 'What does a "Poor Harvest" in the farming illustration correspond to in lending?',
          options: ['High disbursement', 'Default / Overdue', 'Full repayment', 'New application'],
          correct: 1,
          feedback: 'Poor Harvest = Default / Overdue. When you select weak merchants (poor seed) in unstable businesses (poor soil), defaults are the natural result.'
        },
        {
          question: 'What is the role of the Loan Sales BD in the pipeline?',
          options: ['Only sales', 'First underwriter', 'Final approver', 'Collections only'],
          correct: 1,
          feedback: 'The Loan Sales BD is the First Underwriter. Your assessment determines whether a quality merchant enters the pipeline.'
        },
        {
          question: 'Which is NOT a symptom of overdue loans?',
          options: ['Merchant refused to pay', 'Poor merchant selection', 'Economy is bad', 'Collections failed'],
          correct: 1,
          feedback: 'Poor merchant selection is the root cause, not a symptom. The other options are symptoms that stem from poor selection.'
        },
        {
          question: 'The lending pipeline order is:',
          options: ['Collections → FVO → Underwriter → BD', 'BD → Underwriter → FVO → Collections', 'BD → FVO → Underwriter → Collections', 'FVO → BD → Underwriter → Collections'],
          correct: 2,
          feedback: 'The pipeline is: Loan Sales BD → FVO → Underwriter → Collections. The BD is the first step.'
        }
      ]
    },
    m3: {
      questions: [
        {
          question: 'What does the "S" in SAFE Framework stand for?',
          options: ['Sales', 'Stability', 'Security', 'Strategy'],
          correct: 1,
          feedback: 'S = Stability. Assess how long the business has been operating and the consistency of revenue.'
        },
        {
          question: 'What does the "A" in SAFE Framework stand for?',
          options: ['Ability to Repay', 'Approval', 'Assessment', 'Action'],
          correct: 0,
          feedback: 'A = Ability to Repay. Can the business generate enough cash flow to meet repayment obligations?'
        },
        {
          question: 'What minimum Debt Service Coverage Ratio (DSCR) is recommended?',
          options: ['1.0x', '1.5x', '2.0x', '3.0x'],
          correct: 1,
          feedback: 'A DSCR of at least 1.5x is recommended to ensure the merchant can comfortably meet repayment obligations.'
        },
        {
          question: 'True or False: Financial Discipline only refers to whether the merchant has a bank account.',
          options: ['True', 'False'],
          correct: 1,
          feedback: 'False. Financial Discipline includes record-keeping, separation of business/personal funds, savings habits, and past credit behavior.'
        },
        {
          question: 'What should you observe when assessing Financial Discipline?',
          options: ['Shop location only', 'Quality of financial records and savings patterns', 'Number of employees', 'Business registration only'],
          correct: 1,
          feedback: 'Observe the quality of financial records, separation of accounts, savings patterns, past repayment history, and inventory management.'
        },
        {
          question: 'What is the minimum recommended years in operation for a merchant?',
          options: ['3-6 months', '6-12 months', '1-2 years', '5+ years'],
          correct: 2,
          feedback: 'A minimum of 1-2 years in operation is preferred as it demonstrates business stability.'
        },
        {
          question: 'What is a sign of good Engagement from a merchant?',
          options: ['Slow response to calls', 'Reluctance to share documents', 'Willingness to provide information', 'Avoiding questions about challenges'],
          correct: 2,
          feedback: 'Good engagement is shown through responsiveness, transparency, willingness to provide documentation, and open communication.'
        },
        {
          question: 'A merchant with a score of 60 on the Quality Scorecard should be:',
          options: ['Recommended', 'Further review required', 'Not recommended', 'Auto-approved'],
          correct: 1,
          feedback: 'A score of 50-69 means "Further Review Required" (Yellow). Additional assessment is needed before proceeding.'
        },
        {
          question: 'What score qualifies a merchant for "Recommend for FVO"?',
          options: ['Below 50', '50-69', '70+', '90+'],
          correct: 2,
          feedback: 'A score of 70+ (Green) qualifies the merchant for recommendation to FVO.'
        },
        {
          question: 'Which is NOT part of the SAFE Framework?',
          options: ['Stability', 'Ability to Repay', 'Financial Discipline', 'Sales Performance'],
          correct: 3,
          feedback: 'SAFE stands for Stability, Ability to Repay, Financial Discipline, and Engagement. Sales Performance is not part of the framework.'
        }
      ]
    },
    m4: {
      questions: [
        {
          question: 'When does the Loan Sales BD\'s work truly end?',
          options: ['After disbursement', 'When the loan is fully repaid', 'After the first check-in', 'When the merchant signs'],
          correct: 1,
          feedback: 'The work ends only when the loan is fully repaid. Disbursement is just the beginning of the 90-Day Merchant Success Journey.'
        },
        {
          question: 'What should you do 1-2 weeks after disbursement?',
          options: ['Nothing, wait for due date', 'Send final reminder', 'Review stock levels and revenue trends', 'Escalate to collections'],
          correct: 2,
          feedback: 'At 1-2 weeks, conduct a Business Activity Check - review stock levels, customer traffic, and revenue trends to ensure the loan is having the intended effect.'
        },
        {
          question: 'What color merchant requires the most immediate attention?',
          options: ['Green', 'Yellow', 'Red', 'Blue'],
          correct: 2,
          feedback: 'Red merchants require immediate escalation to collections as they represent the highest risk of default.'
        },
        {
          question: 'What defines a Green Merchant?',
          options: ['Always late on payments', 'Pays on time and communicates proactively', 'Business is struggling', 'Unreachable'],
          correct: 1,
          feedback: 'Green Merchants pay on time, communicate proactively, and have thriving businesses with low risk.'
        },
        {
          question: 'When should you first remind the merchant about repayment?',
          options: ['On the due date', '1 day before', '2 weeks before due date', 'After the due date'],
          correct: 2,
          feedback: 'Begin pre-repayment preparation 2 weeks before the due date. Give the merchant time to prepare.'
        },
        {
          question: 'What action is required for a Yellow (Amber) Merchant?',
          options: ['No action needed', 'Increase monitoring and understand challenges', 'Immediate escalation', 'Close the account'],
          correct: 1,
          feedback: 'For Yellow Merchants, increase monitoring frequency, understand their challenges, and create an intervention plan.'
        },
        {
          question: 'At what point should you escalate to collections?',
          options: ['1 day after due', '3 days after due and no resolution', '30 days after due', 'Never'],
          correct: 1,
          feedback: 'If by 3 days after the due date there is no resolution, begin the escalation process. By 7-14 days, full handover to collections is needed.'
        },
        {
          question: 'What is the first thing to do on Disbursement Day?',
          options: ['Ask for repayment', 'Confirm fund receipt and review terms', 'Visit the shop', 'Call the guarantor'],
          correct: 1,
          feedback: 'On Disbursement Day, confirm the merchant received the funds and review the repayment schedule and terms to ensure clear understanding.'
        }
      ]
    }
  },

  /* ============================================
     ASSESSMENT DATA
     ============================================ */
  assessmentQuestions: [
    {
      question: 'You have identified a merchant who has been in business for 6 months, generates ₦500,000 monthly revenue, and has no existing debt. What is your recommendation?',
      options: ['Strongly recommend', 'Recommend with caution - review stability', 'Do not recommend', 'Auto-approve'],
      correct: 1,
      feedback: 'With only 6 months in business, stability is a concern. The merchant needs more time to demonstrate consistent operations.'
    },
    {
      question: 'A merchant has a DSCR of 1.2x. What does this indicate?',
      options: ['Strong repayment capacity', 'Adequate capacity', 'Barely sufficient - monitor closely', 'Insufficient capacity'],
      correct: 2,
      feedback: 'A DSCR of 1.2x is below the recommended 1.5x threshold. The merchant has limited cushion if revenue drops.'
    },
    {
      question: 'What does the SAFE Framework primarily help you assess?',
      options: ['Loan amount', 'Interest rate', 'Merchant quality and repayment likelihood', 'Collection strategy'],
      correct: 2,
      feedback: 'The SAFE Framework (Stability, Ability to Repay, Financial Discipline, Engagement) helps assess merchant quality and likelihood of repayment.'
    },
    {
      question: 'A merchant scored 45 on the Quality Scorecard. What is the recommendation?',
      options: ['Recommend for FVO', 'Further review required', 'Do not recommend', 'Auto-approve'],
      correct: 2,
      feedback: 'A score below 50 is "Do Not Recommend" (Red category). The merchant presents too high a risk.'
    },
    {
      question: 'True or False: The Loan Sales BD\'s responsibility ends once the underwriter approves the loan.',
      options: ['True', 'False'],
      correct: 1,
      feedback: 'False. The BD is responsible throughout the merchant\'s journey, including post-disbursement monitoring and support.'
    },
    {
      question: 'Which merchant behavior requires escalation to Red status?',
      options: ['Late payment with communication', 'Consistent delinquency and unreachable', 'Occasional late payment', 'Paying in installments'],
      correct: 1,
      feedback: 'Consistent delinquency combined with being unreachable are clear indicators of a Red merchant requiring immediate escalation.'
    },
    {
      question: 'A merchant keeps detailed records, separates business/personal accounts, and has a clean repayment history. Which SAFE element does this demonstrate?',
      options: ['Stability', 'Ability to Repay', 'Financial Discipline', 'Engagement'],
      correct: 2,
      feedback: 'Detailed records, separate accounts, and clean repayment history are indicators of strong Financial Discipline.'
    },
    {
      question: 'What is the first step you should take 3 days after a missed payment?',
      options: ['Write off the loan', 'Escalate immediately to legal', 'Contact the merchant to understand why', 'Visit other merchants'],
      correct: 2,
      feedback: 'At 3 days past due, immediately contact the merchant to understand the reason and create a repayment plan.'
    },
    {
      question: 'A merchant with seasonal revenue, 3 years in business, and a strong savings history. Which SAFE element needs the most attention?',
      options: ['Stability', 'Ability to Repay (due to seasonality)', 'Financial Discipline', 'Engagement'],
      correct: 1,
      feedback: 'Seasonal revenue affects Ability to Repay. You need to ensure repayment is scheduled during high-revenue periods.'
    },
    {
      question: 'Which contributes more to long-term business success?',
      options: ['High disbursement volume with low repayment', 'Moderate disbursement with high repayment', 'Many small loans', 'Few large loans'],
      correct: 1,
      feedback: 'Moderate disbursement with high repayment rates builds a healthier portfolio and demonstrates better merchant selection.'
    },
    {
      question: 'What is the most important question to ask when assessing a merchant\'s Ability to Repay?',
      options: ['What is your favorite product?', 'What is your average daily revenue and what are your expenses?', 'How many employees do you have?', 'Do you like your business?'],
      correct: 1,
      feedback: 'Understanding revenue and expenses is critical to assessing whether the merchant can generate enough cash flow for repayment.'
    },
    {
      question: 'True or False: A merchant who is responsive during the application process will always remain responsive after disbursement.',
      options: ['True', 'False'],
      correct: 1,
      feedback: 'False. Engagement during application does not guarantee continued responsiveness. The BD must actively maintain the relationship.'
    },
    {
      question: 'What is the minimum passing score for the Final Assessment?',
      options: ['60%', '70%', '80%', '90%'],
      correct: 2,
      feedback: 'The passing score is 80% (12 out of 15 questions correct).'
    },
    {
      question: 'A portfolio with consistent defaults likely indicates what?',
      options: ['Bad luck', 'Economic downturn', 'Systematic issues in merchant selection', 'Poor collection strategy'],
      correct: 2,
      feedback: 'Consistent defaults usually indicate systematic issues in merchant selection. The BD is not properly applying the SAFE Framework.'
    },
    {
      question: 'The Golden Rule states: "Never recommend a merchant simply because they qualify for a loan. Recommend them because..."',
      options: ['They have collateral', 'You need the commission', 'You are confident they can repay', 'Their business looks modern'],
      correct: 2,
      feedback: 'The Golden Rule emphasizes confidence in repayment ability as the primary criterion for recommendation.'
    }
  ],

  /* ============================================
     GLOSSARY DATA
     ============================================ */
  glossary: [
    { term: 'Portfolio', def: 'A collection of loans disbursed by a Loan Sales Officer. The health of this portfolio reflects the quality of merchant selection and relationship management.' },
    { term: 'Disbursement', def: 'The release of loan funds to the merchant. This is the beginning, not the end, of the lending process.' },
    { term: 'Default', def: 'Failure to repay a loan according to the agreed terms. A default negatively impacts both the merchant and the lender.' },
    { term: 'Overdue', def: 'A loan payment that has not been made by the due date. Early intervention is critical to prevent overdue from becoming default.' },
    { term: 'SAFE Framework', def: 'A merchant evaluation framework: Stability, Ability to Repay, Financial Discipline, and Engagement. Used to assess merchant quality.' },
    { term: 'DSCR (Debt Service Coverage Ratio)', def: 'A measure of a merchant\'s ability to service existing debt. Calculated as Net Income / Total Debt Service. Minimum recommended: 1.5x.' },
    { term: 'FVO (Field Verification Officer)', def: 'The officer who physically verifies the merchant\'s business, location, and operations as part of the lending pipeline.' },
    { term: 'Underwriter', def: 'The officer responsible for final loan approval after assessing all documentation and verification reports.' },
    { term: 'Merchant Quality Scorecard', def: 'A scoring tool that evaluates merchants across 7 categories to determine their suitability for a loan recommendation.' },
    { term: 'Portfolio Health', def: 'A measure of the overall quality and performance of a loan portfolio, including repayment rates, overdue levels, and default rates.' },
    { term: 'Traffic Light System', def: 'A risk classification system: Green (Low Risk), Yellow/Amber (Medium Risk), Red (High Risk) for monitoring merchant behavior post-disbursement.' },
    { term: '90-Day Journey', def: 'The critical period from loan disbursement to full repayment where the BD actively supports the merchant.' },
    { term: 'Golden Rule', def: '"Never recommend a merchant simply because they qualify for a loan. Recommend them because you are confident they can repay it."' },
    { term: 'First Underwriter', def: 'The Loan Sales BD, who makes the first and most critical underwriting decision during merchant selection.' },
    { term: 'Collections', def: 'The team responsible for recovering overdue payments. Collections success begins with quality merchant selection at origination.' }
  ],

  /* ============================================
     INITIALIZATION
     ============================================ */
  init() {
    this.loadState();
    this.renderNavigation();
    this.setupEventListeners();
    this.setupScorecard();
    this.renderGlossary();
    this.startTimer();
    this.updateDashboard();
    this.checkBookmarks();
  },

  /* ============================================
     LOCAL STORAGE
     ============================================ */
  saveState() {
    try {
      const data = {
        darkMode: this.state.darkMode,
        timerSeconds: this.state.timerSeconds,
        modules: this.state.modules,
        assessment: this.state.assessment,
        certificate: this.state.certificate,
        scorecard: this.state.scorecard,
        bookmarks: this.state.bookmarks
      };
      localStorage.setItem('sla_state', JSON.stringify(data));
    } catch (e) {}
  },

  loadState() {
    try {
      const saved = localStorage.getItem('sla_state');
      if (saved) {
        const data = JSON.parse(saved);
        this.state.darkMode = data.darkMode || false;
        this.state.timerSeconds = data.timerSeconds || 0;
        this.state.assessment = data.assessment || { completed: false, score: 0, passed: false };
        this.state.certificate = data.certificate || { generated: false, name: '', date: '', id: '' };
        this.state.scorecard = data.scorecard || { stability: 0, need: 0, repay: 0, discipline: 0, character: 0, documentation: 0, guarantor: 0 };
        this.state.bookmarks = data.bookmarks || [];
        if (data.modules) {
          this.state.modules = data.modules;
        }
      }
    } catch (e) {}

    const certName = localStorage.getItem('sla_cert_name');
    if (certName && !this.state.certificate.name) {
      this.state.certificate.name = certName;
      this.state.certificate.generated = true;
      this.state.certificate.date = localStorage.getItem('sla_cert_date') || new Date().toLocaleDateString();
      this.state.certificate.id = localStorage.getItem('sla_cert_id') || '';
    }

    if (this.state.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    this.updateSidebarProgress();
    this.updateModuleBadges();
  },

  /* ============================================
     NAVIGATION
     ============================================ */
  renderNavigation() {
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const page = el.dataset.page;
        this.navigateTo(page);
      });
    });

    document.querySelectorAll('.start-module-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mod = btn.dataset.module;
        this.navigateTo(`module${mod}`);
      });
    });

    document.querySelectorAll('.quick-access-card').forEach(card => {
      card.addEventListener('click', () => {
        const page = card.dataset.page;
        this.navigateTo(page);
      });
    });
  },

  navigateTo(page) {
    const state = this.state;
    if (page.startsWith('module')) {
      const modNum = parseInt(page.replace('module', ''));
      if (modNum > 1) {
        const prevMod = state.modules[modNum - 1];
        if (prevMod.status !== 'completed') {
          this.showToast(`Complete Module ${modNum - 1} first`, 'error');
          return;
        }
      }
    }

    if (page === 'assessment') {
      const allComplete = [1, 2, 3, 4].every(m => state.modules[m].status === 'completed');
      const modsDone = [1, 2, 3, 4].filter(m => state.modules[m].status === 'completed').length;
      if (modsDone < 4) {
        this.showToast(`Complete all 4 modules before the assessment (${modsDone}/4 done)`, 'error');
        return;
      }
    }

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const targetPage = document.getElementById(`page-${page}`);
    const targetNav = document.querySelector(`[data-page="${page}"]`);
    if (targetPage) targetPage.classList.add('active');
    if (targetNav) targetNav.classList.add('active');

    state.currentPage = page;

    if (page === 'module1') this.showModuleContent(1);
    if (page === 'module2') this.showModuleContent(2);
    if (page === 'module3') this.showModuleContent(3);
    if (page === 'module4') this.showModuleContent(4);

    this.closeSidebar();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /* ============================================
     MODULE CONTENT
     ============================================ */
  showModuleContent(moduleNum) {
    const sections = {
      1: [
        { id: 'm1-intro', check: () => true },
        { id: 'm1-discussion', check: () => document.getElementById('mindset-reveal')?.style.display !== 'none' },
        { id: 'm1-comparison', check: () => document.getElementById('m1-discussion')?.style.display !== 'none' },
        { id: 'm1-golden', check: () => document.getElementById('m1-comparison')?.style.display !== 'none' },
        { id: 'm1-knowledge', check: () => this.state.modules[1].quizCompleted }
      ],
      2: [
        { id: null, check: () => true },
        { id: 'm2-farming', check: () => document.getElementById('overdue-reveal')?.style.display !== 'none' },
        { id: 'm2-pipeline', check: () => document.getElementById('m2-farming')?.style.display !== 'none' },
        { id: 'm2-knowledge', check: () => this.state.modules[2].quizCompleted }
      ],
      3: [
        { id: null, check: () => true },
        { id: 'm3-scorecard', check: () => true },
        { id: 'm3-knowledge', check: () => this.state.modules[3].quizCompleted }
      ],
      4: [
        { id: null, check: () => true },
        { id: 'm4-timeline', check: () => document.getElementById('mindset-reveal-m4')?.style.display !== 'none' },
        { id: 'm4-traffic', check: () => document.getElementById('m4-timeline')?.style.display !== 'none' },
        { id: 'm4-knowledge', check: () => this.state.modules[4].quizCompleted }
      ]
    };

    const moduleSections = sections[moduleNum] || [];
    moduleSections.forEach(s => {
      if (s.id) {
        const el = document.getElementById(s.id);
        if (el) el.style.display = s.check() ? 'block' : 'none';
      }
    });
  },

  /* ============================================
     SIDEBAR
     ============================================ */
  setupSidebar() {
    document.getElementById('sidebar-toggle').addEventListener('click', () => this.toggleSidebar());
    document.getElementById('sidebar-close').addEventListener('click', () => this.closeSidebar());
    document.getElementById('sidebar-overlay').addEventListener('click', () => this.closeSidebar());
  },

  toggleSidebar() {
    this.state.sidebarOpen = !this.state.sidebarOpen;
    document.getElementById('sidebar').classList.toggle('active', this.state.sidebarOpen);
    document.getElementById('sidebar-overlay').classList.toggle('active', this.state.sidebarOpen);
  },

  closeSidebar() {
    this.state.sidebarOpen = false;
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('sidebar-overlay').classList.remove('active');
  },

  /* ============================================
     EVENT LISTENERS
     ============================================ */
  setupEventListeners() {
    this.setupSidebar();
    this.setupDarkMode();
    this.setupSearch();
    this.setupBookmark();
    this.setupModule1();
    this.setupModule2();
    this.setupModule4Listeners();
    this.setupAssessment();
    this.setupCertificate();
    this.setupContinueLearning();

    document.getElementById('start-over-btn')?.addEventListener('click', () => this.startOver());
    document.getElementById('retake-assessment-btn')?.addEventListener('click', () => this.retakeAssessment());
    document.getElementById('view-certificate-btn')?.addEventListener('click', () => this.navigateTo('certificate'));

    // Search toggle on mobile
    document.getElementById('search-toggle')?.addEventListener('click', () => {
      const search = document.getElementById('header-search');
      search.classList.toggle('mobile-show');
      if (search.classList.contains('mobile-show')) {
        document.getElementById('search-input').focus();
      }
    });
  },

  /* ============================================
     DARK MODE
     ============================================ */
  setupDarkMode() {
    const btn = document.getElementById('dark-mode-toggle');
    btn.addEventListener('click', () => {
      this.state.darkMode = !this.state.darkMode;
      document.documentElement.setAttribute('data-theme', this.state.darkMode ? 'dark' : 'light');
      this.saveState();
    });
  },

  /* ============================================
     SEARCH
     ============================================ */
  setupSearch() {
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      if (query.length < 2) {
        results.classList.remove('active');
        return;
      }

      const pages = [
        { title: 'Module 1: The Big Mindset Shift', page: 'module1', keywords: 'mindset shift loan sales portfolio builder golden rule' },
        { title: 'Module 2: Real Cause of Overdue Loans', page: 'module2', keywords: 'overdue loans cause farming pipeline first underwriter' },
        { title: 'Module 3: Identifying Quality Merchants', page: 'module3', keywords: 'SAFE framework scorecard stability ability repay financial discipline engagement' },
        { title: 'Module 4: After Disbursement', page: 'module4', keywords: 'disbursement 90-day journey timeline traffic light merchant success' },
        { title: 'Final Assessment', page: 'assessment', keywords: 'assessment exam test certification pass' },
        { title: 'Certificate', page: 'certificate', keywords: 'certificate achievement completion' },
        { title: 'Glossary', page: 'glossary', keywords: 'glossary terms definitions reference' },
      ];

      const glossaryItems = this.glossary.filter(g =>
        g.term.toLowerCase().includes(query) || g.def.toLowerCase().includes(query)
      ).slice(0, 3);

      const matched = pages.filter(p =>
        p.title.toLowerCase().includes(query) || p.keywords.includes(query)
      );

      results.innerHTML = '';

      matched.forEach(m => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `<div class="sr-title">${m.title}</div><div class="sr-path">Go to page</div>`;
        div.addEventListener('click', () => {
          this.navigateTo(m.page);
          results.classList.remove('active');
          input.value = '';
        });
        results.appendChild(div);
      });

      glossaryItems.forEach(g => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `<div class="sr-title">📖 ${g.term}</div><div class="sr-path">${g.def.substring(0, 80)}...</div>`;
        div.addEventListener('click', () => {
          this.navigateTo('glossary');
          results.classList.remove('active');
          input.value = '';
          setTimeout(() => {
            const termEl = document.querySelector(`[data-term="${g.term}"]`);
            if (termEl) termEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        });
        results.appendChild(div);
      });

      if (matched.length === 0 && glossaryItems.length === 0) {
        results.innerHTML = '<div class="search-result-item" style="color: var(--text-tertiary)">No results found</div>';
      }

      results.classList.add('active');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header-search')) {
        results.classList.remove('active');
      }
    });
  },

  /* ============================================
     BOOKMARKS
     ============================================ */
  setupBookmark() {
    document.getElementById('header-bookmark').addEventListener('click', () => {
      const page = this.state.currentPage;
      const pageNames = {
        dashboard: 'Dashboard',
        module1: 'Module 1: The Big Mindset Shift',
        module2: 'Module 2: Real Cause of Overdue Loans',
        module3: 'Module 3: Identifying Quality Merchants',
        module4: 'Module 4: After Disbursement',
        assessment: 'Final Assessment',
        certificate: 'Certificate',
        glossary: 'Glossary',
        bookmarks: 'Bookmarks'
      };

      const name = pageNames[page] || page;
      if (page === 'bookmarks') return;
      if (page === 'dashboard') { this.showToast('Cannot bookmark dashboard', 'error'); return; }

      const existing = this.state.bookmarks.findIndex(b => b.page === page);
      if (existing >= 0) {
        this.state.bookmarks.splice(existing, 1);
        this.showToast('Bookmark removed', 'info');
      } else {
        this.state.bookmarks.push({ page, name, date: new Date().toLocaleDateString() });
        this.showToast('Page bookmarked!', 'success');
      }

      this.saveState();
      this.checkBookmarks();
    });
  },

  checkBookmarks() {
    const container = document.getElementById('bookmarks-container');
    const badge = document.getElementById('badge-bookmarks');
    if (badge) badge.textContent = this.state.bookmarks.length;

    if (!container) return;
    if (this.state.bookmarks.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🔖</span>
          <h3>No bookmarks yet</h3>
          <p>Click the bookmark icon on any page to save it here</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.state.bookmarks.map((b, i) => `
      <div class="bookmark-item" data-index="${i}">
        <div>
          <div class="bookmark-title">${b.name}</div>
          <div style="font-size: 11px; color: var(--text-tertiary)">Saved ${b.date}</div>
        </div>
        <button class="bookmark-remove" data-index="${i}">Remove</button>
      </div>
    `).join('');

    container.querySelectorAll('.bookmark-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.classList.contains('bookmark-remove')) {
          const idx = parseInt(e.target.dataset.index);
          this.state.bookmarks.splice(idx, 1);
          this.saveState();
          this.checkBookmarks();
          this.showToast('Bookmark removed', 'info');
          return;
        }
        const idx = parseInt(el.dataset.index);
        const b = this.state.bookmarks[idx];
        if (b) this.navigateTo(b.page);
      });
    });
  },

  /* ============================================
     MODULE 1 - MINDSET SHIFT
     ============================================ */
  setupModule1() {
    document.querySelectorAll('.mindset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const reveal = document.getElementById('mindset-reveal');
        reveal.style.display = 'block';
        reveal.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          document.getElementById('m1-discussion').style.display = 'block';
          document.getElementById('m1-discussion').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 800);

        setTimeout(() => {
          document.getElementById('m1-comparison').style.display = 'block';
        }, 1500);

        setTimeout(() => {
          document.getElementById('m1-golden').style.display = 'block';
          document.getElementById('m1-golden').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 2200);

        if (this.state.modules[1].status === 'not_started') {
          this.state.modules[1].status = 'in_progress';
          this.state.modules[1].progress = 10;
          this.updateDashboard();
          this.updateSidebarProgress();
          this.saveState();
        }
      });
    });
  },

  /* ============================================
     MODULE 2 - OVERDUE LOANS
     ============================================ */
  setupModule2() {
    document.querySelectorAll('.overdue-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.add('selected');
        const reveal = document.getElementById('overdue-reveal');
        reveal.style.display = 'block';
        reveal.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          document.getElementById('m2-farming').style.display = 'block';
          document.getElementById('m2-farming').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 800);

        setTimeout(() => {
          document.getElementById('m2-pipeline').style.display = 'block';
          document.getElementById('m2-pipeline').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1500);

        if (document.getElementById('m2-knowledge')) {
          setTimeout(() => {
            document.getElementById('m2-knowledge').style.display = 'block';
          }, 2200);
        }

        if (this.state.modules[2].status === 'in_progress' || this.state.modules[2].status === 'locked') {
          this.state.modules[2].status = 'in_progress';
          this.state.modules[2].progress = 10;
          this.updateDashboard();
          this.updateSidebarProgress();
          this.saveState();
        }
      });
    });
  },

  /* ============================================
     MODULE 4 LISTENERS
     ============================================ */
  setupModule4Listeners() {
    document.querySelectorAll('.mindset-btn-m4').forEach(btn => {
      btn.addEventListener('click', () => {
        const reveal = document.getElementById('mindset-reveal-m4');
        reveal.style.display = 'block';

        setTimeout(() => {
          document.getElementById('m4-timeline').style.display = 'block';
          document.getElementById('m4-timeline').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 600);

        setTimeout(() => {
          document.getElementById('m4-traffic').style.display = 'block';
          document.getElementById('m4-traffic').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1200);

        if (this.state.modules[4].status === 'not_started' || this.state.modules[4].status === 'locked') {
          this.state.modules[4].status = 'in_progress';
          this.state.modules[4].progress = 10;
          this.updateDashboard();
          this.updateSidebarProgress();
          this.saveState();
        }
      });
    });
  },

  /* ============================================
     MARK COMPLETE
     ============================================ */
  setupContinueLearning() {
    document.getElementById('continue-learning-btn').addEventListener('click', () => {
      for (let m = 1; m <= 4; m++) {
        const mod = this.state.modules[m];
        if (mod.status !== 'completed') {
          this.navigateTo(`module${m}`);
          return;
        }
      }
      this.navigateTo('assessment');
    });

    document.querySelectorAll('.mark-complete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modNum = parseInt(btn.dataset.module);
        const mod = this.state.modules[modNum];
        if (mod.quizCompleted) {
          this.completeModule(modNum);
          return;
        }
        const quizContainer = document.getElementById(`m${modNum}-knowledge`);
        if (quizContainer) {
          quizContainer.style.display = 'block';
          quizContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
          this.setupQuiz(modNum);
        } else {
          this.completeModule(modNum);
        }
      });
    });
  },

  completeModule(modNum) {
    this.state.modules[modNum].status = 'completed';
    this.state.modules[modNum].progress = 100;
    this.state.modules[modNum].quizCompleted = true;

    if (modNum < 4) {
      this.state.modules[modNum + 1].status = 'not_started';
    }

    this.updateDashboard();
    this.updateSidebarProgress();
    this.updateModuleBadges();
    this.saveState();

    this.showToast(`Module ${modNum} completed! 🎉`, 'success');

    if (modNum < 4) {
      setTimeout(() => {
        if (confirm(`Great job! Ready to start Module ${modNum + 1}?`)) {
          this.navigateTo(`module${modNum + 1}`);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        if (confirm('Congratulations! You completed all modules. Ready to take the Final Assessment?')) {
          this.navigateTo('assessment');
        }
      }, 1000);
    }
  },

  /* ============================================
     QUIZ SYSTEM
     ============================================ */
  setupQuiz(modNum) {
    const quiz = this.quizzes[`m${modNum}`];
    if (!quiz) return;

    const key = `m${modNum}`;
    const prefix = key;

    let currentQ = 0;
    let correctCount = 0;
    let answered = false;

    const qContainer = document.getElementById(`quiz-${prefix}`);
    if (!qContainer) return;

    const qEl = document.getElementById(`${prefix}-question`);
    const optEl = document.getElementById(`${prefix}-options`);
    const fbEl = document.getElementById(`${prefix}-feedback`);
    const nextBtn = document.getElementById(`${prefix}-next`);
    const currentSpan = document.getElementById(`${prefix}-q-current`);
    const totalSpan = document.getElementById(`${prefix}-q-total`);

    if (totalSpan) totalSpan.textContent = quiz.questions.length;

    function loadQuestion() {
      if (currentQ >= quiz.questions.length) {
        if (qContainer) {
          const pct = Math.round((correctCount / quiz.questions.length) * 100);
          qContainer.innerHTML = `
            <div style="text-align: center; padding: 24px;">
              <div style="font-size: 48px; margin-bottom: 12px;">${pct >= 70 ? '🎉' : '💪'}</div>
              <h3 style="margin-bottom: 8px; color: var(--text-primary)">Quiz Complete!</h3>
              <p style="font-size: 18px; font-weight: 700; color: var(--primary)">${correctCount}/${quiz.questions.length} correct (${pct}%)</p>
              <p style="color: var(--text-secondary); margin: 12px 0; font-size: 14px;">${pct >= 70 ? 'Great job! You\'re ready to proceed.' : 'Review the material and try again.'}</p>
              <button class="btn btn-primary" onclick="App.completeModule(${modNum})">${pct >= 70 ? '✓ Complete Module' : 'Retry Quiz'} ${pct >= 70 ? '' : ''}</button>
              ${pct < 70 ? '<button class="btn btn-outline" style="margin-left: 8px;" onclick="App.setupQuiz(' + modNum + ')">Retry Quiz</button>' : ''}
            </div>
          `;

          if (pct >= 70 && !this.state.modules[modNum].quizCompleted) {
            // completion handled by button click
          }
        }
        return;
      }

      answered = false;
      const q = quiz.questions[currentQ];
      if (currentSpan) currentSpan.textContent = currentQ + 1;
      if (qEl) qEl.textContent = q.question;
      if (fbEl) { fbEl.className = 'quiz-feedback'; fbEl.style.display = 'none'; }
      if (nextBtn) nextBtn.style.display = 'none';

      if (optEl) {
        optEl.innerHTML = q.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}">${opt}</button>
        `).join('');

        optEl.querySelectorAll('.quiz-option').forEach(optBtn => {
          optBtn.addEventListener('click', () => {
            if (answered) return;
            answered = true;

            const idx = parseInt(optBtn.dataset.index);
            const isCorrect = idx === q.correct;

            optEl.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);

            if (isCorrect) {
              optBtn.classList.add('correct');
              correctCount++;
            } else {
              optBtn.classList.add('wrong');
              optEl.querySelector(`[data-index="${q.correct}"]`).classList.add('correct');
            }

            if (fbEl) {
              fbEl.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
              fbEl.style.display = 'block';
              fbEl.innerHTML = `<strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong><br>${q.feedback}`;
            }

            if (nextBtn) {
              nextBtn.style.display = 'block';
              nextBtn.textContent = currentQ < quiz.questions.length - 1 ? 'Next Question' : 'See Results';
            }
          });
        });
      }
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        currentQ++;
        loadQuestion();
      };
    }

    loadQuestion();
  },

  /* ============================================
     SCORECARD
     ============================================ */
  setupScorecard() {
    const sliders = document.querySelectorAll('.scorecard-slider');
    sliders.forEach(slider => {
      slider.addEventListener('input', () => {
        const cat = slider.dataset.category;
        const val = parseInt(slider.value);
        this.state.scorecard[cat] = val;

        const display = document.getElementById(`score-${cat}`);
        const max = slider.max;
        if (display) display.textContent = `${val}/${max}`;

        this.updateScorecardResult();
      });
    });

    // Load saved values
    Object.entries(this.state.scorecard).forEach(([cat, val]) => {
      const slider = document.querySelector(`.scorecard-slider[data-category="${cat}"]`);
      const display = document.getElementById(`score-${cat}`);
      if (slider) {
        slider.value = val;
        if (display) display.textContent = `${val}/${slider.max}`;
      }
    });

    this.updateScorecardResult();
  },

  updateScorecardResult() {
    const s = this.state.scorecard;
    const total = s.stability + s.need + s.repay + s.discipline + s.character + s.documentation + s.guarantor;

    const totalEl = document.getElementById('scorecard-total-value');
    const gaugeEl = document.getElementById('gauge-fill');
    const recEl = document.getElementById('scorecard-recommendation');

    if (totalEl) totalEl.textContent = total;

    if (gaugeEl) {
      const pct = Math.min(100, total);
      gaugeEl.style.width = `${pct}%`;
      if (total >= 70) gaugeEl.style.background = 'linear-gradient(90deg, #00c853, #69f0ae)';
      else if (total >= 50) gaugeEl.style.background = 'linear-gradient(90deg, #ffab00, #ff6d00)';
      else gaugeEl.style.background = 'linear-gradient(90deg, #d50000, #ff5252)';
    }

    if (recEl) {
      if (total >= 70) {
        recEl.innerHTML = `
          <div class="rec-icon">🟢</div>
          <div class="rec-text"><strong style="color: var(--secondary)">Recommend for FVO</strong><br>Score: ${total}/100 - This merchant meets quality standards.</div>
        `;
        recEl.style.background = 'rgba(0,200,83,0.08)';
        recEl.style.border = '1px solid rgba(0,200,83,0.2)';
      } else if (total >= 50) {
        recEl.innerHTML = `
          <div class="rec-icon">🟡</div>
          <div class="rec-text"><strong style="color: var(--amber)">Further Review Required</strong><br>Score: ${total}/100 - Additional assessment needed.</div>
        `;
        recEl.style.background = 'rgba(255,171,0,0.08)';
        recEl.style.border = '1px solid rgba(255,171,0,0.2)';
      } else {
        recEl.innerHTML = `
          <div class="rec-icon">🔴</div>
          <div class="rec-text"><strong style="color: var(--danger)">Do Not Recommend</strong><br>Score: ${total}/100 - Merchant does not meet minimum standards.</div>
        `;
        recEl.style.background = 'rgba(213,0,0,0.08)';
        recEl.style.border = '1px solid rgba(213,0,0,0.15)';
      }
    }
  },

  /* ============================================
     ASSESSMENT
     ============================================ */
  setupAssessment() {
    document.getElementById('start-assessment-btn').addEventListener('click', () => this.startAssessment());
    document.getElementById('view-certificate-btn').addEventListener('click', () => this.navigateTo('certificate'));
    document.getElementById('retake-assessment-btn').addEventListener('click', () => this.retakeAssessment());
  },

  startAssessment() {
    document.querySelector('.assessment-info-card').style.display = 'none';
    const quizEl = document.getElementById('assessment-quiz');
    quizEl.style.display = 'block';

    let currentQ = 0;
    let correctCount = 0;
    let answered = false;
    const questions = this.assessmentQuestions;

    function loadQuestion() {
      if (currentQ >= questions.length) {
        quizEl.style.display = 'none';
        const resultEl = document.getElementById('assessment-result');
        resultEl.style.display = 'block';

        const pct = Math.round((correctCount / questions.length) * 100);
        const passed = pct >= 80;

        App.state.assessment.completed = true;
        App.state.assessment.score = correctCount;
        App.state.assessment.passed = passed;
        App.saveState();

        document.getElementById('result-score').textContent = correctCount;
        document.getElementById('result-percentage').textContent = `${pct}%`;
        document.getElementById('result-percentage').style.color = passed ? 'var(--secondary)' : 'var(--danger)';

        const statusEl = document.getElementById('result-status');
        statusEl.textContent = passed ? '🎉 PASSED' : '📚 NOT PASSED';
        statusEl.className = `result-status ${passed ? 'pass' : 'fail'}`;

        document.getElementById('result-details').innerHTML = passed
          ? 'Congratulations! You have demonstrated mastery of Smart Lending principles. You can now download your certificate.'
          : `You scored ${pct}%. The passing score is 80%. Please review the modules and try again.`;

        document.getElementById('result-icon').textContent = passed ? '🏆' : '📚';

        if (passed) {
          // Unlock certificate
          const certDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          });
          App.state.certificate.date = certDate;
          App.state.certificate.id = 'SLA-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
          App.saveState();
        }

        resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      answered = false;
      const q = questions[currentQ];

      document.getElementById('assessment-current').textContent = currentQ + 1;
      document.getElementById('assessment-total').textContent = questions.length;
      document.getElementById('assessment-progress-fill').style.width = `${((currentQ) / questions.length) * 100}%`;
      document.getElementById('assessment-question').textContent = q.question;

      const fbEl = document.getElementById('assessment-feedback');
      fbEl.className = 'quiz-feedback';
      fbEl.style.display = 'none';

      const nextBtn = document.getElementById('assessment-next');
      nextBtn.style.display = 'none';

      const optEl = document.getElementById('assessment-options');
      optEl.innerHTML = q.options.map((opt, i) => `
        <button class="quiz-option" data-index="${i}">${opt}</button>
      `).join('');

      optEl.querySelectorAll('.quiz-option').forEach(optBtn => {
        optBtn.addEventListener('click', () => {
          if (answered) return;
          answered = true;

          const idx = parseInt(optBtn.dataset.index);
          const isCorrect = idx === q.correct;

          optEl.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);

          if (isCorrect) {
            optBtn.classList.add('correct');
            correctCount++;
          } else {
            optBtn.classList.add('wrong');
            optEl.querySelector(`[data-index="${q.correct}"]`).classList.add('correct');
          }

          fbEl.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
          fbEl.style.display = 'block';
          fbEl.innerHTML = `<strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong><br>${q.feedback}`;

          nextBtn.style.display = 'block';
          nextBtn.textContent = currentQ < questions.length - 1 ? 'Next Question' : 'See Results';
        });
      });
    }

    document.getElementById('assessment-next').onclick = () => {
      currentQ++;
      loadQuestion();
    };

    loadQuestion();
  },

  retakeAssessment() {
    this.state.assessment.completed = false;
    this.state.assessment.score = 0;
    this.state.assessment.passed = false;
    this.saveState();

    document.getElementById('assessment-result').style.display = 'none';
    document.querySelector('.assessment-info-card').style.display = 'block';
    this.showToast('Assessment reset. Good luck!', 'info');
  },

  /* ============================================
     CERTIFICATE
     ============================================ */
  setupCertificate() {
    const nameInput = document.getElementById('cert-name-input');
    const generateBtn = document.getElementById('generate-cert-btn');
    const downloadBtn = document.getElementById('download-cert-btn');

    const savedName = localStorage.getItem('sla_cert_name');
    if (savedName && nameInput) {
      nameInput.value = savedName;
    }

    if (this.state.certificate.generated && this.state.assessment.passed) {
      this.displayCertificate();
    }

    generateBtn.addEventListener('click', () => {
      if (!this.state.assessment.passed) {
        this.showToast('You must pass the Final Assessment first (80%+)', 'error');
        return;
      }

      const name = nameInput.value.trim();
      if (!name || name.length < 2) {
        this.showToast('Please enter your full name', 'error');
        nameInput.focus();
        return;
      }

      this.state.certificate.generated = true;
      this.state.certificate.name = name;
      if (!this.state.certificate.date) {
        this.state.certificate.date = new Date().toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
      }
      if (!this.state.certificate.id) {
        this.state.certificate.id = 'SLA-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      }

      localStorage.setItem('sla_cert_name', name);
      localStorage.setItem('sla_cert_date', this.state.certificate.date);
      localStorage.setItem('sla_cert_id', this.state.certificate.id);
      this.saveState();

      this.displayCertificate();
      this.showToast('Certificate generated! 🎉', 'success');
    });

    downloadBtn.addEventListener('click', () => this.downloadCertificate());
  },

  displayCertificate() {
    const display = document.getElementById('certificate-display');
    const form = document.querySelector('.certificate-form');
    if (form) form.style.display = 'none';
    if (display) {
      display.style.display = 'block';
      document.getElementById('cert-display-name').textContent = this.state.certificate.name || 'Student';
      document.getElementById('cert-date').textContent = this.state.certificate.date || '--';
      document.getElementById('cert-id').textContent = this.state.certificate.id || '--';
    }
  },

  downloadCertificate() {
    const card = document.getElementById('certificate-card');
    if (!card) return;

    this.showToast('Certificate download feature requires a browser with print support. Use Print (Ctrl+P) and save as PDF.', 'info');

    const win = window.open('', '_blank');
    if (!win) {
      this.showToast('Please allow pop-ups to download certificate', 'error');
      return;
    }

    const name = this.state.certificate.name || 'Student';
    const date = this.state.certificate.date || new Date().toLocaleDateString();
    const id = this.state.certificate.id || '--';
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Smart Lending Academy - Certificate</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: ${isDark ? '#0a0e1a' : '#f0f4f8'};
            padding: 40px;
          }
          .cert {
            width: 700px;
            padding: 60px;
            background: ${isDark ? 'linear-gradient(135deg, #1e293b, #111827)' : 'linear-gradient(135deg, #fff, #f8f9fa)'};
            border: 4px double #1a73e8;
            border-radius: 24px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            color: ${isDark ? '#f1f5f9' : '#1a1a2e'};
          }
          .badge { font-size: 64px; margin-bottom: 16px; }
          .title { font-size: 32px; font-weight: 800; color: #1a73e8; margin-bottom: 8px; letter-spacing: 2px; }
          .subtitle { font-size: 14px; color: ${isDark ? '#94a3b8' : '#475569'}; max-width: 450px; margin: 0 auto 24px; line-height: 1.5; }
          .divider { width: 120px; height: 2px; background: linear-gradient(90deg, transparent, #1a73e8, transparent); margin: 0 auto 24px; }
          .label { font-size: 14px; color: ${isDark ? '#64748b' : '#94a3b8'}; margin-bottom: 8px; }
          .name { font-size: 36px; font-weight: 800; margin-bottom: 24px; font-family: 'JetBrains Mono', monospace; }
          .desc { font-size: 14px; color: ${isDark ? '#94a3b8' : '#475569'}; max-width: 550px; margin: 0 auto 32px; line-height: 1.6; }
          .footer { display: flex; justify-content: center; gap: 60px; padding-top: 24px; border-top: 1px solid ${isDark ? '#334155' : '#e2e8f0'}; }
          .footer-label { display: block; font-size: 11px; color: ${isDark ? '#64748b' : '#94a3b8'}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
          .footer-val { font-size: 14px; font-weight: 600; }
          @media print {
            body { padding: 0; }
            .cert { box-shadow: none; border: 4px double #1a73e8; }
          }
        </style>
      </head>
      <body>
        <div class="cert">
          <div class="badge">🏆</div>
          <h1 class="title">SMART LENDING ACADEMY</h1>
          <p class="subtitle">Building Healthy Loan Portfolios Through Better Merchant Selection and Relationship Management</p>
          <div class="divider"></div>
          <p class="label">This certifies that</p>
          <h2 class="name">${name}</h2>
          <p class="desc">has successfully completed all modules of the Smart Lending Academy training program and demonstrated mastery in portfolio-based lending, merchant evaluation, and post-disbursement management.</p>
          <div class="footer">
            <div>
              <span class="footer-label">Date Completed</span>
              <span class="footer-val">${date}</span>
            </div>
            <div>
              <span class="footer-label">Certificate ID</span>
              <span class="footer-val">${id}</span>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        <\/script>
      </body>
      </html>
    `);
    win.document.close();
  },

  /* ============================================
     GLOSSARY
     ============================================ */
  renderGlossary() {
    const list = document.getElementById('glossary-list');
    if (!list) return;

    list.innerHTML = this.glossary.map(g => `
      <div class="glossary-item" data-term="${g.term}">
        <div class="glossary-term">${g.term}</div>
        <div class="glossary-def">${g.def}</div>
      </div>
    `).join('');

    const searchInput = document.getElementById('glossary-search-input');
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('.glossary-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
      });
    });
  },

  /* ============================================
     TIMER
     ============================================ */
  startTimer() {
    if (this.state.timerInterval) return;

    const display = document.getElementById('timer-display');
    const updateDisplay = () => {
      const h = Math.floor(this.state.timerSeconds / 3600);
      const m = Math.floor((this.state.timerSeconds % 3600) / 60);
      const s = this.state.timerSeconds % 60;
      display.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    updateDisplay();

    this.state.timerInterval = setInterval(() => {
      this.state.timerSeconds++;
      updateDisplay();
      if (this.state.timerSeconds % 30 === 0) {
        this.saveState();
      }
    }, 1000);
  },

  /* ============================================
     DASHBOARD UPDATES
     ============================================ */
  updateDashboard() {
    const mods = this.state.modules;
    const completed = [1, 2, 3, 4].filter(m => mods[m].status === 'completed').length;
    const totalProgress = Math.round(
      [1, 2, 3, 4].reduce((sum, m) => sum + (mods[m].progress || 0), 0) / 4
    );

    document.getElementById('stat-progress-value').textContent = `${totalProgress}%`;
    document.getElementById('stat-modules-completed').textContent = completed;

    const health = completed === 0 ? '--' : `${Math.min(100, completed * 25 + 10)}%`;
    document.getElementById('stat-health-value').textContent = health;

    const hours = Math.floor(this.state.timerSeconds / 3600);
    const mins = Math.floor((this.state.timerSeconds % 3600) / 60);
    document.getElementById('stat-time-value').textContent = `${hours}h ${mins}m`;

    this.updateModuleCards();
    this.updateSidebarProgress();
    this.updateModuleBadges();
  },

  updateModuleCards() {
    [1, 2, 3, 4].forEach(m => {
      const mod = this.state.modules[m];
      const statusMap = {
        'locked': '🔒 Locked',
        'not_started': '📋 Not Started',
        'in_progress': '⏳ In Progress',
        'completed': '✅ Completed'
      };

      const statusEl = document.getElementById(`m${m}-status`);
      const progressEl = document.getElementById(`m${m}-progress`);
      const btn = document.querySelector(`.start-module-btn[data-module="${m}"]`);

      if (statusEl) statusEl.textContent = statusMap[mod.status] || 'Locked';
      if (progressEl) progressEl.style.width = `${mod.progress || 0}%`;
      if (btn) {
        btn.disabled = mod.status === 'locked';
        btn.style.opacity = mod.status === 'locked' ? '0.5' : '1';
        btn.textContent = mod.status === 'completed' ? 'Review' : mod.status === 'in_progress' ? 'Continue' : 'Start Module';
      }
    });
  },

  updateSidebarProgress() {
    const totalProgress = Math.round(
      [1, 2, 3, 4].reduce((sum, m) => sum + (this.state.modules[m].progress || 0), 0) / 4
    );
    document.getElementById('sidebar-progress-pct').textContent = `${totalProgress}%`;
    document.getElementById('sidebar-progress-fill').style.width = `${totalProgress}%`;
  },

  updateModuleBadges() {
    [1, 2, 3, 4].forEach(m => {
      const mod = this.state.modules[m];
      const badge = document.getElementById(`badge-m${m}`);
      if (badge) {
        if (mod.status === 'completed') {
          badge.textContent = '✅';
          badge.style.background = 'transparent';
        } else if (mod.status === 'locked') {
          badge.textContent = '🔒';
          badge.style.background = 'transparent';
        } else if (mod.status === 'in_progress') {
          badge.textContent = '⏳';
          badge.style.background = 'transparent';
        } else {
          badge.textContent = 'New';
          badge.style.background = '';
        }
      }
    });

    const assessBadge = document.getElementById('badge-assessment');
    if (assessBadge) {
      const allDone = [1, 2, 3, 4].every(m => this.state.modules[m].status === 'completed');
      if (this.state.assessment.completed) {
        assessBadge.textContent = this.state.assessment.passed ? '✅' : '📚';
        assessBadge.style.background = 'transparent';
      } else if (allDone) {
        assessBadge.textContent = 'Ready!';
        assessBadge.style.background = 'var(--secondary)';
      } else {
        assessBadge.textContent = '🔒';
        assessBadge.style.background = 'transparent';
      }
    }
  },

  /* ============================================
     START OVER
     ============================================ */
  startOver() {
    if (!confirm('This will reset all progress. Are you sure?')) return;

    this.state.modules = {
      1: { status: 'not_started', progress: 0, quizScore: 0, quizCompleted: false },
      2: { status: 'locked', progress: 0, quizScore: 0, quizCompleted: false },
      3: { status: 'locked', progress: 0, quizScore: 0, quizCompleted: false },
      4: { status: 'locked', progress: 0, quizScore: 0, quizCompleted: false },
    };
    this.state.assessment = { completed: false, score: 0, passed: false };
    this.state.certificate = { generated: false, name: '', date: '', id: '' };
    this.state.timerSeconds = 0;

    localStorage.removeItem('sla_cert_name');
    localStorage.removeItem('sla_cert_date');
    localStorage.removeItem('sla_cert_id');

    this.saveState();
    this.updateDashboard();
    this.updateSidebarProgress();
    this.updateModuleBadges();

    document.querySelector('.certificate-form').style.display = 'block';
    document.getElementById('certificate-display').style.display = 'none';
    document.getElementById('assessment-result').style.display = 'none';
    document.querySelector('.assessment-info-card').style.display = 'block';

    this.navigateTo('dashboard');
    this.showToast('Progress reset. Starting fresh!', 'info');
  },

  /* ============================================
     TOAST NOTIFICATIONS
     ============================================ */
  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
};

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
