import React, { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadAuthFromStorage } from "./store/reducer/auth";

import Home from "./screen/Home";
import AppDocument from "./screen/AppDocument";
import AppFeatures from "./screen/AppFeatures";
import LiveTestsInfo from "./screen/LiveTestsInfo";
import VolunteerInfo from "./screen/VolunteerInfo";
import appDocuments from "./data/appDocuments.json";
import AboutUs from "./screen/About";
import FAQPage from "./screen/FAQPage";
import TermsAndConditions from "./screen/TermsAndConditions";
import OLXFraud from "./screen/OLXFraud";
import PaymentFraud from "./screen/PaymentFraud";
import BankingFraud from "./screen/BankingFraud";
import OnlineJobFraud from "./screen/OnlineJobFraud";
import CyberStalking from "./screen/CyberStalking";
import Library from "./screen/Library";
import OurServices from "./screen/services";
import CEH from "./screen/CEH";
import CPENT from "./screen/CPENT";
import CND from "./screen/CND";
import CCSE from "./screen/CCSE";
import ECDE from "./screen/ECDE";
import Donate from "./screen/Donate";
import Partnership from "./screen/Partnership";
import ContactUs from "./screen/ContactUs";
import GalleryPage from "./screen/GalleryPage";
import ComingSoonPage from "./screen/ComingSoonPage";
import Footer from "./components/Home/Footer";
import Ransomware from "./screen/Ransomware";
import PhishingAttack from "./screen/PhishingAttack";
import CHFI from "./screen/CHFI";
import PrivacyPolicy from "./screen/PrivacyPolicy";
import Login from "./screen/Login";
import GoogleCallback from "./screen/GoogleCallback";
import AppleCallback from "./screen/AppleCallback";
import Course from "./screen/Course";
import Classes from "./screen/Classes";
import LiveClass from "./screen/LiveClass";
import ClassMaterials from "./screen/ClassMaterials";
import Question from "./screen/Question";
import ViewResult from "./screen/ViewResult";
import Video from "./screen/Video";
import MyCourse from "./screen/MyCourse";
import EditCourse from "./screen/EditCourse";
import AdminCourse from "./screen/AdminCourse";
import AdminMaterial from "./screen/AdminMaterial";
import AdminVideo from "./screen/AdminVideo";
import AdminQuestion from "./screen/AdminQuestion";
import AdminResults from "./screen/AdminResults";
import CreateCourse from "./screen/CreateCourse";
import DeleteAccount from "./screen/DeleteAccount";
import RequireAuth from "./components/RequireAuth";
import RequireTeacher from "./components/RequireTeacher";

const GA_MEASUREMENT_ID = "G-T9GW0VZR1Q";

const AppContent = () => {
  const location = useLocation();
  const isFirstPageView = useRef(true);

  // Head gtag already sends the initial page_view; only track SPA navigations.
  useEffect(() => {
    if (isFirstPageView.current) {
      isFirstPageView.current = false;
      return;
    }
    if (typeof window.gtag !== "function") return;
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
    });
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      target?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // Hide footer on live-class route
  const hideFooter = location.pathname.startsWith("/live-class/");

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {appDocuments.filter(doc => !["privacy-policy", "terms-and-conditions"].includes(doc.slug)).map(doc => <Route key={doc.slug} path={`/${doc.slug}`} element={<AppDocument slug={doc.slug} />} />)}
        <Route path="/app-features" element={<AppFeatures />} />
        <Route path="/live-tests" element={<LiveTestsInfo />} />
        <Route path="/volunteer" element={<VolunteerInfo />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/frequently-asked-questions" element={<FAQPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/olx-fraud" element={<OLXFraud />} />
        <Route path="/payment-fraud" element={<PaymentFraud />} />
        <Route path="/banking-fraud" element={<BankingFraud />} />
        <Route path="/online-job-fraud" element={<OnlineJobFraud />} />
        <Route path="/cyber-stalking" element={<CyberStalking />} />
        <Route path="/service" element={<OurServices />} />
        <Route path="/phishing-attack" element={<PhishingAttack />} />
        <Route path="/ransomware" element={<Ransomware />} />
        <Route path="/our-team" element={<ComingSoonPage />} />
        <Route path="/certified-ethical-hacker" element={<CEH />} />
        <Route
          path="/certified-penetration-testing-professional"
          element={<CPENT />}
        />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/certified-network-defender" element={<CND />} />
        <Route path="/certified-cloud-security-engineer" element={<CCSE />} />
        <Route path="/certified-devsecops-engineer" element={<ECDE />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/partnership" element={<Partnership />} />
        <Route path="/chfi" element={<CHFI />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/auth/apple/callback" element={<AppleCallback />} />
        <Route path="/auth/google" element={<GoogleCallback />} />
        <Route path="/auth/apple" element={<AppleCallback />} />
        <Route path="/auth/callback" element={<GoogleCallback />} />
        <Route path="/course" element={<Course />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/classes/:id" element={<Classes />} />
        <Route element={<RequireAuth />}>
          <Route path="/library" element={<Library />} />
          <Route path="/mycourse" element={<MyCourse />} />
          <Route path="/video/:id" element={<Video />} />
          <Route path="/live-class/:id" element={<LiveClass />} />
          <Route path="/materials/:id" element={<ClassMaterials />} />
          <Route path="/questions/:id" element={<Question />} />
          <Route path="/view-result/:id" element={<ViewResult />} />
          <Route element={<RequireTeacher />}>
            <Route path="/edit-course/:id" element={<EditCourse />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/admin-classes/:id" element={<AdminCourse />} />
            <Route path="/admin-video/:id" element={<AdminVideo />} />
            <Route path="/admin-materials/:id" element={<AdminMaterial />} />
            <Route path="/admin-question/:id" element={<AdminQuestion />} />
            <Route path="/admin-results/:id" element={<AdminResults />} />
          </Route>
        </Route>
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAuthFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
