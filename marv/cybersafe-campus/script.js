const STORAGE_KEYS = {
  auth: 'cybersafe-auth',
  quiz: 'cybersafe-quiz',
  modules: 'cybersafe-modules',
  scores: 'cybersafe-scores',
  scamReports: 'cybersafe-scam-reports',
  studentChecklist: 'cybersafe-student-checklist',
  studentChallenge: 'cybersafe-student-challenge',
};

const studentUser = {
  name: 'Student User',
  email: 'student@cybersafe.test',
  password: 'safe12345',
  role: 'student',
};

const adminUser = {
  name: 'Admin User',
  email: 'admin@cybersafe.test',
  password: 'admin12345',
  role: 'admin',
};

const defaultModules = [
  { id: 1, title: 'Phishing Defense', description: 'Learn how to spot fake emails and unsafe links.' },
  { id: 2, title: 'Password Security', description: 'Use strong and unique passwords for every account.' },
  { id: 3, title: 'Privacy Basics', description: 'Reduce personal data exposure and protect your identity online.' },
];

const defaultStudentChecklist = [
  { id: 'passwords', text: 'Use a long, unique password for every school and personal account.', done: false },
  { id: 'backup', text: 'Enable 2FA or another extra layer of protection on important accounts.', done: false },
  { id: 'links', text: 'Verify URLs and sender names before clicking unknown links or attachments.', done: false },
  { id: 'privacy', text: 'Review privacy settings and limit what you share on social media.', done: false },
  { id: 'updates', text: 'Update your apps and devices to patch security issues quickly.', done: false },
];

const defaultQuiz = [
  {
    id: 1,
    question: 'What is the safest action when you receive a message asking for your password?',
    options: [
      'Reply immediately',
      'Click the link and log in',
      'Verify through the official app or website',
      'Forward it to everyone',
    ],
    answer: 'Verify through the official app or website',
  },
  {
    id: 2,
    question: 'Which password is the strongest?',
    options: ['student123', 'Password1!', 'BlueSky@2026!Luna', 'firstname lastname'],
    answer: 'BlueSky@2026!Luna',
  },
  {
    id: 3,
    question: 'Why is sharing your full birthdate or address risky?',
    options: [
      'It helps your friends find you',
      'It can be used for identity theft or scams',
      'It improves your browsing speed',
      'It makes your account safer',
    ],
    answer: 'It can be used for identity theft or scams',
  },
  {
    id: 4,
    question: 'Which online behavior is the most responsible?',
    options: [
      'Posting private info publicly',
      'Downloading files from random links',
      'Checking messages only through official platforms and reporting suspicious activity',
      'Accepting all friend requests',
    ],
    answer: 'Checking messages only through official platforms and reporting suspicious activity',
  },
  {
    id: 5,
    question: 'What should you do before downloading a file from an unknown sender?',
    options: [
      'Download it immediately',
      'Scan it for malware and confirm the sender is trusted',
      'Share it with friends to test it',
      'Open it only if it is small',
    ],
    answer: 'Scan it for malware and confirm the sender is trusted',
  },
  {
    id: 6,
    question: 'Which is the safest way to handle a suspicious message from a classmate or school contact?',
    options: [
      'Reply right away and click the link',
      'Ask the sender to confirm through an official channel before taking action',
      'Forward it to all your classmates',
      'Download the attachment to check it',
    ],
    answer: 'Ask the sender to confirm through an official channel before taking action',
  },
];

function getStoredArray(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (Array.isArray(saved) && saved.length) return saved;
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  } catch (error) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.auth) || 'null');
  } catch (error) {
    return null;
  }
}

function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.auth);
    return;
  }

  localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(user));
}

function getModules() {
  return getStoredArray(STORAGE_KEYS.modules, defaultModules);
}

function saveModules(modules) {
  localStorage.setItem(STORAGE_KEYS.modules, JSON.stringify(modules));
}

