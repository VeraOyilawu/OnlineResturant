const verifyOtp = async (req, res) => {
    try {
        const { token } = req.params;
        const { otp } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token not found' });
        }
        if (!otp) {
            return res.status(400).json({ message: 'OTP input cannot be empty' });
        }

        const { email } = jwt.verify(token, process.env.SECRET_KEY);
        const user = await personModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email not assigned' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        const latestOtp = await otpModel.findOne({ _id: user.otpId });

        if (!latestOtp) {
            return res.status(404).json({ message: 'OTP not found' });
        }
        
        const isOtpValid = await bcrypt.compare(otp, latestOtp.otp);

        if (!isOtpValid) {
            return res.status(400).json({ message: 'OTP not valid' });
        } else {
            user.isVerified = true;
            await user.save();

            await otpModel.deleteOne({ _id: latestOtp._id }); // Delete the used OTP

            res.status(200).json({ message: 'User verified successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};