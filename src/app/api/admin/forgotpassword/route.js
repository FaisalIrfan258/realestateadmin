import { NextResponse } from "next/server";
import crypto from "crypto";

// This would typically connect to your database
// For this example, we'll mock the database operations
async function findAdminByEmail(email) {
  // In a real implementation, query your database
  console.log(`Finding admin with email: ${email}`);
  
  // Mock response - in a real app, you'd query your database
  // Return null if no user found with this email
  return {
    id: "admin-123",
    email: email,
    name: "Admin User"
  };
}

async function createPasswordResetToken(adminId) {
  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString("hex");
  
  // Hash the token for storage (for security)
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  
  // Set expiry to 10 minutes from now
  const resetTokenExpiry = Date.now() + 10 * 60 * 1000;
  
  // In a real implementation, save this to your database
  console.log(`Created reset token for admin ${adminId}. Token expires at ${new Date(resetTokenExpiry)}`);
  
  // Store in database:
  // await db.admin.update({
  //   where: { id: adminId },
  //   data: {
  //     resetToken: hashedToken,
  //     resetTokenExpiry
  //   }
  // });
  
  return resetToken; // Return the unhashed token
}

async function sendPasswordResetEmail(email, resetToken) {
  try {
    // In a real implementation, you'd send an actual email
    // using a service like SendGrid, Mailgun, etc.
    console.log(`Sending password reset email to ${email}`);
    console.log(`Reset URL: ${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password/${resetToken}`);
    
    // For development purposes, just log the token
    console.log(`Reset Token (for development): ${resetToken}`);
    
    // Mock successful email sending
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    // Instead of throwing, we'll return false and handle this gracefully
    return false;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }
    
    // Find admin by email
    const admin = await findAdminByEmail(email);
    
    // If no admin found, don't reveal this information for security
    // Instead, return a generic success message
    if (!admin) {
      // We return a success message even if no account exists
      // This prevents email enumeration attacks
      return NextResponse.json({
        success: true,
        message: "Password reset email sent",
      });
    }
    
    // Generate password reset token
    const resetToken = await createPasswordResetToken(admin.id);
    
    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken);
    
    if (!emailSent) {
      // For development, include the token in the response
      // In production, you should remove this and properly set up email
      return NextResponse.json({
        success: true,
        message: "Password reset email sent",
        resetToken, // Only include this in development
        resetUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin}/reset-password/${resetToken}`
      });
    }
    
    return NextResponse.json({
      success: true,
      message: "Password reset email sent",
    });
    
  } catch (error) {
    console.error("Error in forgotpassword API:", error);
    return NextResponse.json(
      { message: "An error occurred processing your request" },
      { status: 500 }
    );
  }
} 