const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

class CertificateService {
  async generateCertificate(userId, courseId) {
    // 1. Check if course is fully completed
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: {
        course: { include: { modules: { include: { lessons: true } } } },
        progress: true,
      },
    });

    if (!enrollment) throw ApiError.notFound('Not enrolled in this course');

    // Total lessons
    let totalLessons = 0;
    enrollment.course.modules.forEach((m) => {
      totalLessons += m.lessons.length;
    });

    const completedLessons = enrollment.progress.filter((p) => p.isCompleted).length;

    if (completedLessons < totalLessons || totalLessons === 0) {
      throw ApiError.badRequest('Course not fully completed yet');
    }

    // 2. Check if cert already exists
    let cert = await prisma.certificate.findFirst({
      where: { userId, courseId },
    });

    if (cert) return cert;

    // 3. Generate mock PDF URL (In production, use PDFKit & Cloudinary)
    const mockPdfUrl = `https://mock-certificate-gen.com/cert_${userId}_${courseId}.pdf`;

    cert = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        pdfUrl: mockPdfUrl,
      },
    });

    return cert;
  }

  async getMyCertificates(userId) {
    return await prisma.certificate.findMany({
      where: { userId },
      include: {
        user: { select: { name: true } },
      },
    });
  }
}

module.exports = new CertificateService();
