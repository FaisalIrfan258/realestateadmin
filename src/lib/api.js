import Cookies from "js-cookie"


export const getAuthHeader = () => {
  const token = Cookies.get("token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const getAuthHeaderWithoutContentType = () => {
  const token = Cookies.get("token")
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || ""
  }
  return ""
}

export const fetchProperties = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/properties`, {
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch properties")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching properties:", error)
    throw error
  }
}

export const fetchPropertyById = async (id) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/properties/${id}`, {
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch property")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching property:", error)
    throw error
  }
}

export const createProperty = async (propertyData) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/properties`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(propertyData), 
    })

    if (!response.ok) {
      throw new Error("Failed to create property")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating property:", error)
    throw error
  }
}

export const updateProperty = async (id, propertyData) => {
  try {
    // Check if propertyData is FormData
    const isFormData = propertyData instanceof FormData;
    
    const response = await fetch(`${getBaseUrl()}/api/admin/properties/${id}`, {
      method: "PUT",
      headers: isFormData ? getAuthHeaderWithoutContentType() : getAuthHeader(),
      body: isFormData ? propertyData : JSON.stringify(propertyData),
    })

    if (!response.ok) {
      throw new Error("Failed to update property")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating property:", error)
    throw error
  }
}

export const deleteProperty = async (id) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/properties/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Failed to delete property")
    }

    const data = await response.json()
    // Return a simple success message instead of the full data object
    return { success: true, message: "Property deleted successfully" }
  } catch (error) {
    console.error("Error deleting property:", error)
    throw error
  }
}

export const fetchContacts = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/contacts`, {
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch contacts")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching contacts:", error)
    throw error
  }
}

export const fetchContactById = async (id) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/contacts/${id}`, {
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch contact")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching contact:", error)
    throw error
  }
}

export const deleteContact = async (id) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/contacts/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Failed to delete contact")
    }

    const data = await response.json()
    // Return a simple success message instead of the full data object
    return { success: true, message: "Contact deleted successfully" }
  } catch (error) {
    console.error("Error deleting contact:", error)
    throw error
  }
}

export const registerAdmin = async (userData) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error("Failed to register admin")
    }

    return await response.json()
  } catch (error) {
    console.error("Error registering admin:", error)
    throw error
  }
}

export const changePassword = async (passwordData) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/change-password`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify(passwordData),
    })

    if (!response.ok) {
      throw new Error("Failed to change password")
    }

    return await response.json()
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}

export const logoutAdmin = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/logout`, {
      method: "POST",
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Failed to logout")
    }

    return await response.json()
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/forgotpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error("Failed to send reset password email")
    }

    return await response.json()
  } catch (error) {
    console.error("Error in forgot password request:", error)
    throw error
  }
}

export const resetPassword = async (resetToken, password) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/resetpassword/${resetToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })

    if (!response.ok) {
      throw new Error("Failed to reset password")
    }

    return await response.json()
  } catch (error) {
    console.error("Error resetting password:", error)
    throw error
  }
}

