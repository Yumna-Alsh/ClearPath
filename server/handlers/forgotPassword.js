const forgotPasswordHandler = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    console.log(`Simulating password reset for: ${email}`);
  
  
    return res.status(200).json({ message: "Reset link sent if account exists" });
  };
  
  module.exports = forgotPasswordHandler;
  