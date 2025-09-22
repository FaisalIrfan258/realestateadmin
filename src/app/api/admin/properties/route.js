import { NextRequest, NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const propertyData = await request.json()
    
    // Validate required fields
    const { category, title, description, price, location, area } = propertyData
    
    if (!category || !title || !description || !price || !location || !area) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate data types
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }
    
    // Create property object with defaults
    const property = {
      category,
      title,
      description,
      price,
      location,
      area,
      bedrooms: propertyData.bedrooms || 0,
      bathrooms: propertyData.bathrooms || 0,
      amenities: propertyData.amenities || [],
      images: propertyData.images || [],
      videos: propertyData.videos || [],
      createdAt: new Date().toISOString()
    }
    
    // Here you would save to your database
    // For now, we'll just return the data
    console.log('Property data received:', property)
    
    return NextResponse.json({
      success: true,
      message: 'Property created successfully',
      data: property
    })
    
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Invalid JSON data or internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Placeholder for fetching properties from database
    const properties = []
    
    return NextResponse.json({
      success: true,
      data: properties
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}