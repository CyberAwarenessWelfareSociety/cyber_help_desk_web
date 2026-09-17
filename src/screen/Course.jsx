import { Link } from 'react-router-dom';
import { BookOpen, ArrowUpRight, Clock, Award, User } from 'lucide-react';
import { useGetAllCoursesQuery } from '../store/api/course';
import AppContentLayout, { AppDownload } from '../components/AppContentLayout';

// Truncate course description to a limited number of characters cleanly
function truncateDescription(text, maxChars = 110) {
  if (!text) return '';
  const cleaned = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxChars) return cleaned;
  return cleaned.slice(0, maxChars).trim() + '…';
}

export default function Course() {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch
  } = useGetAllCoursesQuery();

  const courses = Array.isArray(data?.data) ? data.data : [];

  return (
    <AppContentLayout
      title="Learn skills. Build digital confidence."
      eyebrow="COURSES & MY LIBRARY"
      intro="Explore the same course catalogue used by the Cyber Help Desk app. Review instructors, duration, pricing and curriculum before choosing a course."
    >
      <section className="app-feature-grid">
        <article className="app-info-card">
          <BookOpen />
          <h3>Learn in different ways</h3>
          <p>Course classes can include live sessions, recorded videos, downloadable materials and notes. The curriculum shows which resources are available.</p>
        </article>

        <article className="app-info-card">
          <h3>Practice and track progress</h3>
          <p>Class MCQ assessments and result screens help learners test their knowledge. Return to enrolled courses through your personal library.</p>
          <Link className="ngo-text-link" to="/mycourse">My enrolled courses →</Link>
        </article>

        <article className="app-info-card">
          <h3>Understand access & certificates</h3>
          <p>Sign in and enroll to access protected resources. A course may require payment. Where certificate generation is enabled, complete all course videos to unlock it.</p>
        </article>
      </section>

      <section className="app-catalogue">
        <div className="ngo-section-heading">
          <div>
            <span className="ngo-eyebrow">EXPLORE THE CATALOGUE</span>
            <h2>Available courses</h2>
          </div>
          <button
            className="ngo-text-link"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? 'Refreshing…' : 'Refresh courses'}
          </button>
        </div>

        {isLoading ? (
          <p role="status">Loading courses…</p>
        ) : isError ? (
          <div className="app-source-note" role="alert">
            <h3>Courses couldn’t be loaded.</h3>
            <p>Please try refreshing. You can still read how courses work here or browse the app.</p>
          </div>
        ) : courses.length === 0 ? (
          <p className="app-source-note">No courses are available right now. Check back for new learning opportunities.</p>
        ) : (
          <div className="app-feature-grid">
            {courses.map(course => {
              const isFree = course.discount_price != null && Number(course.discount_price) === 0;
              const actualPrice = Number(course.actual_price || 0);
              const discountPrice = Number(course.discount_price || 0);
              const hasDiscount = actualPrice > discountPrice && !isFree;
              const discountPercent = hasDiscount && actualPrice > 0
                ? Math.round(((actualPrice - discountPrice) / actualPrice) * 100)
                : 0;

              const descPreview = truncateDescription(course.description, 110);
              const plainDescFull = course.description ? course.description.replace(/\s+/g, ' ').trim() : '';

              return (
                <article className="app-course-card" key={course.id}>
                  {/* Media Banner with Status Badges */}
                  <div className="app-course-media">
                    {course.images?.[0] ? (
                      <img
                        src={course.images[0]}
                        alt={course.title || 'Course thumbnail'}
                        loading="lazy"
                      />
                    ) : (
                      <div className="app-course-placeholder">
                        <BookOpen size={36} />
                        <span>Cyber Course</span>
                      </div>
                    )}

                    <div className="app-course-badges">
                      <div>
                        {course.is_live_session || course.course_type === 'LIVE' ? (
                          <span className="app-badge-live">
                            <span className="app-live-dot" /> LIVE SESSION
                          </span>
                        ) : course.course_type ? (
                          <span className="app-badge-type">{course.course_type}</span>
                        ) : null}
                      </div>

                      <div>
                        {isFree ? (
                          <span className="app-badge-free">FREE</span>
                        ) : discountPercent > 0 ? (
                          <span className="app-badge-discount">{discountPercent}% OFF</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Course Body */}
                  <div className="app-course-body">
                    {/* Instructor Info */}
                    <div className="app-course-instructor">
                      <User size={13} />
                      <span>{course.Instructor?.name || 'Curriculum Instructor'}</span>
                    </div>

                    {/* Course Title (2 lines clamp) */}
                    <h3 className="app-course-title" title={course.title}>
                      {course.title}
                    </h3>

                    {/* Description (Limited characters & 2 lines clamp) */}
                    <p className="app-course-desc" title={plainDescFull}>
                      {descPreview || 'Comprehensive awareness curriculum with practical sessions and learning materials.'}
                    </p>

                    {/* Metadata Chips */}
                    <div className="app-course-meta">
                      <span className="app-course-meta-item">
                        <Clock size={13} /> {course.course_duration || 0} hrs
                      </span>
                      {course.course_type && (
                        <span className="app-course-meta-item">
                          <BookOpen size={13} /> {course.course_type}
                        </span>
                      )}
                      {course.is_certificate_enabled && (
                        <span className="app-course-meta-item">
                          <Award size={13} /> Certificate
                        </span>
                      )}
                    </div>

                    {/* Footer: Price & Curriculum Link */}
                    <div className="app-course-footer">
                      <div className="app-course-pricing">
                        {isFree ? (
                          <span className="app-course-price is-free">Free</span>
                        ) : (
                          <>
                            <span className="app-course-price">
                              ₹{Number(discountPrice).toLocaleString('en-IN')}
                            </span>
                            {hasDiscount && (
                              <span className="app-course-original-price">
                                ₹{Number(actualPrice).toLocaleString('en-IN')}
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      <Link
                        className="app-course-btn"
                        to={`/classes/${course.id}`}
                        aria-label={`View curriculum for ${course.title}`}
                      >
                        View curriculum <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="ngo-contact-panel">
        <h2>Your learning journey</h2>
        <ol className="app-simple-list">
          <li>Browse the course and review its classes, instructor, duration and price.</li>
          <li>Sign in, then enroll or complete the required purchase.</li>
          <li>Join available live classes and watch recorded lessons.</li>
          <li>Open notes and materials, complete MCQs and review results.</li>
          <li>Return through My Library and download a certificate when the course allows it and requirements are met.</li>
        </ol>
        <p>Course availability, fees and certificate settings come from each course. Participation does not imply that every course awards a professional accreditation.</p>
      </section>

      <AppDownload />
    </AppContentLayout>
  );
}
