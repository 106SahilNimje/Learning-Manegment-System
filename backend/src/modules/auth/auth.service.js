const prisma = require('../../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../../utils/ApiError');

class AuthService {
  async register(data, tenantId = null) {
    const { name, email, password, role } = data;

    // Use tenantId from body or from middleware
    const resolvedTenantId = data.tenantId || tenantId || null;

    // Check if user exists (scoped to tenant if provided)
    const whereClause = resolvedTenantId
      ? { email_tenantId: { email, tenantId: resolvedTenantId } }
      : { email_tenantId: { email, tenantId: null } };

    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({ where: whereClause });
    } catch {
      // If compound unique fails (e.g. null tenantId), fall back to findFirst
      existingUser = await prisma.user.findFirst({
        where: { email, tenantId: resolvedTenantId },
      });
    }

    if (existingUser) {
      throw ApiError.conflict('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'STUDENT',
        tenantId: resolvedTenantId,
      },
    });

    // Generate token
    const token = this.generateToken(user);

    return { user: this.sanitizeUser(user), token };
  }

  async login(data) {
    const { email, password } = data;

    // Find user by email (may match multiple tenants — take first match)
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return { user: this.sanitizeUser(user), token };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  sanitizeUser(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = new AuthService();
