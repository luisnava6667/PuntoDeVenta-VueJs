import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useFirestore, useCollection, useFirebaseStorage } from 'vuefire'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { ref as storageRef, deleteObject } from 'firebase/storage'
export const useProductsStore = defineStore('products', () => {
  const db = useFirestore()
  const storage = useFirebaseStorage()
  const selectedCategory = ref(1)
  const categories = [
    { id: 1, name: 'Sudaderas' },
    { id: 2, name: 'Tenis' },
    { id: 3, name: 'Lentes' }
  ]
  const q = query(collection(db, 'products'), orderBy('availability', 'asc'))
  const productsCollection = useCollection(q)
  async function createProduct(product) {
    await addDoc(collection(db, 'products'), product)
  }
  async function updateProduct(docRef, product) {
    const { image, url, ...values } = product
    if (image.length) {
      await updateDoc(docRef, { ...values, image: url.value })
    } else {
      await updateDoc(docRef, values)
    }
  }
  async function deleteProduct(id) {
    if (confirm('¿Estas seguro de eliminar este producto?')) {
      const docRef = doc(db, 'products', id)
      const docSnap = await getDoc(docRef)
      const { image } = docSnap.data()
      const imageRef = storageRef(storage, image)
      await Promise.all([deleteDoc(docRef), deleteObject(imageRef)])
    }
  }
  const categoryOptions = computed(() => {
    const options = [
      {
        label: 'Selecciona una categoria',
        value: '',
        attrs: { disabled: true }
      },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id
      }))
    ]
    return options
  })
  const noResults = computed(() => productsCollection.value.length === 0)
  const filterProducts = computed(() => {
    return productsCollection.value
      .filter((product) => product.category === selectedCategory.value)
      .filter((product) => product.availability > 0)
  })
  return {
    categoryOptions,
    createProduct,
    productsCollection,
    categories,
    selectedCategory,
    updateProduct,
    deleteProduct,
    noResults,
    filterProducts
  }
})
