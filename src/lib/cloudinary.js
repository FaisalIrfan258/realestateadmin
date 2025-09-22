// Cloudinary upload utility - Server-side upload without presets

export const uploadToCloudinary = async (file, resourceType = 'image') => {
  try {
    // Create FormData with the file
    const formData = new FormData()
    formData.append('file', file)
    formData.append('resourceType', resourceType)

    // Send to our backend API endpoint for Cloudinary upload
    const response = await fetch('/api/upload/cloudinary', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

export const uploadMultipleFiles = async (files, resourceType = 'image') => {
  const uploadPromises = files.map(file => uploadToCloudinary(file, resourceType))
  return Promise.all(uploadPromises)
}