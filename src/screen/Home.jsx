import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Users,
  GraduationCap,
  Globe2,
  Bus,
  BookOpen,
  MessageCircle,
  CheckCircle2,
  FileText,
  Handshake,
} from "lucide-react";
import Header from "../components/Home/Header";
import WebAdvertisementPopup from "../components/Home/WebAdvertisementPopup";
import { AppDownload } from "../components/AppContentLayout";
import androidIcon from "../assets/android.png";
import appleIcon from "../assets/apple.png";
import { appStores } from "../data/appFeatures";
import "../styles/ngo.css";
const programmes = [
  {
    icon: GraduationCap,
    number: "01",
    title: "Learning that starts early",
    text: "School and college sessions on social media safety, cyberbullying, digital privacy, passwords and safe internet practices.",
    tag: "SCHOOLS & COLLEGES",
  },
  {
    icon: Users,
    number: "02",
    title: "Stronger, safer communities",
    text: "Public awareness programmes, digital-safety demonstrations and community sessions that make cyber risks easier to understand.",
    tag: "COMMUNITY OUTREACH",
  },
  {
    icon: Bus,
    number: "03",
    title: "Awareness on the move",
    text: "A proposed mobile awareness vehicle bringing digital displays, educational videos and interactive safety experiences to towns and villages.",
    tag: "MOBILE AWARENESS",
  },
];
const questions = [
  {
    question:
      "A message asks for your password to claim a prize. What should you do?",
    options: [
      "Share it to claim the prize",
      "Avoid sharing it and verify the sender independently",
      "Forward the message to friends",
    ],
    answer: 1,
    explanation:
      "Keep passwords private. Unexpected prize messages that request account details are a reason to pause and verify.",
  },
  {
    question: "Which password habit helps protect your accounts?",
    options: [
      "Use a different, strong password for each account",
      "Reuse one password everywhere",
      "Use your name and birthday",
    ],
    answer: 0,
    explanation:
      "Unique passwords help prevent a compromise of one account from exposing your other accounts.",
  },
  {
    question: "Before posting a photo publicly, what should you check?",
    options: [
      "Only whether it looks good",
      "Whether it includes personal details or someone else’s private information",
      "How many likes it might get",
    ],
    answer: 1,
    explanation:
      "Check for visible personal information and respect other people’s privacy before sharing.",
  },
];
function AwarenessQuiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const current = questions[index];
  const choose = (value) => {
    if (selected !== null) return;
    setSelected(value);
    if (value === current.answer) setScore(score + 1);
  };
  return (
    <div className="ngo-quiz">
      <div className="ngo-quiz-label">
        <span>THE AWARENESS CHECK</span>
        <span>{complete ? "Complete" : `0${index + 1} / 03`}</span>
      </div>
      {complete ? (
        <>
          <h3>You scored {score} out of 3.</h3>
          <p>
            Every moment of awareness is a step toward safer digital habits.
            Keep learning and share what you know.
          </p>
          <button
            className="ngo-button"
            onClick={() => {
              setIndex(0);
              setSelected(null);
              setScore(0);
              setComplete(false);
            }}
          >
            Try again <ArrowRight size={16} />
          </button>
        </>
      ) : (
        <>
          <h3>{current.question}</h3>
          <div className="ngo-quiz-options">
            {current.options.map((option, i) => (
              <button
                key={option}
                disabled={selected !== null}
                className={
                  selected !== null && i === current.answer
                    ? "correct"
                    : selected === i
                      ? "incorrect"
                      : ""
                }
                onClick={() => choose(i)}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {option}
              </button>
            ))}
          </div>
          {selected !== null && (
            <div className="ngo-quiz-feedback" role="status">
              <p>
                <strong>
                  {selected === current.answer
                    ? "That’s right. "
                    : "Let’s learn from this. "}
                </strong>
                {current.explanation}
              </p>
              <button
                className="ngo-text-link"
                onClick={() => {
                  if (index === questions.length - 1) setComplete(true);
                  else {
                    setIndex(index + 1);
                    setSelected(null);
                  }
                }}
              >
                {index === questions.length - 1
                  ? "See your result"
                  : "Next question"}{" "}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default function Home() {
  return (
    <div className="ngo-site">
      <Header />
      <WebAdvertisementPopup />
      <main id="main-content">
        <section className="ngo-hero ngo-container">
          <div className="ngo-hero-copy">
       
            <h1>
              Cyber Help Desk:
              <br />
              <em>Scam Helpline.</em>
            </h1>
            <p>
              Get trusted guidance when you face an online scam, cyber fraud or
              digital threat. Cyber Help Desk is powered by Cyber Awareness
              Welfare Society, supporting safer digital communities through
              help, education and prevention.
            </p>
            {/* <div className="ngo-actions">
              <a href="#help" className="ngo-button">
                Get scam help <ArrowRight size={18} />
              </a>
              <Link to="/about" className="ngo-text-link">
                About the organization <ArrowUpRight size={17} />
              </Link>
            </div> */}
            <div className="ngo-hero-download">
              <span>TAKE CYBER HELP DESK WITH YOU</span>
              <div className="ngo-store-buttons">
                <a
                  className="ngo-store-button"
                  href={appStores.android}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Cyber Help Desk from Google Play"
                >
                  <img src={androidIcon} alt="" />
                  <span>
                    <small>GET IT ON</small>
                    <strong>Google Play</strong>
                  </span>
                </a>
                <a
                  className="ngo-store-button"
                  href={appStores.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Cyber Help Desk from the Apple App Store"
                >
                  <img className="apple" src={appleIcon} alt="" />
                  <span>
                    <small>DOWNLOAD ON THE</small>
                    <strong>App Store</strong>
                  </span>
                </a>
              </div>
            </div>
            <div className="ngo-hero-note">
              <ShieldCheck size={19} />
              <span>Powered by Cyber Awareness Welfare Society</span>
            </div>
          </div>
          <div className="ngo-hero-art">
            <div className="ngo-orbit orbit-one" />
            <div className="ngo-orbit orbit-two" />
            <div className="ngo-art-label">
              <span className="ngo-dot" /> ONE MISSION. SHARED RESPONSIBILITY.
            </div>
            <Globe2 className="ngo-globe" strokeWidth={0.65} />
            <div className="ngo-art-card card-learn">
              <BookOpen />
              <span>
                Learn today.<strong>Stay safer tomorrow.</strong>
              </span>
            </div>
            <div className="ngo-art-card card-people">
              <Users />
              <span>
                Digital safety<strong>For every community.</strong>
              </span>
            </div>
            <div className="ngo-art-bottom">
              <span>LOCAL ACTION</span>
              <span className="ngo-art-line" />
              <span>
                GLOBAL VISION <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </section>
        <section className="ngo-vision-strip">
          <div className="ngo-container">
            <div>
              <span className="ngo-eyebrow">OUR INTERNATIONAL VISION</span>
              <p>
                One mission.
                <br />
                <strong>Safer digital communities.</strong>
              </p>
            </div>
            <div>
              <strong>190+</strong>
              <span>Countries in our vision</span>
            </div>
            <div>
              <strong>170+</strong>
              <span>Languages envisioned</span>
            </div>
            <p className="ngo-vision-note">
              An ambition to make cyber-safety information accessible across
              borders and languages.
            </p>
          </div>
        </section>
        <section id="mission" className="ngo-section ngo-container ngo-mission">
          <div>
            <span className="ngo-eyebrow">WHY WE EXIST</span>
            <h2>
              Awareness before
              <br />
              the incident.
            </h2>
          </div>
          <div>
            <p className="ngo-lead">
              Many people learn about cyber threats only after becoming victims.
              We want to change that.
            </p>
            <p>
              Cyber Awareness Welfare Society (CAWS) aims to make practical
              cyber-safety knowledge part of everyday life. From online fraud
              and fake loan apps to identity theft, deepfakes and digital
              harassment, understanding the risk is the first step.
            </p>
            <div className="ngo-mission-steps">
              {["Educate", "Guide", "Connect", "Prevent"].map((step, i) => (
                <span key={step}>
                  <b>0{i + 1}</b>
                  {step}
                </span>
              ))}
            </div>
          </div>
        </section>
        <section id="programmes" className="ngo-programmes">
          <div className="ngo-container ngo-section">
            <div className="ngo-section-heading">
              <div>
                <span className="ngo-eyebrow">
                  KNOWLEDGE THAT REACHES PEOPLE
                </span>
                <h2>Different places. One purpose.</h2>
              </div>
              <p>
                Taking cyber awareness beyond screens
                <br />
                and into everyday communities.
              </p>
            </div>
            <div className="ngo-programme-grid">
              {programmes.map(({ icon, number, title, text, tag }) => {
                const Icon = icon;
                return (
                  <article className="ngo-programme" key={number}>
                    <div className="ngo-programme-top">
                      <Icon size={29} />
                      <span>{number}</span>
                    </div>
                    <span className="ngo-eyebrow">{tag}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                    <Link to="/partnership" className="ngo-text-link">
                      Support this programme <ArrowUpRight size={17} />
                    </Link>
                  </article>
                );
              })}
            </div>
            <div className="ngo-vehicle">
              <div>
                <span className="ngo-eyebrow">
                  INTRODUCING OUR MOBILE AWARENESS VISION
                </span>
                <h3>A classroom without boundaries.</h3>
                <p>Cities → Districts → Towns → Villages</p>
                <p>
                  A mobile digital awareness centre designed to combine
                  technology with ground-level outreach.
                </p>
                <a
                  className="ngo-text-link"
                  href="/documents/caws-partnership-proposal.pdf#page=14"
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore the vehicle proposal <ArrowUpRight size={17} />
                </a>
              </div>
              <img
                src="/images/caws-page-14.png"
                alt="CAWS proposal showing the mobile cyber awareness vehicle concept and planned digital displays"
                loading="lazy"
              />
            </div>
          </div>
        </section>
        <section
          id="learning"
          className="ngo-section ngo-container ngo-learning"
        >
          <div>
            <span className="ngo-eyebrow">
              LEARN. PARTICIPATE. PUT IT INTO PRACTICE.
            </span>
            <h2>
              A little knowledge.
              <br />A meaningful difference.
            </h2>
            <p>
              Try a short awareness check, inspired by the topics in our
              proposed interactive sessions.
            </p>
            <div className="ngo-topic-list">
              {[
                "Online fraud prevention",
                "Social media safety",
                "Digital privacy",
                "Protecting children online",
              ].map((topic) => (
                <span key={topic}>
                  <CheckCircle2 size={18} />
                  {topic}
                </span>
              ))}
            </div>
            <p className="ngo-small">
              This three-question practice activity is for learning and does not
              award a certificate.
            </p>
          </div>
          <AwarenessQuiz />
        </section>
        <section className="ngo-partner-band">
          <div className="ngo-container">
            <div>
              <span className="ngo-eyebrow">PURPOSEFUL PARTNERSHIPS</span>
              <h2>
                Support awareness.
                <br />
                Create community impact.
              </h2>
              <p>
                Help turn corporate support into educational programmes, digital
                resources and community outreach.
              </p>
              <Link to="/partnership" className="ngo-button light">
                Explore a partnership <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="ngo-principles">
              <Handshake size={35} />
              <h3>
                Awareness first.
                <br />
                Transparency always.
              </h3>
              <p>
                Our campaign model is supported by corporate sponsors, industry
                partners and institutions. Awareness programme participants
                should not be approached for personal donations.
              </p>
              <span>TRANSPARENCY · ACCOUNTABILITY · RESPONSIBILITY</span>
            </div>
          </div>
        </section>
        <section className="ngo-section ngo-container">
          <span className="ngo-eyebrow">MORE FROM CYBER HELP DESK</span>
          <h2>Explore, learn and take part.</h2>
          <div className="app-feature-grid">
            <Link className="app-info-card" to="/live-tests">
              <span className="ngo-eyebrow">LIVE TESTS</span>
              <h3>Turn awareness into participation.</h3>
              <p>
                Learn how to enroll, join live questions, view rankings and
                download certificates in the app.
              </p>
              <span className="ngo-text-link">Explore live tests →</span>
            </Link>
            <Link className="app-info-card" to="/course">
              <span className="ngo-eyebrow">COURSES & CLASSES</span>
              <h3>Build your digital knowledge.</h3>
              <p>
                Browse courses, instructors and curriculum, with videos,
                materials, assessments and learning progress.
              </p>
              <span className="ngo-text-link">Browse courses →</span>
            </Link>
            <Link className="app-info-card" to="/about">
              <span className="ngo-eyebrow">WHO WE ARE</span>
              <h3>Know the people behind the purpose.</h3>
              <p>
                Read our full mission, organizational identity, verification
                standards, privacy policy and terms.
              </p>
              <span className="ngo-text-link">Get to know CAWS →</span>
            </Link>
          </div>
          <div className="ngo-actions">
            <Link className="ngo-text-link" to="/app-features">
              Explore all app features →
            </Link>
            <Link className="ngo-text-link" to="/volunteer">
              Become a volunteer →
            </Link>
            <Link className="ngo-text-link" to="/frequently-asked-questions">
              Frequently asked questions →
            </Link>
          </div>
          <AppDownload />
        </section>
        <section id="help" className="ngo-section ngo-container">
          <div className="ngo-section-heading">
            <div>
              <span className="ngo-eyebrow">INFORMATION WHEN IT MATTERS</span>
              <h2>You don’t have to navigate it alone.</h2>
            </div>
          </div>
          <div className="ngo-help-grid">
            <Link to="/contact-us">
              <MessageCircle />
              <h3>Talk to CAWS</h3>
              <p>
                Connect with our team for awareness information and guidance.
              </p>
              <span className="ngo-text-link">
                Get in touch <ArrowRight size={17} />
              </span>
            </Link>
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noreferrer"
            >
              <ShieldCheck />
              <h3>Official reporting</h3>
              <p>
                Visit India’s National Cyber Crime Reporting Portal for official
                reporting channels.
              </p>
              <span className="ngo-text-link">
                Visit the official portal <ArrowUpRight size={17} />
              </span>
            </a>
            <a
              href="/documents/caws-partnership-proposal.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <FileText />
              <h3>Read our proposal</h3>
              <p>
                Explore the full campaign model, partnership opportunities and
                reporting approach.
              </p>
              <span className="ngo-text-link">
                View the PDF <ArrowUpRight size={17} />
              </span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
