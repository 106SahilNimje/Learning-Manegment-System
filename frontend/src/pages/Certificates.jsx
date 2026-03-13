import { Award, Download, Eye, Calendar, BookOpen } from 'lucide-react';

const Certificates = () => {
  // Mock certificates data
  const certificates = [
    {
      id: 'CERT-001',
      courseName: 'Complete Web Development Bootcamp',
      issueDate: '2026-02-28',
      instructor: 'John Smith',
      duration: '42 hours',
      pdfUrl: '#',
      credentialId: 'LMS-WEB-2026-0284',
    },
    {
      id: 'CERT-002',
      courseName: 'JavaScript Advanced Concepts',
      issueDate: '2026-01-15',
      instructor: 'Jane Doe',
      duration: '28 hours',
      pdfUrl: '#',
      credentialId: 'LMS-JS-2026-0159',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-500 mt-2">Download and share your earned certificates</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-6 text-white shadow-sm">
            <Award className="h-10 w-10 mb-3 opacity-80" />
            <p className="text-3xl font-bold">{certificates.length}</p>
            <p className="text-sm font-medium opacity-90">Certificates Earned</p>
          </div>
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white shadow-sm">
            <BookOpen className="h-10 w-10 mb-3 opacity-80" />
            <p className="text-3xl font-bold">{certificates.reduce((sum, c) => sum + parseInt(c.duration), 0)} hrs</p>
            <p className="text-sm font-medium opacity-90">Total Learning Hours</p>
          </div>
        </div>

        {/* Certificate Cards */}
        {certificates.length > 0 ? (
          <div className="space-y-5">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="flex flex-col md:flex-row">
                  {/* Certificate Preview */}
                  <div className="md:w-60 bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                        <Award className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Certificate</p>
                      <p className="text-xs text-amber-600 mt-1">of Completion</p>
                    </div>
                  </div>

                  {/* Certificate Info */}
                  <div className="flex-1 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.courseName}</h3>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm mb-4">
                      <div>
                        <span className="text-gray-400 block text-xs font-medium">Instructor</span>
                        <span className="text-gray-700 font-medium">{cert.instructor}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-xs font-medium">Issue Date</span>
                        <span className="text-gray-700 font-medium flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(cert.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-xs font-medium">Duration</span>
                        <span className="text-gray-700 font-medium">{cert.duration}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-xs font-medium">Credential ID</span>
                        <span className="text-gray-700 font-mono text-xs">{cert.credentialId}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={cert.pdfUrl}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                      >
                        <Download className="h-4 w-4" /> Download PDF
                      </a>
                      <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                        <Eye className="h-4 w-4" /> Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <Award className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Certificates Yet</h3>
            <p className="text-gray-400">Complete a course to earn your first certificate!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
