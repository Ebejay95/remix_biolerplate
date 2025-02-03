import { User } from "~/models/user.server";
import bcrypt from "bcryptjs";

export async function ensureMasterUser() {
    const masterEmail = process.env.MASTER_USER_EMAIL;
    const masterPassword = process.env.MASTER_USER_PASSWORD;

    if (!masterEmail || !masterPassword) {
        console.error("Missing master user credentials in environment variables");
        return;
    }

    try {
        // Delete all users with role 'master'
        const deleteResult = await User.deleteMany({ role: 'master' });
        console.log(`Deleted ${deleteResult.deletedCount} existing master users`);

        const newUser = await User.create({
            email: masterEmail,
            password: masterPassword,
            role: 'master',
            verified: true
        });

        console.log('Master user created:', {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role
        });

        const verifyUser = await User.findOne({ email: masterEmail }).select('+password');
        if (verifyUser) {
            const passwordValid = await bcrypt.compare(masterPassword, verifyUser.password);
            if (!passwordValid) {
                throw new Error('Password verification failed for new master user');
            }
        }

    } catch (error) {
        console.error('Error in ensureMasterUser:', error);
        throw error;
    }
}