function getQuiz() {
  return getStoredArray(STORAGE_KEYS.quiz, defaultQuiz);
}

function saveQuiz(quiz) {
  localStorage.setItem(STORAGE_KEYS.quiz, JSON.stringify(quiz));
}

function getScores() {
  return getStoredArray(STORAGE_KEYS.scores, [
    { name: 'Student User', email: 'student@cybersafe.test', score: 80, role: 'student' },
  ]);
}

function saveScores(scores) {
  localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(scores));
}

function getScamReports() {
  return getStoredArray(STORAGE_KEYS.scamReports, []);
}

function saveScamReports(reports) {
  localStorage.setItem(STORAGE_KEYS.scamReports, JSON.stringify(reports));
}

function updateAuthUI() {
  const user = getCurrentUser();
  const isLoggedIn = Boolean(user);
  const isAdmin = isLoggedIn && user.role === 'admin';
  const isStudent = isLoggedIn && user.role === 'student';

  document.body.classList.toggle('logged-in', isLoggedIn);
  document.body.classList.toggle('admin-role', isAdmin);
  document.body.classList.toggle('student-role', isStudent);

  const navLogin = document.getElementById('navLogin');
  if (navLogin) {
    navLogin.textContent = isLoggedIn ? (isAdmin ? 'Log Out' : 'Log Out') : 'Log In';
    navLogin.classList.toggle('nav-login-btn--logout', isLoggedIn);
  }

  const loginPanel = document.getElementById('login');
  if (loginPanel) {
    loginPanel.classList.toggle('hidden', isLoggedIn);
  }

  const welcomeCard = document.getElementById('welcomeCard');
  if (welcomeCard) {
    welcomeCard.classList.toggle('hidden', !isLoggedIn);
  }

  const welcomeTitle = document.getElementById('welcomeTitle');
  const welcomeText = document.getElementById('welcomeText');
  if (welcomeTitle && welcomeText && isLoggedIn) {
    const label = isAdmin ? 'Admin' : 'Student';
    welcomeTitle.textContent = `Welcome, ${user.name}`;
    welcomeText.textContent = isAdmin
      ? 'You are logged in as admin and can manage modules, questions, and reports.'
      : 'You are logged in as student and your safety tools are now unlocked.';
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.classList.toggle('hidden', !isLoggedIn);
  }

  const loginMessage = document.getElementById('loginMessage');
  if (loginMessage) {
    loginMessage.classList.add('hidden');
    loginMessage.textContent = '';
  }
}

function showMessage(element, message, type = 'error') {
  if (!element) return;
  element.textContent = message;
  element.classList.remove('hidden');
  element.classList.toggle('error', type === 'error');
  element.classList.toggle('success', type === 'success');
}

function renderActivityList() {
  const list = document.getElementById('activityList');
  if (!list) return;

  const scores = getScores().slice(-4).reverse();
  list.innerHTML = scores.length
    ? scores
        .map((entry) => `<li>${entry.name}: ${entry.score}% score</li>`)
        .join('')
    : '<li>No student activity yet.</li>';

  const moduleCount = document.getElementById('adminModuleCount');
  const quizCount = document.getElementById('adminQuizCount');
  const scoreAverage = document.getElementById('adminScoreAverage');

  if (moduleCount) {
    moduleCount.textContent = String(getModules().length);
  }

  if (quizCount) {
    quizCount.textContent = String(getQuiz().length);
  }

  if (scoreAverage) {
    const average = scores.length
      ? Math.round(scores.reduce((sum, item) => sum + Number(item.score || 0), 0) / scores.length)
      : 0;
    scoreAverage.textContent = `${average}%`;
  }
}

function renderAdminModuleList() {
  const list = document.getElementById('adminModulesList');
  if (!list) return;

  const modules = getModules();
  list.innerHTML = modules.length
    ? modules
        .map(
          (module) => `
            <li>
              <div class="list-item-row">
                <div>
                  <strong>${module.title}</strong>
                  <p>${module.description}</p>
                </div>
                <button class="delete-btn" data-type="module" data-id="${module.id}" type="button">Remove</button>
              </div>
            </li>
          `
        )
        .join('')
    : '<li>No modules added yet.</li>';
}

