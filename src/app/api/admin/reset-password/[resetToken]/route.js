import { NextResponse } from "next/server";
import crypto from "crypto";

// This would typically connect to your database
// For this example, we'll mock the database operations
async function findAdminByResetToken(hashedToken) {
  // In a real implementation, query your database
  console.log(`Finding admin with reset token: ${hashedToken}`);
  
  // Mock admin with valid token (in a real app, you'd query your database)
  // We're assuming this token exists and is valid
  return {
    id: "admin-123",
    email: "admin@example.com",
    name: "Admin User",
    resetTokenExpiry: Date.now() + 5 * 60 * 1000 // Valid for 5 more minutes
  };
}

async function resetPassword(adminId, newPassword) {
  // In a real implementation, hash the password and update in your database
  console.log(`Resetting password for admin ${adminId}`);
  
  // Mock password update:
  // await db.admin.update({
  //   where: { id: adminId },
  //   data: {
  //     password: hashedPassword,
  //     resetToken: null,
  //     resetTokenExpiry: null
  //   }
  // });
  
  return true;
}

export async function POST(request, { params }) {
  try {
    const { resetToken } = params;
    const body = await request.json();
    const { password } = body;
    
    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }
    
    // Hash the token from the URL to compare with the hashed token in the database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    
    // Find admin with this reset token
    const admin = await findAdminByResetToken(hashedToken);
    
    // If no admin found or token expired
    if (!admin || admin.resetTokenExpiry < Date.now()) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }
    
    // Reset the password
    await resetPassword(admin.id, password);
    
    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully"
    });
    
  } catch (error) {
    console.error("Error in reset-password API:", error);
    return NextResponse.json(
      { message: "An error occurred resetting your password" },
      { status: 500 }
    );
  }
} 