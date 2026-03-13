import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, PlayCircle, Menu, X, ArrowLeft, Trophy, AlertTriangle, Award, Download, Loader2 } from 'lucide-react';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  // Mock Data
  const course = {
    title: 'Complete Web Development Bootcamp',
    modules: [
      {
        id: 'm1', title: 'Introduction',
        lessons: [
          { id: 'l1', title: 'How the internet works', duration: '5:30', completed: true },
          { id: 'l2', title: 'Setting up environment', duration: '12:45', completed: false }
        ]
      },
      {
        id: 'm2', title: 'Frontend Basics',
        lessons: [
          { id: 'l3', title: 'HTML5 Semantic Tags', duration: '15:20', completed: false },
        ]
      }
    ]
  };

  const [activeLesson, setActiveLesson] = useState(course.modules[0].lessons[1]);

  // Dynamic completion calculation
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.filter(l => l.completed).length, 0
  );
  const isCourseComplete = completedLessons === totalLessons && totalLessons > 0;

  // Handle certification click
  const handleCertificationClick = async () => {
    if (!isCourseComplete) {
      setShowIncompleteModal(true);
      return;
    }

    // Generate certificate
    setCertificateLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/v1/certificates/generate/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const data = await res.json();
      if (data.success) {
        setCertificateData(data.data);
      } else {
        alert(data.message || 'Certificate generation failed');
      }
    } catch (err) {
      // Fallback mock for development
      setCertificateData({
        id: 'mock-cert-1',
        pdfUrl: `https://mock-certificate-gen.com/cert_${courseId}.pdf`,
        createdAt: new Date().toISOString()
      });
    } finally {
      setCertificateLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      {!sidebarOpen && (
        <button 
          className="absolute top-20 left-4 z-20 p-2 bg-white rounded-md shadow-md lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Main Content (Video Player) */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:mr-80' : ''} overflow-y-auto`}>
        <div className="bg-gray-900 w-full aspect-video flex items-center justify-center relative">
          {/* Mock Video Player */}
          <div className="text-center text-white">
            <PlayCircle className="h-20 w-20 mx-auto text-gray-500 mb-4 opacity-80 hover:opacity-100 cursor-pointer transition" />
            <p className="text-xl font-medium">{activeLesson.title}</p>
            <p className="text-sm text-gray-400 mt-2">Mock Video Player (YouTube/Cloudinary Embed Here)</p>
          </div>
        </div>

        <div className="p-8 max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{activeLesson.title}</h2>
              <p className="text-gray-500 mt-2">{course.title}</p>
            </div>
            <button className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-md font-medium hover:bg-green-200 transition">
              <CheckCircle className="h-5 w-5" />
              Mark Completed
            </button>
          </div>
          
          <div className="prose max-w-none text-gray-700">
            <h3 className="text-xl font-bold mb-4">Lesson Resources</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><a href="#" className="text-primary-600 hover:underline">Download Presentation PDF</a></li>
              <li><a href="#" className="text-primary-600 hover:underline">Source Code Repository</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sidebar Curriculum */}
      <div className={`fixed inset-y-16 right-0 w-80 bg-gray-50 border-l border-gray-200 transform transition-transform duration-300 z-30 overflow-y-auto ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0">
          <h3 className="font-bold text-gray-900">Course Content</h3>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 p-1 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          <div className="space-y-4">
            {course.modules.map((module, mIdx) => (
              <div key={module.id}>
                <h4 className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-wider">
                  Module {mIdx + 1}: {module.title}
                </h4>
                <div className="space-y-1">
                  {module.lessons.map((lesson, lIdx) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full text-left p-3 rounded-md text-sm flex gap-3 transition ${
                        activeLesson.id === lesson.id ? 'bg-primary-50 border border-primary-100' : 'hover:bg-gray-100'
                      }`}
                    >
                      {lesson.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                      )}
                      
                      <div>
                        <p className={`font-medium ${activeLesson.id === lesson.id ? 'text-primary-700' : 'text-gray-700'}`}>
                          {lIdx + 1}. {lesson.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{lesson.duration}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* ===== CERTIFICATION SECTION ===== */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Certification
            </h4>

            {/* Progress indicator */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{completedLessons}/{totalLessons} lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${isCourseComplete ? 'bg-green-500' : 'bg-primary-600'}`}
                  style={{ width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {certificateData ? (
              /* Certificate already generated */
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <Award className="h-10 w-10 text-green-600 mx-auto mb-2" />
                <h4 className="font-bold text-green-800 text-sm">Certificate Generated! 🎉</h4>
                <p className="text-xs text-green-600 mt-1 mb-3">Congratulations on completing this course!</p>
                <a 
                  href={certificateData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition text-sm shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  Download Certificate
                </a>
              </div>
            ) : (
              /* Get Certificate button */
              <button
                onClick={handleCertificationClick}
                disabled={certificateLoading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition shadow-sm ${
                  isCourseComplete
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 cursor-pointer'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600 cursor-pointer'
                }`}
              >
                {certificateLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4" />
                    {isCourseComplete ? 'Get Certificate' : 'Get Certificate 🔒'}
                  </>
                )}
              </button>
            )}

            {!isCourseComplete && !certificateData && (
              <p className="text-xs text-gray-400 mt-2 text-center">
                Complete all lessons to unlock certificate
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ===== INCOMPLETE COURSE MODAL ===== */}
      {showIncompleteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowIncompleteModal(false)}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          {/* Modal */}
          <div 
            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-[fadeInUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Modules Incomplete!
            </h3>
            
            <p className="text-gray-600 mb-4">
              Pehle saare modules complete karo! Certificate tabhi generate hoga jab saare lessons complete ho jayenge.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Your Progress</span>
                <span className="text-primary-600 font-bold">{completedLessons}/{totalLessons} lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {totalLessons - completedLessons} more lesson{totalLessons - completedLessons !== 1 ? 's' : ''} remaining
              </p>
            </div>
            
            <button
              onClick={() => setShowIncompleteModal(false)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition text-sm"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