function renderAdminQuestionList() {
  const list = document.getElementById('adminQuestionsList');
  if (!list) return;

  const questions = getQuiz();
  list.innerHTML = questions.length
    ? questions
        .map(
          (question) => `
            <li>
              <div class="list-item-row">
                <div>
                  <strong>${question.question}</strong>
                  <p>Answer: ${question.answer}</p>
                </div>
                <button class="delete-btn" data-type="question" data-id="${question.id}" type="button">Remove</button>
              </div>
            </li>
          `
        )
        .join('')
    : '<li>No questions added yet.</li>';
}

function renderScamReports() {
  const list = document.getElementById('scamReportsList');
  if (!list) return;

  const reports = getScamReports().slice().reverse();
  list.innerHTML = reports.length
    ? reports
        .map(
          (report) => `
            <li>
              <div class="list-item-row scam-report-item">
                <div>
                  <strong>${report.website}</strong>
                  <p><em>Message:</em> ${report.message}</p>
                  <p><em>Details:</em> ${report.description}</p>
                  <small>${new Date(report.createdAt).toLocaleString()}</small>
                </div>
                <button class="delete-btn" data-type="report" data-id="${report.id}" type="button">Remove</button>
              </div>
            </li>
          `
        )
        .join('')
    : '<li>No scam reports yet.</li>';
}

function handleAdminDelete(event) {
  const button = event.target.closest('.delete-btn');
  if (!button) return;

  const { type, id } = button.dataset;
  const moduleId = Number(id);

  if (type === 'module') {
    const nextModules = getModules().filter((module) => module.id !== moduleId);
    saveModules(nextModules);
    renderAdminModuleList();
    renderActivityList();
    return;
  }

  if (type === 'question') {
    const nextQuestions = getQuiz().filter((question) => question.id !== Number(id));
    saveQuiz(nextQuestions);
    renderAdminQuestionList();
    renderActivityList();
    renderStudentQuiz();
    return;
  }

  if (type === 'report') {
    const nextReports = getScamReports().filter((report) => report.id !== Number(id));
    saveScamReports(nextReports);
    renderScamReports();
  }
}

function renderStudentQuiz() {
  const container = document.getElementById('studentQuizContainer');
  if (!container) return;

  const questions = getQuiz();

  if (!questions.length) {
    container.innerHTML = '<p>There are no quiz questions yet. Admin can add one from the admin panel.</p>';
    return;
  }

  container.innerHTML = questions
    .map(
      (question, index) => `
        <div class="question-card" data-question-id="${question.id}">
          <p class="question-title">${index + 1}. ${question.question}</p>
          ${question.options
            .map(
              (option) => `
                <label class="option">
                  <input type="radio" name="q-${question.id}" value="${option}" />
                  <span>${option}</span>
                </label>
              `
            )
            .join('')}
        </div>
      `
    )
    .join('');
}

function getStudentChecklist() {
  return getStoredArray(STORAGE_KEYS.studentChecklist, defaultStudentChecklist);
}

function saveStudentChecklist(checklist) {
  localStorage.setItem(STORAGE_KEYS.studentChecklist, JSON.stringify(checklist));
}

