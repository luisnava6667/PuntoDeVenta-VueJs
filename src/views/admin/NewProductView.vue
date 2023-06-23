<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import Link from '@/components/Link.vue';
import useImage from '@/composables/useImage';
import { useProductsStore } from '@/stores/products';

const { onFileChange, url, isImageUploaded } = useImage();
const products = useProductsStore();
const router = useRouter();
const formData = reactive({
    name: '',
    category: '',
    price: '',
    availability: '',
    image: ''
});
const submitHandler = async (data) => {
    const { image, ...values } = data
    try {
        await products.createProduct({
            ...values, image: url.value
        })
        router.push({ name: 'products' })
    } catch (error) {
        console.log(error);
    }
};
</script>

<template>
    <div class="">
        <Link to="products">
        Volver</Link>
        <h1 class="text-4xl font-black my-10">Nuevo Producto</h1>
        <div class="flex justify-center bg-white shadow">
            <div class="mt-10 p-10 w-full 2xl:w-2/4">
                <FormKit type="form" submit-label="Agregar Producto"
                    incomplete-message="No se puedo enviar, revisa los mensajes" @submit="submitHandler" :value="formData">
                    <FormKit type="text" label="Nombre" name="name" placeholder="Nombre del Producto" validation="required"
                        :validation-messages="{ required: 'El nombre del producto es obligatorio' }"
                        v-model.trim="formData.name" />
                    <FormKit type="file" label="Imagen Producto" name="image" validation="required"
                        :validation-messages="{ required: 'La imagen del producto es obligatorio' }" accept=".jpg"
                        multiple="false" @change="onFileChange" v-model.trim="formData.image" />
                    <div class="" v-if="isImageUploaded">
                        <p class="font-black">Imagen Producto:</p>
                        <img :src="url" alt="Nueva Imagen" class="w-32" />
                    </div>
                    <FormKit type="select" label="Categoria" name="category" validation="required"
                        :validation-messages="{ required: 'La categoria es obligatorio' }"
                        :options="products.categoryOptions" v-model.number="formData.category" />
                    <FormKit type="number" label="Precio" name="price" validation="required"
                        placeholder="Precio del Producto" :validation-messages="{ required: 'El precios es obigatorio' }"
                        min="1" v-model.number="formData.price" />
                    <FormKit type="number" label="Disponibles" name="availability" validation="required"
                        placeholder="Cantidad Disponible " :validation-messages="{ required: 'La cantidad es obligatoria' }"
                        min="1" v-model.number="formData.availability" />
                </FormKit>
            </div>
        </div>
    </div>
</template>