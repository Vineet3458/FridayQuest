import crypto from 'crypto';
import { Organization, IOrganization } from '../../models/Organization.js';
import { User, IUser } from '../../models/User.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { AuthUserPayload, UserRole } from '../../types/index.js';

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
      throw new Error('An account with this email already exists.');
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
      throw new Error('Invalid invite code. Organization not found.');
    }

    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new Error('An account with this email already exists.');
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

    const tokenPayload: AuthUserPayload = {
      userId: user._id.toString(),
      orgId: organization._id.toString(),
      role: user.role,
      email: user.email,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

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
      tokens: { accessToken, refreshToken },
    };
  }

  public static async login(input: { email: string; password: string }) {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    if (user.status === 'pending') {
      throw new Error('Your account is pending approval by the organization admin.');
    }

    const tokenPayload: AuthUserPayload = {
      userId: user._id.toString(),
      orgId: user.orgId.toString(),
      role: user.role,
      email: user.email,
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
      },
      tokens: { accessToken, refreshToken },
    };
  }

  public static async refreshAccessToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.userId);
    if (!user || user.status !== 'active') {
      throw new Error('Invalid refresh session.');
    }

    const newPayload: AuthUserPayload = {
      userId: user._id.toString(),
      orgId: user.orgId.toString(),
      role: user.role,
      email: user.email,
    };

    const accessToken = signAccessToken(newPayload);
    return { accessToken };
  }

  public static async trialLogin(role: UserRole) {
    let org = await Organization.findOne({ slug: 'kirxa-demo' });
    if (!org) {
      org = await Organization.create({
        name: 'Kirxa Demo Workspace',
        slug: 'kirxa-demo',
        inviteCode: 'KIRXA-DEMO',
        settings: { autoApprove: true, timezone: 'UTC' },
      });
    }

    const roleProfiles: Record<UserRole, { name: string; email: string; department: string }> = {
      superAdmin: { name: 'Kirxa SuperAdmin', email: 'superadmin@kirxa.demo', department: 'Platform Ops' },
      orgAdmin: { name: 'Riya Sharma (HR Admin)', email: 'riya.hr@kirxa.demo', department: 'People & Culture' },
      organizer: { name: 'Kabir Patel (Friday Host)', email: 'kabir.host@kirxa.demo', department: 'Engineering' },
      player: { name: 'Ananya Sen (Player)', email: 'ananya.player@kirxa.demo', department: 'Design' },
    };

    const profile = roleProfiles[role] || roleProfiles.player;

    let user = await User.findOne({ email: profile.email });
    if (!user) {
      const passwordHash = await hashPassword('trialpassword123');
      user = await User.create({
        orgId: org._id,
        name: profile.name,
        email: profile.email,
        passwordHash,
        role,
        department: profile.department,
        status: 'active',
        xp: 350,
        level: 3,
      });
    } else {
      user.role = role;
      await user.save();
    }

    const tokenPayload: AuthUserPayload = {
      userId: user._id.toString(),
      orgId: org._id.toString(),
      role: user.role,
      email: user.email,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    return {
      organization: {
        id: org._id,
        name: org.name,
        inviteCode: org.inviteCode,
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
        orgId: user.orgId,
        xp: user.xp,
        level: user.level,
      },
      tokens: { accessToken, refreshToken },
    };
  }
}