function renderStudentDashboard() {
  const checklist = document.getElementById('studentChecklist');
  const scoreValue = document.getElementById('studentScoreValue');
  const progressText = document.getElementById('studentProgressText');
  const challengeText = document.getElementById('studentChallenge');
  const newChallengeBtn = document.getElementById('newChallengeBtn');

  if (newChallengeBtn && !newChallengeBtn.dataset.bound) {
    newChallengeBtn.dataset.bound = 'true';
    newChallengeBtn.addEventListener('click', () => {
      const currentIndex = Number(localStorage.getItem(STORAGE_KEYS.studentChallenge) || '0');
      const nextIndex = currentIndex + 1;
      localStorage.setItem(STORAGE_KEYS.studentChallenge, String(nextIndex));
      renderStudentDashboard();
    });
  }

  const items = getStudentChecklist();
  const completedCount = items.filter((item) => item.done).length;
  const percentage = Math.round((completedCount / items.length) * 100);

  if (scoreValue) {
    scoreValue.textContent = `${percentage}%`;
  }

  if (progressText) {
    progressText.textContent =
      completedCount === items.length
        ? 'Excellent work. You have completed the full protection checklist.'
        : `${completedCount} of ${items.length} protection actions completed this week.`;
  }

  if (checklist) {
    checklist.innerHTML = items
      .map(
        (item) => `
          <li>
            <label>
              <input type="checkbox" data-id="${item.id}" ${item.done ? 'checked' : ''} />
              <span>${item.text}</span>
            </label>
          </li>
        `
      )
      .join('');

    checklist.querySelectorAll('input[type="checkbox"]').forEach((box) => {
      box.addEventListener('change', (event) => {
        const target = event.target;
        const selectedId = target.dataset.id;
        const updatedItems = getStudentChecklist().map((item) =>
          item.id === selectedId ? { ...item, done: target.checked } : item
        );
        saveStudentChecklist(updatedItems);
        renderStudentDashboard();
      });
    });
  }

  if (challengeText) {
    const challenges = [
      'Review a suspicious message by checking the sender, link, and urgency before you act.',
      'Compare the website URL against the official site before entering your login details.',
      'Create a unique password for each account and avoid repeating your school password elsewhere.',
      'Check your privacy settings and remove any personal details that should stay private.'
    ];

    const storedIndex = Number(localStorage.getItem(STORAGE_KEYS.studentChallenge) || '0');
    const currentIndex = storedIndex % challenges.length;
    challengeText.textContent = challenges[currentIndex];
  }

}

function submitScamReport(event) {
  event.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'student') return;

  const message = document.getElementById('scamMessage').value.trim();
  const website = document.getElementById('scamWebsite').value.trim();
  const description = document.getElementById('scamDescription').value.trim();

  if (!message || !website || !description) return;

  const reports = getScamReports();
  reports.push({
    id: Date.now(),
    message,
    website,
    description,
    createdAt: new Date().toISOString(),
    submittedBy: currentUser.email,
  });

  saveScamReports(reports);
  renderScamReports();
  document.getElementById('scamReportForm').reset();

  const formStatus = document.createElement('p');
  formStatus.className = 'login-message success';
  formStatus.textContent = 'Your scam report has been submitted successfully. Admin can review it from the admin panel.';

  const form = document.getElementById('scamReportForm');
  form.appendChild(formStatus);
  setTimeout(() => formStatus.remove(), 3000);
}

