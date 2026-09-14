import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const DataContext = createContext(null)

function mapProduct(row) {
  return {
    slug: row.slug,
    name: row.name,
    desc: row.description,
    price: row.price,
    serves: row.serves,
    image: row.image_url || undefined,
    imagePosition: row.image_position || undefined,
    tag: row.tag || undefined,
    categories: row.category_ids || [],
    featured: row.is_featured || false,
    featuredOrder: row.featured_order || 0,
  }
}

function mapCategory(row) {
  return { id: row.id, label: row.label, blurb: row.blurb }
}

function mapTestimonial(row) {
  return { id: row.id, quote: row.quote, name: row.name, role: row.role }
}

export function DataProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const [catRes, prodRes, testRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select('*').order('sort_order'),
      supabase.from('testimonials').select('*').order('sort_order'),
    ])
    if (catRes.error || prodRes.error || testRes.error) {
      setError(catRes.error || prodRes.error || testRes.error)
    } else {
      setCategories(catRes.data.map(mapCategory))
      setProducts(prodRes.data.map(mapProduct))
      setTestimonials(testRes.data.map(mapTestimonial))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <DataContext.Provider value={{ categories, products, testimonials, loading, error, refetch }}>
      {children}
    </DataContext.Provider>
  )
}

export function useCatalog() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useCatalog must be used within DataProvider')
  return ctx
}

export function getCategoryItems(products, categoryId) {
  return products.filter((p) => p.categories.includes(categoryId))
}

export function findProductBySlug(products, slug) {
  return products.find((p) => p.slug === slug) ?? null
}

export function getFeaturedProducts(products, limit = 3) {
  return products
    .filter((p) => p.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
    .slice(0, limit)
}
