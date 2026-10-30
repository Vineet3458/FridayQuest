import crypto from 'crypto';
import { Organization, IOrganization } from '../../models/Organization.js';
import { User, IUser } from '../../models/User.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { AuthUserPayload } from '../../types/index.js';
import { HttpError } from '../../utils/HttpError.js';

function generateInviteCode(companyName: string): string {
  const prefix = companyName.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase() || 'FRIDAY';
  const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}-${randomSuffix}`;
}

export class AuthService {
  public static async registerOrganization(input: {
    companyName: string;
    adminName: string;
    email: string;
    password: string;
  }) {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new HttpError('An account with this email already exists.', 409);
    }

    const slug = input.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + crypto.randomBytes(2).toString('hex');
    const inviteCode = generateInviteCode(input.companyName);

    const organization = await Organization.create({
      name: input.companyName,
      slug,
      inviteCode,
      settings: {
        autoApprove: true,
        timezone: 'UTC',
      },
    });

    const passwordHash = await hashPassword(input.password);
    const adminUser = await User.create({
      orgId: organization._id,
      name: input.adminName,
      email: input.email.toLowerCase(),
      passwordHash,
      role: 'orgAdmin',
      department: 'Management',
      status: 'active',
    });

    const tokenPayload: AuthUserPayload = {
      userId: adminUser._id.toString(),
      orgId: organization._id.toString(),
      role: adminUser.role,
      email: adminUser.email,
      tokenVersion: adminUser.tokenVersion || 0,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    return {
      organization,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        department: adminUser.department,
        status: adminUser.status,
        xp: adminUser.xp || 950,
        level: adminUser.level || 5,
      },
      tokens: { accessToken, refreshToken },
    };
  }

  public static async registerEmployee(input: {
    inviteCode: string;
    name: string;
    email: string;
    password: string;
    department?: string;
  }) {
    const organization = await Organization.findOne({
      inviteCode: input.inviteCode.toUpperCase().trim(),
    });

    if (!organization) {
      throw new HttpError('Invalid invite code. Organization not found.', 400);
    }

    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new HttpError('An account with this email already exists.', 409);
    }

    const passwordHash = await hashPassword(input.password);
    const status = organization.settings.autoApprove ? 'active' : 'pending';

    const user = await User.create({
      orgId: organization._id,
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: 'player',
      department: input.department || 'General',
      status,
    });

    let tokens: { accessToken: string; refreshToken: string } | null = null;
    if (status === 'active') {
      const tokenPayload: AuthUserPayload = {
        userId: user._id.toString(),
        orgId: organization._id.toString(),
        role: user.role,
        email: user.email,
        tokenVersion: user.tokenVersion || 0,
      };
      tokens = {
        accessToken: signAccessToken(tokenPayload),
        refreshToken: signRefreshToken(tokenPayload),
      };
    }

    return {
      organization: {
        id: organization._id,
        name: organization.name,
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
      },
      tokens,
    };
  }

  public static async login(input: { email: string; password: string }) {
    const user = await User.findOne({ email: input.email.toLowerCase() }).select('+tokenVersion');
    if (!user) {
      throw new HttpError('Invalid email or password.', 401);
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw new HttpError('Invalid email or password.', 401);
    }

    if (user.status === 'pending') {
      throw new HttpError('Your account is pending approval by the organization admin.', 403);
    }

    const tokenPayload: AuthUserPayload = {
      userId: user._id.toString(),
      orgId: user.orgId.toString(),
      role: user.role,
      email: user.email,
      tokenVersion: user.tokenVersion || 0,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
        orgId: user.orgId,
        xp: user.xp || 350,
        level: user.level || 2,
      },
      tokens: { accessToken, refreshToken },
    };
  }

  public static async refreshAccessToken(refreshToken: string) {
    let payload: AuthUserPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new HttpError('Invalid refresh session.', 401);
    }
    const user = await User.findById(payload.userId).select('+tokenVersion');
    if (
      !user ||
      user.status !== 'active' ||
      (payload.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)
    ) {
      throw new HttpError('Invalid refresh session.', 401);
    }

    const newPayload: AuthUserPayload = {
      userId: user._id.toString(),
      orgId: user.orgId.toString(),
      role: user.role,
      email: user.email,
      tokenVersion: user.tokenVersion || 0,
    };

    const accessToken = signAccessToken(newPayload);
    return { accessToken };
  }

  public static async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
  }

  public static async getMe(userId: string) {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      throw new HttpError('User account not found.', 404);
    }
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      orgId: user.orgId?.toString(),
      xp: user.xp || 0,
      level: user.level || 1,
    };
  }
}