function gradeQuiz() {
  const questions = getQuiz();
  if (!questions.length) return;

  let correctCount = 0;

  questions.forEach((question) => {
    const selected = document.querySelector(`input[name="q-${question.id}"]:checked`);
    if (selected && selected.value === question.answer) {
      correctCount += 1;
    }
  });

  const total = questions.length;
  const percentage = Math.round((correctCount / total) * 100);

  const resultBox = document.getElementById('quizResult');
  if (!resultBox) return;

  resultBox.classList.remove('hidden');

  if (percentage >= 80) {
    resultBox.innerHTML = `<strong>Your score: ${correctCount}/${total} (${percentage}%)</strong><br>You are doing very well. Keep protecting your accounts and personal data.`;
  } else if (percentage >= 50) {
    resultBox.innerHTML = `<strong>Your score: ${correctCount}/${total} (${percentage}%)</strong><br>Good start. Review the tips and try again to strengthen your cybersecurity habits.`;
  } else {
    resultBox.innerHTML = `<strong>Your score: ${correctCount}/${total} (${percentage}%)</strong><br>Keep learning. Focus on checking messages carefully and using strong password habits.`;
  }

  const currentUser = getCurrentUser();
  if (currentUser) {
    const allScores = getScores();
    allScores.push({
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      score: percentage,
    });
    saveScores(allScores);
    renderActivityList();
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const messageBox = document.getElementById('loginMessage');

  const match = [studentUser, adminUser].find(
    (user) => user.email.toLowerCase() === email && user.password === password
  );

  if (!match) {
    showMessage(messageBox, 'Invalid email or password. Use the demo account shown below.', 'error');
    return;
  }

  setCurrentUser({ name: match.name, email: match.email, role: match.role });
  updateAuthUI();

  if (match.role === 'admin') {
    showMessage(messageBox, 'Admin login successful. You can manage content and monitor activity.', 'success');
    document.getElementById('admin')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    showMessage(messageBox, 'Login successful. Your student dashboard and safety tools are now unlocked.', 'success');
    document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.getElementById('loginForm')?.reset();
}

function addModule(event) {
  event.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') return;

  const title = document.getElementById('moduleTitle').value.trim();
  const description = document.getElementById('moduleDesc').value.trim();
  if (!title || !description) return;

  const modules = getModules();
  modules.push({
    id: Date.now(),
    title,
    description,
  });
  saveModules(modules);
  renderAdminModuleList();
  renderActivityList();

  document.getElementById('moduleForm').reset();
}

function addQuestion(event) {
  event.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') return;

  const questionText = document.getElementById('newQuestion').value.trim();
  const answerText = document.getElementById('newAnswer').value.trim();
  if (!questionText || !answerText) return;

  const quiz = getQuiz();
  const wrongOptions = [
    'Check the sender through an official channel first',
    'Share the message with classmates to confirm',
    'Open the link immediately to verify it',
  ];

  const optionSet = [answerText, ...wrongOptions].sort(() => Math.random() - 0.5);

  quiz.push({
    id: Date.now(),
    question: questionText,
    options: optionSet,
    answer: answerText,
  });
  saveQuiz(quiz);
  renderStudentQuiz();
  renderAdminQuestionList();
  renderActivityList();
  document.getElementById('quizAdminForm').reset();
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const welcomeLogoutBtn = document.getElementById('welcomeLogoutBtn');
  const navLogin = document.getElementById('navLogin');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const checkScoreBtn = document.getElementById('checkScore');
  const moduleForm = document.getElementById('moduleForm');
  const quizAdminForm = document.getElementById('quizAdminForm');
  const scamReportForm = document.getElementById('scamReportForm');

  updateAuthUI();
  renderActivityList();
  renderStudentDashboard();
  renderStudentQuiz();
  renderScamReports();

  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }

  const doLogout = () => {
    setCurrentUser(null);
    updateAuthUI();
    document.getElementById('loginEmail')?.focus();
  };

  if (logoutBtn) {
    logoutBtn.addEventListener('click', doLogout);
  }

  if (welcomeLogoutBtn) {
    welcomeLogoutBtn.addEventListener('click', doLogout);
  }

  if (navLogin) {
    navLogin.addEventListener('click', () => {
      if (getCurrentUser()) {
        doLogout();
      } else {
        document.getElementById('login')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (checkScoreBtn) {
    checkScoreBtn.addEventListener('click', gradeQuiz);
  }

  if (moduleForm) {
    moduleForm.addEventListener('submit', addModule);
  }

  if (quizAdminForm) {
    quizAdminForm.addEventListener('submit', addQuestion);
  }

  if (scamReportForm) {
    scamReportForm.addEventListener('submit', submitScamReport);
  }

  document.addEventListener('click', (event) => {
    const deleteTarget = event.target.closest('.delete-btn');
    if (deleteTarget) {
      handleAdminDelete(event);
    }
  });

  renderAdminModuleList();
  renderAdminQuestionList();
  renderScamReports();
});
