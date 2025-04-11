import Cookies from "js-cookie"


export const getAuthHeader = () => {
  const token = Cookies.get("token")
  return {
    "Content-Type": "application/json",
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

export const createProperty = async (formData) => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/properties`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
      body: formData, 
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
    const response = await fetch(`${getBaseUrl()}/api/admin/properties/${id}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify(propertyData),
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

    return await response.json()
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

    return await response.json()
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

